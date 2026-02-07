import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Save, X, Trash2, MousePointerClick, ShieldAlert, UserCheck } from "lucide-react";
import L from 'leaflet';
import area from '@turf/area';
import { toast } from 'sonner';

// --- CONFIGURARE ICONIȚE LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- TIPURI DE DATE ---
interface Teren {
  id: string;
  numar_cadastral: string;
  numar_carte_funciara: string;
  adresa: string;
  tip_teren?: string;
  geojson: any;
  suprafata_calculata?: number;
}

const TIPURI_TEREN = [
    { value: 'arabil', label: 'Arabil (Galben)', color: '#eab308' },
    { value: 'constructii', label: 'Curți Construcții (Roșu)', color: '#ef4444' },
    { value: 'pasune', label: 'Pășune (Verde)', color: '#22c55e' },
    { value: 'padure', label: 'Pădure (Verde Închis)', color: '#14532d' },
];

// --- COMPONENTA CLICK HARTĂ ---
function MapClickEvents({ isDrawing, onAddPoint }: { isDrawing: boolean, onAddPoint: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onAddPoint(e.latlng);
      }
    },
  });
  return null;
}

// --- COMPONENTA PRINCIPALĂ ---
const HartaDigitala = () => {
  const [terenuri, setTerenuri] = useState<Teren[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeren, setSelectedTeren] = useState<Teren | null>(null);
  
  // ROLURI ȘI PERMISIUNI
  const [userRole, setUserRole] = useState<string>('');
  const [canAdd, setCanAdd] = useState(false);     // Admin + Registru
  const [canDelete, setCanDelete] = useState(false); // DOAR Admin
  
  // Stări Editor
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [editorPoints, setEditorPoints] = useState<L.LatLng[]>([]);
  const [newParcelDetails, setNewParcelDetails] = useState({
      numar_cadastral: '',
      tip_teren: 'arabil'
  });

  useEffect(() => {
    checkUserRole();
    fetchTerenuri();
  }, []);

  // 1. Verificăm Rolul
  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (data) {
        setUserRole(data.role);
        
        // Logica de permisiuni
        if (data.role === 'admin' || data.role === 'registru_agricol') {
            setCanAdd(true);
        }
        if (data.role === 'admin') {
            setCanDelete(true); // Doar admin are "Total Access"
        }
    }
  };

  // 2. Încărcăm parcelele
  const fetchTerenuri = async () => {
    try {
      const { data, error } = await supabase.from('terenuri').select('*');
      if (error) throw error;

      const processedData = data?.map((item: any) => ({
        ...item,
        suprafata_calculata: item.geojson ? Math.round(area(item.geojson)) : 0
      })) || [];

      setTerenuri(processedData);
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Funcții Utilitare Editor
  const handleAddPoint = (latlng: L.LatLng) => {
      setEditorPoints((prev) => [...prev, latlng]);
  };

  const calculateEditorArea = () => {
      if (editorPoints.length < 3) return 0;
      const coordinates = [
          [...editorPoints.map(p => [p.lng, p.lat]), [editorPoints[0].lng, editorPoints[0].lat]]
      ];
      const polygon = { type: "Polygon", coordinates };
      // @ts-ignore
      return Math.round(area(polygon));
  };

  // 4. Salvare (Create)
  const handleSaveTeren = async () => {
      if (editorPoints.length < 3) {
          alert("Minim 3 puncte necesare!");
          return;
      }
      if (!newParcelDetails.numar_cadastral) {
          alert("Completează numărul cadastral!");
          return;
      }

      try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) { alert("Sesiune expirată."); return; }

          const coordinates = [
            [...editorPoints.map(p => [p.lng, p.lat]), [editorPoints[0].lng, editorPoints[0].lat]]
          ];
          
          const newGeoJson = { type: "Polygon", coordinates };

          const { error } = await supabase.from('terenuri').insert({
              user_id: user.id,
              numar_cadastral: newParcelDetails.numar_cadastral,
              tip_teren: newParcelDetails.tip_teren,
              adresa: "Teren Digital",
              numar_carte_funciara: "N/A",
              geojson: newGeoJson
          });

          if (error) throw error;

          toast.success("Parcelă salvată!");
          setIsEditorMode(false);
          setEditorPoints([]);
          setNewParcelDetails({ numar_cadastral: '', tip_teren: 'arabil' });
          fetchTerenuri();

      } catch (err: any) {
          console.error(err);
          alert("Eroare: " + err.message);
      }
  };

  // 5. Ștergere (Delete) - DOAR ADMIN
  const handleDeleteTeren = async (id: string) => {
      if (!confirm("Ești sigur? Această acțiune este ireversibilă!")) return;

      try {
          const { error } = await supabase.from('terenuri').delete().eq('id', id);
          if (error) throw error;
          
          toast.success("Parcelă ștearsă definitiv.");
          setSelectedTeren(null);
          fetchTerenuri();
      } catch (err: any) {
          toast.error("Eroare la ștergere: " + err.message);
      }
  };

  const getParcelColor = (tip?: string) => {
    const found = TIPURI_TEREN.find(t => t.value === tip?.toLowerCase());
    return found ? found.color : '#3b82f6';
  };

  if (loading) return (
      <div className="flex h-[80vh] w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-3">Se încarcă harta...</span>
      </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border gap-4">
        <div>
          <h1 className="text-2xl font-bold">Harta Digitală Almaj</h1>
          <div className="flex gap-2 mt-1">
              {userRole === 'admin' && <Badge className="bg-red-600 flex gap-1"><ShieldAlert className="w-3 h-3"/> ADMIN - CONTROL TOTAL</Badge>}
              {userRole === 'registru_agricol' && <Badge className="bg-green-600 flex gap-1"><UserCheck className="w-3 h-3"/> Registru Agricol (Doar Adăugare)</Badge>}
          </div>
        </div>
        
        <div className="flex gap-2">
            {canAdd && !isEditorMode && (
                <Button onClick={() => setIsEditorMode(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Adaugă Parcelă
                </Button>
            )}

            {isEditorMode && (
                <Button variant="destructive" onClick={() => { setIsEditorMode(false); setEditorPoints([]); }}>
                    <X className="w-4 h-4 mr-2" /> Anulează
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        
        {/* HARTA */}
        <div className={`lg:col-span-${isEditorMode ? '2' : '2'} relative h-full rounded-xl overflow-hidden border shadow-lg`}>
          <MapContainer center={[44.42, 23.70]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; Google'
              url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              maxZoom={22}
            />

            <MapClickEvents isDrawing={isEditorMode} onAddPoint={handleAddPoint} />

            {!isEditorMode && terenuri.map((teren) => (
              <GeoJSON
                key={teren.id}
                data={teren.geojson}
                // @ts-ignore
                style={{ 
                    fillColor: getParcelColor(teren.tip_teren), 
                    weight: selectedTeren?.id === teren.id ? 3 : 1, 
                    color: 'white', 
                    fillOpacity: 0.6 
                }}
                eventHandlers={{ click: () => setSelectedTeren(teren) }}
              />
            ))}

            {isEditorMode && editorPoints.length > 0 && (
                <>
                    {editorPoints.map((pos, idx) => <Marker key={idx} position={pos} />)}
                    <Polygon positions={editorPoints} pathOptions={{ color: 'orange', dashArray: '5, 5' }} />
                </>
            )}
          </MapContainer>

          {isEditorMode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-lg z-[400] flex items-center gap-2 border border-orange-200">
                  <MousePointerClick className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">
                      Puncte: {editorPoints.length}
                  </span>
              </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 h-full overflow-y-auto">
          {isEditorMode ? (
             <Card className="h-full border-orange-200 border-2 shadow-md">
                 <CardHeader className="bg-orange-50">
                     <CardTitle className="text-orange-700 flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Editor
                     </CardTitle>
                     <CardDescription>Adaugă o parcelă nouă.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                     <div className="bg-white p-4 rounded border">
                         <label className="text-xs font-bold text-gray-500 uppercase">Suprafață</label>
                         <div className="text-3xl font-bold text-gray-800 mt-1">
                             {calculateEditorArea()} <span className="text-base font-normal text-gray-500">mp</span>
                         </div>
                     </div>

                     <div className="space-y-2">
                         <label className="text-sm font-medium">Nr. Cadastral</label>
                         <Input 
                            placeholder="ex: 10234" 
                            value={newParcelDetails.numar_cadastral}
                            onChange={(e) => setNewParcelDetails({...newParcelDetails, numar_cadastral: e.target.value})}
                         />
                     </div>

                     <div className="space-y-2">
                         <label className="text-sm font-medium">Tip Teren</label>
                         <Select 
                            value={newParcelDetails.tip_teren} 
                            onValueChange={(val) => setNewParcelDetails({...newParcelDetails, tip_teren: val})}
                         >
                            <SelectTrigger>
                                <SelectValue placeholder="Selectează tipul" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPURI_TEREN.map(t => (
                                    <SelectItem key={t.value} value={t.value}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: t.color}}></div>
                                            {t.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                         </Select>
                     </div>

                     <Button className="w-full bg-green-600 hover:bg-green-700 mt-4" onClick={handleSaveTeren}>
                         <Save className="w-4 h-4 mr-2" /> Salvează
                     </Button>
                 </CardContent>
             </Card>
          ) : selectedTeren ? (
            <Card className="h-full border-l-4 border-l-blue-500 shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Detalii
                    <Badge variant="secondary">{selectedTeren.numar_cadastral}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-600 uppercase font-bold flex items-center gap-1">
                        <Save className="w-3 h-3" /> Suprafață
                    </span>
                    <div className="text-3xl font-bold text-gray-800 mt-1">
                        {selectedTeren.suprafata_calculata} mp
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                      <div>
                          <span className="text-sm text-gray-500 font-medium">Tip Teren</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getParcelColor(selectedTeren.tip_teren) }}></div>
                            <p className="font-medium capitalize">{selectedTeren.tip_teren || 'Nespecificat'}</p>
                          </div>
                      </div>
                  </div>

                  {/* ZONA PERICULOASĂ - DOAR PENTRU ADMIN */}
                  {canDelete && (
                      <div className="border-t pt-6 mt-6">
                          <div className="bg-red-50 p-4 rounded border border-red-100">
                              <h4 className="text-red-800 font-bold text-sm mb-2 flex items-center gap-2">
                                  <ShieldAlert className="w-4 h-4"/> Zona Administrator
                              </h4>
                              <p className="text-xs text-red-600 mb-4">
                                  Poți șterge această parcelă dacă a fost introdusă greșit. Acțiunea este ireversibilă.
                              </p>
                              <Button 
                                variant="destructive" 
                                className="w-full"
                                onClick={() => handleDeleteTeren(selectedTeren.id)}
                              >
                                  <Trash2 className="w-4 h-4 mr-2" /> Șterge Definitiv Parcela
                              </Button>
                          </div>
                      </div>
                  )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 bg-gray-50 border-dashed">
                <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                    <MousePointerClick className="w-6 h-6 text-gray-400" />
                </div>
                <p>Selectează o parcelă.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HartaDigitala;