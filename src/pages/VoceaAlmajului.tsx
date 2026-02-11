import { useState, useEffect, useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/components/AuthContext"; 
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ShieldCheck, User, ThumbsUp, MessageSquare, Clock, 
  Trash2, Flag, ArrowUpDown, Star, 
  ChevronDown, ChevronUp, Image as ImageIcon, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { API_URL, withApiBase } from "@/config/api";

const getDeviceId = () => {
  let id = localStorage.getItem('almaj_id_v3');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('almaj_id_v3', id);
  }
  return id;
};

const VoceaAlmajului = () => {
  const { user, token, isAdmin } = useAuth();
  const deviceId = useMemo(() => getDeviceId(), []);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'popular' | 'newest' | 'oldest'>('popular');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAuthorName, setReplyAuthorName] = useState("");

  const [userLikes, setUserLikes] = useState<Set<number>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/api/documents?category=vocea-almajului&deviceId=${encodeURIComponent(deviceId)}`;
      const response = await fetch(url);
      const data = await response.json();
      const { documents: allDocs = [], likedIds = [] } = Array.isArray(data) ? { documents: data, likedIds: [] } : data;
      setUserLikes(new Set(likedIds));
      if (Array.isArray(allDocs)) {
        const mainPosts = allDocs.filter((d: any) => d.category === 'vocea-almajului');
        const replies = allDocs.filter((d: any) => d.category === 'reply');

        const merged = mainPosts.map((post: any) => ({
          ...post,
          image_urls: post.fileUrl ? post.fileUrl.split(',').filter(Boolean) : [],
          replies: replies
            .filter((r: any) => r.parentId === post.id)
            .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
          isOfficial: post.authorName?.includes('Primărie') || post.officialSupport,
          isMine: post.ownerId === deviceId,
          likes: post.likes || 0,
        }));
        setPosts(merged);
      }
    } catch (error) { toast.error("Conexiunea cu serverul a eșuat."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, [deviceId]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sortOrder === 'popular') return b.likes - a.likes;
      return sortOrder === 'newest' 
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [posts, sortOrder]);

  const baseHeaders = () => ({
    'X-Device-Id': deviceId,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  const handlePost = async () => {
    if (!gdprAccepted) return toast.error("Vă rugăm să acceptați termenii GDPR.");
    if (!newTitle.trim() || !newContent.trim() || (!isAdmin && !authorName.trim())) {
      return toast.error("Toate câmpurile sunt obligatorii.");
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', newTitle.trim());
      formData.append('content', newContent.trim());
      formData.append('category', 'vocea-almajului');
      formData.append('ownerId', deviceId);
      if (!isAdmin) formData.append('authorName', authorName.trim());
      selectedFiles.forEach(f => formData.append('files', f));

      const res = await fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        headers: baseHeaders(),
        body: formData
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Sesizarea a fost trimisă.");
        setNewTitle(""); setNewContent(""); setAuthorName(""); setSelectedFiles([]); setPreviewUrls([]); setGdprAccepted(false);
        fetchPosts();
      } else {
        toast.error(data.error || "Eroare la trimitere.");
      }
    } catch (e) {
      toast.error("Eroare de conexiune.");
    } finally { setIsUploading(false); }
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim() || (!isAdmin && !replyAuthorName.trim())) return;
    try {
      const res = await fetch(`${API_URL}/api/documents/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...baseHeaders() },
        body: JSON.stringify({
          content: replyText,
          parentId,
          authorName: isAdmin ? "Reprezentant Primărie" : replyAuthorName,
          ownerId: deviceId
        })
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setReplyText(""); setReplyAuthorName(""); setActiveReplyId(null);
        fetchPosts();
        toast.success("Răspuns adăugat.");
      } else {
        toast.error(d.error || "Eroare la trimitere.");
      }
    } catch (e) { toast.error("Eroare server."); }
  };

  const handleLike = async (id: number) => {
    if (userLikes.has(id)) return;
    const res = await fetch(`${API_URL}/api/documents/${id}/like`, { 
      method: 'POST', 
      headers: baseHeaders()
    });
    if (res.ok) {
      setUserLikes(prev => new Set([...prev, id]));
      fetchPosts();
    }
  };

  return (
    <PageLayout title="Vocea Almăjului">
      <div className="bg-[#F8FAFC] min-h-screen py-10 md:py-20 font-sans selection:bg-blue-100">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header Animare */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase text-slate-900">
              Vocea <span className="text-blue-600">Almăjului</span>
            </h1>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-slate-600 text-base font-medium">Parteneriat pentru transparență și soluții locale.</p>
          </motion.div>

          {/* Formular Postare - Design Simetric Profesionist */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <Card className="mb-12 sm:mb-16 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl sm:rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl ring-1 ring-slate-100">
              <div className="bg-slate-900/5 px-4 sm:px-10 py-4 sm:py-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wide flex items-center gap-2">
                  <Flag size={14} className="text-blue-600" /> Deschide un dialog oficial
                </span>
                {isAdmin && <Badge className="bg-blue-600 text-[10px] rounded-lg">MOD ADMIN</Badge>}
              </div>
              <CardContent className="p-4 sm:p-8 md:p-12 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!isAdmin && (
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase text-slate-500 ml-2 tracking-wide">Identitate</label>
                      <Input placeholder="Numele dumneavoastră" value={authorName} onChange={e => setAuthorName(e.target.value)} className="h-14 rounded-2xl bg-slate-50/50 border-none px-6 focus:ring-2 ring-blue-500/20 transition-all" />
                    </div>
                  )}
                  <div className={`space-y-2 ${isAdmin ? 'md:col-span-2' : ''}`}>
                    <label className="text-[11px] font-semibold uppercase text-slate-500 ml-2 tracking-wide">Subiect</label>
                    <Input placeholder="Subiectul sesizării" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="h-14 rounded-2xl bg-slate-50/50 border-none px-6 font-medium focus:ring-2 ring-blue-500/20 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase text-slate-500 ml-2 tracking-wide">Descrierea sesizării</label>
                  <Textarea placeholder="Detalii suplimentare despre sesizare" value={newContent} onChange={e => setNewContent(e.target.value)} className="min-h-[150px] rounded-[2rem] bg-slate-50/50 border-none p-8 focus:ring-2 ring-blue-500/20 transition-all leading-relaxed" />
                </div>

                <div className="flex items-center space-x-3 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <Checkbox id="gdpr" checked={gdprAccepted} onCheckedChange={(v) => setGdprAccepted(!!v)} className="rounded-md border-blue-200 data-[state=checked]:bg-blue-600" />
                  <label htmlFor="gdpr" className="text-[11px] font-medium text-slate-600 cursor-pointer">
                    Sunt de acord cu procesarea datelor în scopul soluționării sesizării (GDPR). Informația va deveni publică.
                  </label>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-slate-50">
                  <Button onClick={handlePost} disabled={isUploading} className="w-full sm:flex-1 sm:max-w-[280px] bg-slate-900 hover:bg-blue-600 text-white px-8 sm:px-16 rounded-2xl h-14 uppercase text-[10px] sm:text-[11px] font-black tracking-widest shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0">
                    {isUploading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Se trimite...</> : "Publică Sesizarea"}
                  </Button>
                  <label className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-black text-blue-700 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border-2 border-dashed border-blue-100 cursor-pointer transition-all active:scale-[0.98]">
                    <ImageIcon size={16} className="shrink-0" /> Atașează Imagini {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                    <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files).slice(0, 5 - selectedFiles.length);
                        if (files.length) {
                          setSelectedFiles(prev => [...prev, ...files]);
                          setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                        }
                        e.target.value = '';
                      }
                    }} />
                  </label>
                </div>
                {previewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="h-16 w-16 object-cover rounded-xl border border-slate-200" />
                        <button type="button" onClick={() => { setSelectedFiles(p => p.filter((_, j) => j !== i)); setPreviewUrls(p => { URL.revokeObjectURL(p[i]); return p.filter((_, j) => j !== i); }); }} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sortează Fluxul - Desktop: text complet, mobil: compact */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-12 gap-4 px-2 md:px-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500">
              <ArrowUpDown size={16} className="shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wide">Ordine</span>
            </div>
            <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-slate-100 w-full md:w-auto">
              {(['popular', 'newest', 'oldest'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortOrder(mode)}
                  className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 rounded-lg text-[11px] font-semibold uppercase transition-all duration-200 whitespace-nowrap ${sortOrder === mode ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                  {mode === 'popular' ? 'Cele mai susținute' : mode === 'newest' ? 'Recente' : 'Vechi'}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Postări */}
          <AnimatePresence>
            <div className="space-y-12">
              {loading ? (
                <div className="py-32 text-center flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin w-12 h-12 text-blue-600/30" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Se încarcă dialogul civic...</span>
                </div>
              ) : sortedPosts.map((post, index) => {
                const officialSupport = post.officialSupport || post.replies?.some((r:any) => r.authorName?.includes('Primărie'));
                const shownReplies = expandedReplies.has(post.id) ? post.replies : post.replies?.slice(0, 3);

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-2xl sm:rounded-[3rem] bg-white transition-all hover:shadow-xl ${officialSupport ? 'ring-2 ring-blue-600/20' : ''}`}>
                      <CardContent className="p-4 sm:p-8 md:p-12">
                        
                        {officialSupport && (
                          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full mb-6 shadow-md">
                            <Star size={12} className="fill-white" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide">Sesizare în curs de soluționare</span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                            <Avatar className="h-16 w-16 border-4 border-slate-50 shadow-md">
                              <AvatarFallback className={post.isOfficial ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}>
                                {post.isOfficial ? <ShieldCheck size={28} /> : <User size={28} />}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1">{post.title}</h3>
                              <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                                <span className={post.isOfficial ? "text-blue-700" : ""}>{post.authorName || "Cetățean"}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(post.createdAt).toLocaleDateString('ro-RO')}</span>
                              </div>
                            </div>
                          </div>
                          {(isAdmin || post.isMine) && (
                            <Button variant="ghost" size="icon" onClick={() => fetch(`${API_URL}/api/documents/${post.id}`, { method: 'DELETE', headers: baseHeaders() }).then(() => fetchPosts())} className="text-slate-200 hover:text-red-500 rounded-full h-12 w-12 transition-colors"><Trash2 size={20} /></Button>
                          )}
                        </div>

                        <p className="text-slate-600 leading-relaxed mb-6 text-base font-normal whitespace-pre-wrap pl-6 border-l-2 border-slate-200">"{post.content}"</p>

                        {post.image_urls?.length > 0 && (
                          <div className="flex flex-wrap gap-3 mb-8">
                            {post.image_urls.map((url: string, i: number) => {
                              const resolvedUrl = withApiBase(url);
                              if (!resolvedUrl) return null;
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setLightboxImage(resolvedUrl)}
                                  className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl overflow-hidden"
                                >
                                  <img src={resolvedUrl} alt={`Atașament ${i + 1}`} className="max-h-48 rounded-2xl object-cover border border-slate-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer" />
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-8 border-t border-slate-50">
                          <button onClick={() => handleLike(post.id)} className={`group flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${userLikes.has(post.id) ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
                            <ThumbsUp size={20} className={`transition-transform group-hover:scale-125 ${userLikes.has(post.id) ? 'fill-blue-600 text-blue-600 animate-bounce' : ''}`} /> 
                            {post.likes} Susțineri
                          </button>
                          <button onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)} className="group flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                            <MessageSquare size={20} className="group-hover:scale-110 transition-transform" /> 
                            {post.replies?.length || 0} Răspunsuri
                          </button>
                        </div>

                        {/* Răspunsuri Ierarhizate */}
                        <AnimatePresence>
                          {(post.replies?.length > 0 || activeReplyId === post.id) && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-12 space-y-6 border-l-2 border-slate-100 ml-8 pl-8"
                            >
                              {shownReplies?.map((reply: any) => (
                                <div key={reply.id} className={`p-5 rounded-2xl ${reply.authorName?.includes('Primărie') ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 border border-slate-100'}`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[11px] font-semibold uppercase ${reply.authorName?.includes('Primărie') ? 'text-blue-100' : 'text-slate-600'}`}>{reply.authorName}</span>
                                    <span className={`text-[10px] ${reply.authorName?.includes('Primărie') ? 'text-blue-300' : 'text-slate-400'}`}>• {new Date(reply.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm leading-relaxed font-normal text-slate-700">{reply.content}</p>
                                </div>
                              ))}

                              {post.replies?.length > 3 && (
                                <button onClick={() => setExpandedReplies(p => {const n=new Set(p); expandedReplies.has(post.id)?n.delete(post.id):n.add(post.id); return n;})} className="text-[10px] font-black text-blue-600 uppercase ml-4 hover:underline flex items-center gap-2">
                                  {expandedReplies.has(post.id) ? <><ChevronUp size={14} /> Vezi mai puțin</> : <><ChevronDown size={14} /> Vezi toate cele {post.replies.length} răspunsuri</>}
                                </button>
                              )}

                              {activeReplyId === post.id && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8 space-y-5 animate-in">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Oferă un răspuns</span>
                                  </div>
                                  {!isAdmin && <Input placeholder="Numele dumneavoastră" value={replyAuthorName} onChange={e => setReplyAuthorName(e.target.value)} className="h-12 rounded-2xl bg-white border-slate-200 px-6 shadow-sm" />}
                                  <Textarea placeholder="Scrieți un răspuns respectuos..." value={replyText} onChange={e => setReplyText(e.target.value)} className="bg-white rounded-[2.5rem] min-h-[120px] border-slate-200 p-8 shadow-sm text-base" />
                                  <div className="flex justify-end gap-3">
                                    <Button variant="ghost" onClick={() => setActiveReplyId(null)} className="text-[10px] font-black uppercase text-slate-400">Anulează</Button>
                                    <Button onClick={() => handleReply(post.id)} className="bg-slate-900 hover:bg-blue-600 text-white px-10 rounded-2xl h-12 text-[10px] font-black uppercase shadow-lg transition-all">Trimite Răspuns</Button>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {/* Lightbox imagini */}
          <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto p-2 md:p-4 border-none bg-black/90 shadow-none overflow-visible [&>button]:bg-white/10 [&>button]:rounded-full [&>button]:text-white [&>button]:right-4 [&>button]:top-4">
              {lightboxImage && (
                <img src={lightboxImage} alt="Vizualizare" className="max-w-full max-h-[85vh] w-auto mx-auto rounded-lg object-contain" />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageLayout>
  );
};

export default VoceaAlmajului;
