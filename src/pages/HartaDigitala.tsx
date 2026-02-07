import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Save, X, Trash2, MousePointerClick, ShieldAlert, UserCheck } from "lucide-react";
import L from 'leaflet';
import area from '@turf/area';
import { toast } from 'sonner';
import { useAuth } from "@/components/AuthContext"; // Importă noul context

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

interface Teren {
  id: number;
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

function MapClickEvents({ isDrawing, onAddPoint }: { isDrawing: boolean, onAddPoint: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (isDrawing) onAddPoint(e.latlng);
    },
  });
  return null;
}

const HartaDigitala = () => {
  const [terenuri, setTerenuri] = useState<Teren[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeren, setSelectedTeren] = useState<Teren | null>(null);
  
  // Utilizăm noul sistem de autentificare
  const { token, isAdmin, user } = useAuth();
  
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [editorPoints, setEditorPoints] = useState<L.LatLng[]>([]);
  const [newParcelDetails, setNewParcelDetails] = useState({
      numar_cadastral: '',
      tip_teren: 'arabil'
  });

  useEffect(() => {
    fetchTerenuri();
  }, []);

  const fetchTerenuri = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/terenuri');
      const data = await response.json();
      
      const processedData = data?.map((item: any) => ({
        ...item,
        geojson: typeof item.geojson === 'string' ? JSON.parse(item.geojson) : item.geojson,
        suprafata_calculata: item.geojson ? Math.round(area(typeof item.geojson === 'string' ? JSON.parse(item.geojson) : item.geojson)) : 0
      })) || [];

      setTerenuri(processedData);
    } catch (error) {
      console.error('Eroare la încărcare date:', error);
      toast.error("Nu s-au putut încărca datele hărții.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTeren = async () => {
      if (editorPoints.length < 3) { toast.error("Minim 3 puncte necesare!"); return; }
      if (!newParcelDetails.numar_cadastral) { toast.error("Completează numărul cadastral!"); return; }

      try {
          const coordinates = [
            [...editorPoints.map(p => [p.lng, p.lat]), [editorPoints[0].lng, editorPoints[0].lat]]
          ];
          const newGeoJson = { type: "Polygon", coordinates };

          const response = await fetch('http://localhost:3001/api/terenuri', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({
                  numar_cadastral: newParcelDetails.numar_cadastral,
                  tip_teren: newParcelDetails.tip_teren,
                  geojson: newGeoJson
              })
          });

          if (!response.ok) throw new Error("Eroare la salvare");

          toast.success("Parcelă salvată!");
          setIsEditorMode(false);
          setEditorPoints([]);
          fetchTerenuri();
      } catch (err: any) {
          toast.error("Eroare: " + err.message);
      }
  };

  const handleDeleteTeren = async (id: number) => {
      if (!confirm("Ești sigur?")) return;

      try {
          const response = await fetch(`http://localhost:3001/api/terenuri/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) throw new Error("Eroare la ștergere");
          
          toast.success("Parcelă ștearsă.");
          setSelectedTeren(null);
          fetchTerenuri();
      } catch (err: any) {
          toast.error(err.message);
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
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border gap-4">
        <div>
          <h1 className="text-2xl font-bold">Harta Digitală Almaj</h1>
          <div className="flex gap-2 mt-1">
              {isAdmin && <Badge className="bg-red-600 flex gap-1"><ShieldAlert className="w-3 h-3"/> ADMIN - CONTROL TOTAL</Badge>}
              {!isAdmin && user && <Badge className="bg-green-600 flex gap-1"><UserCheck className="w-3 h-3"/> Mod Vizualizare</Badge>}
          </div>
        </div>
        
        <div className="flex gap-2">
            {isAdmin && !isEditorMode && (
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
        <div className="lg:col-span-2 relative h-full rounded-xl overflow-hidden border shadow-lg">
          <MapContainer center={[44.4444, 23.7144]} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; Google'
              url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              maxZoom={22}
            />
            <MapClickEvents isDrawing={isEditorMode} onAddPoint={(latlng) => setEditorPoints(p => [...p, latlng])} />
            {!isEditorMode && terenuri.map((teren) => (
              <GeoJSON
                key={teren.id}
                data={teren.geojson}
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
        </div>

        <div className="lg:col-span-1 h-full overflow-y-auto">
          {isEditorMode ? (
             <Card className="h-full border-orange-200 border-2 shadow-md">
                 <CardHeader className="bg-orange-50">
                     <CardTitle className="text-orange-700 flex items-center gap-2">Editor</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                     <div className="bg-white p-4 rounded border">
                         <label className="text-xs font-bold text-gray-500 uppercase">Suprafață Estimată</label>
                         <div className="text-2xl font-bold text-gray-800">
                             {editorPoints.length >= 3 ? Math.round(area({
                                 type: "Polygon", 
                                 coordinates: [[...editorPoints.map(p => [p.lng, p.lat]), [editorPoints[0].lng, editorPoints[0].lat]]]
                             })) : 0} mp
                         </div>
                     </div>
                     <Input 
                        placeholder="Nr. Cadastral" 
                        value={newParcelDetails.numar_cadastral}
                        onChange={(e) => setNewParcelDetails({...newParcelDetails, numar_cadastral: e.target.value})}
                     />
                     <Select value={newParcelDetails.tip_teren} onValueChange={(v) => setNewParcelDetails({...newParcelDetails, tip_teren: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {TIPURI_TEREN.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                     </Select>
                     <Button className="w-full bg-green-600" onClick={handleSaveTeren}>Salvează</Button>
                 </CardContent>
             </Card>
          ) : selectedTeren ? (
            <Card className="h-full border-l-4 border-l-blue-500">
              <CardHeader><CardTitle>Parcela {selectedTeren.numar_cadastral}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">{selectedTeren.suprafata_calculata} mp</div>
                  <Badge variant="outline" className="capitalize">{selectedTeren.tip_teren}</Badge>
                  {isAdmin && (
                      <Button variant="destructive" className="w-full mt-4" onClick={() => handleDeleteTeren(selectedTeren.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Șterge
                      </Button>
                  )}
              </CardContent>
            </Card>
          ) : <Card className="h-full flex items-center justify-center p-6 text-gray-400 border-dashed">Selectează o parcelă.</Card>}
        </div>
      </div>
    </div>
  );
};

export default HartaDigitala;