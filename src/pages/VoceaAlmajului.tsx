import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/components/AuthContext"; 
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Send, Trash2, Image as ImageIcon, X, Loader2, 
  ShieldCheck, User, ThumbsUp, MessageCircle, Clock, ChevronRight,
  AlertCircle, ArrowUpDown, Info
} from "lucide-react";
import { toast } from "sonner";

const API_URL = 'http://localhost:3001';

const VoceaAlmajului = () => {
  const auth = useAuth();
  const user = auth?.user || null;
  const token = auth?.token || null;
  const logout = auth?.logout || (() => {});
  const isAdmin = !!user; 

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [userLikes, setUserLikes] = useState<Set<number>>(() => {
    const saved = sessionStorage.getItem('vocea-almajului-likes'); 
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    sessionStorage.setItem('vocea-almajului-likes', JSON.stringify([...userLikes]));
  }, [userLikes]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/documents?category=vocea-almajului`);
      
      if (response.status === 403) {
        toast.error("Sesiunea a expirat. Vă rugăm să vă logați din nou.");
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const allDocs = await response.json();
      
      if (Array.isArray(allDocs)) {
        const mainPosts = allDocs.filter((d: any) => d.category === 'vocea-almajului');
        const replies = allDocs.filter((d: any) => d.category === 'reply');

        const merged = mainPosts.map((post: any) => ({
          ...post,
          image_urls: post.fileUrl ? post.fileUrl.split(',').filter(Boolean) : [],
          replies: replies.filter((r: any) => r.parentId === post.id),
          displayName: post.user?.name || post.authorName || "Anonim"
        }));

        setPosts(merged);
      }
    } catch (error) {
      console.error("Eroare comunicare server:", error);
      toast.error("Nu s-au putut încărca mesajele. Verificați conexiunea cu serverul.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleLike = async (id: number) => {
    // Check local state pentru feedback imediat
    if (userLikes.has(id)) {
      toast.error("Ați oferit deja o susținere pentru acest mesaj.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/documents/${id}/like`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Eroare server');
      }

      const data = await res.json();
      
      setPosts(prev => prev.map(p => 
        p.id === id ? { ...p, likes: data.likes } : p
      ));
      
      setUserLikes(prev => new Set([...prev, id]));
      toast.success("Susținere înregistrată!");
    } catch (error: any) { 
      console.error("Eroare Like", error);
      toast.error(error.message || "Nu s-a putut înregistra susținerea.");
    }
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim()) {
      toast.error("Răspunsul nu poate fi gol.");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: `Răspuns la #${parentId}`,
          category: 'reply',
          content: replyText.trim(),
          authorName: isAdmin ? null : "Cetățean",
          parentId: parentId
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      setReplyText("");
      setActiveReplyId(null);
      toast.success("Răspuns adăugat cu succes.");
      await fetchPosts();
    } catch (error: any) { 
      console.error("Eroare răspuns:", error);
      toast.error(error.message || "Nu s-a putut trimite răspunsul.");
    }
  };

  const handlePost = async () => {
    if (!newTitle.trim()) {
      toast.error("Subiectul este obligatoriu.");
      return;
    }
    
    if (!newContent.trim()) {
      toast.error("Mesajul este obligatoriu.");
      return;
    }
    
    if (!isAdmin && !authorName.trim()) {
      toast.error("Numele este obligatoriu.");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', newTitle.trim());
      formData.append('content', newContent.trim());
      formData.append('category', 'vocea-almajului');
      
      if (!isAdmin) {
        formData.append('authorName', authorName.trim());
      }
      
      selectedFiles.forEach(f => formData.append('files', f));

      const res = await fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Eroare server: ${res.status}`);
      }

      toast.success("Mesajul a fost înregistrat oficial!");
      
      setNewTitle("");
      setNewContent("");
      setAuthorName("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      
      await fetchPosts();
      
    } catch (err: any) {
      console.error("Eroare:", err);
      toast.error(err.message || "Eroare la publicare.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      if (selectedFiles.length + files.length > 5) {
        toast.error("Puteți atașa maxim 5 imagini.");
        return;
      }

      const oversized = files.find(f => f.size > 5 * 1024 * 1024);
      if (oversized) {
        toast.error("Fiecare imagine trebuie să fie sub 5MB.");
        return;
      }

      setSelectedFiles(prev => [...prev, ...files]);
      setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <PageLayout title="Dialog Cetățenesc">
      <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">
            Vocea Comunității Almăj
          </h1>
          <p className="text-slate-500 font-medium italic">
            Portal oficial pentru sesizări și propuneri.
          </p>
          
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs">
            <Info size={14} />
            <span>Mesajele sunt păstrate 5 ani pentru optimizarea resurselor</span>
          </div>
        </div>

        {/* Formular */}
        <Card className="mb-20 shadow-xl border-0 ring-1 ring-slate-200 bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            {!isAdmin && (
              <Input 
                placeholder="Nume Complet..." 
                value={authorName} 
                onChange={e => setAuthorName(e.target.value)} 
                className="bg-white border-slate-200 h-12"
                disabled={isUploading}
              />
            )}
            <Input 
              placeholder="Subiect..." 
              className="font-bold h-12 border-slate-200" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)}
              disabled={isUploading}
            />
            <Textarea 
              placeholder="Mesajul dumneavoastră..." 
              value={newContent} 
              onChange={e => setNewContent(e.target.value)} 
              className="min-h-[140px] border-slate-200"
              disabled={isUploading}
            />
            
            <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
              <span className="font-semibold"> Regulament:</span> Nu sunt permise link-uri sau limbaj inadecvat. 
              Maxim 5 imagini (5MB fiecare).
            </div>

            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={url} 
                      alt={`Preview ${idx}`} 
                      className="h-20 w-20 object-cover rounded border-2 border-slate-200" 
                    />
                    <button 
                      onClick={() => removeFile(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isUploading}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <label className={`flex items-center gap-2 text-sm font-bold text-blue-600 cursor-pointer border px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all ${isUploading || selectedFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <ImageIcon size={18} /> Atașează Poze ({selectedFiles.length}/5)
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  disabled={isUploading || selectedFiles.length >= 5}
                />
              </label>
              <Button 
                onClick={handlePost} 
                disabled={isUploading} 
                className="bg-slate-900 px-10 rounded-xl h-12 uppercase text-[10px] font-black tracking-widest shadow-lg disabled:opacity-50"
              >
                {isUploading ? (
                  <><Loader2 className="animate-spin mr-2" size={14} /> Se trimite...</>
                ) : (
                  <><Send size={14} className="mr-2" /> Trimite Mesajul</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registru */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              Registrul de Dialog Public
            </span>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="text-xs gap-2"
            >
              <ArrowUpDown size={14} />
              {sortOrder === 'newest' ? 'Cele mai noi' : 'Cele mai vechi'}
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin w-10 h-10 text-slate-200" />
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg font-medium">Nu există mesaje momentan.</p>
              <p className="text-sm mt-2">Fiți primul care transmite un mesaj!</p>
            </div>
          ) : (
            sortedPosts.map(post => (
              <div key={post.id} className="bg-white border-l-[6px] border-l-blue-500 rounded-xl shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6 font-bold">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarFallback className={post.user?.role === 'ADMIN' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}>
                          {post.user?.role === 'ADMIN' ? <ShieldCheck size={20} /> : <User size={20} />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg text-slate-900 leading-tight">{post.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 uppercase tracking-tighter">
                          <span>{post.displayName}</span>
                          <span>•</span>
                          <span>Nr. #{post.id}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> 
                            {new Date(post.createdAt).toLocaleDateString('ro-RO')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        onClick={async () => {
                          if(confirm("Doriți ștergerea definitivă a acestui mesaj?")) {
                            try {
                              const res = await fetch(`${API_URL}/api/documents/${post.id}`, { 
                                method: 'DELETE', 
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              if (res.ok) {
                                toast.success("Mesaj șters.");
                                await fetchPosts();
                              } else {
                                throw new Error();
                              }
                            } catch {
                              toast.error("Eroare la ștergere.");
                            }
                          }
                        }} 
                        className="text-slate-200 hover:text-red-600 rounded-full"
                      >
                        <Trash2 size={18}/>
                      </Button>
                    )}
                  </div>

                  <p className="text-slate-600 text-[15px] leading-relaxed mb-8 italic pl-6 border-l-2 border-slate-50">
                    {post.content}
                  </p>
                  
                  {post.image_urls && post.image_urls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {post.image_urls.map((url: string, idx: number) => url && (
                        <div 
                          key={idx} 
                          className="relative group cursor-pointer"
                          onClick={() => setSelectedImage(url)}
                        >
                          <img 
                            src={url.startsWith('http') ? url : `${API_URL}${url}`}
                            alt={`Atașament ${idx + 1}`} 
                            className="h-32 w-32 object-cover rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                            onError={(e) => {
                              console.error('Eroare încărcare imagine:', url);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                    <button 
                      onClick={() => handleLike(post.id)} 
                      disabled={userLikes.has(post.id)}
                      className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                        userLikes.has(post.id) 
                          ? 'text-blue-600 cursor-not-allowed' 
                          : 'text-slate-400 hover:text-blue-600 cursor-pointer'
                      }`}
                    >
                      <ThumbsUp 
                        size={16} 
                        className={userLikes.has(post.id) || post.likes > 0 ? "fill-blue-600 text-blue-600" : ""} 
                      /> 
                      {post.likes || 0} Susțineri
                      {userLikes.has(post.id) && <span className="text-[9px]">(✓ Oferită)</span>}
                    </button>
                    <button 
                      onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)} 
                      className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle size={16} /> {post.replies?.length || 0} Răspunsuri
                    </button>
                  </div>

                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-6 space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      {post.replies.map((reply: any) => (
                        <div key={reply.id} className="flex gap-3 items-start">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                          <div className="text-sm flex-1">
                            <span className="font-black text-blue-700 uppercase tracking-tighter text-[10px] mr-2">
                              {reply.user?.name || reply.authorName || "Anonim"}:
                            </span>
                            <span className="text-slate-600">{reply.content}</span>
                            <div className="text-[9px] text-slate-400 mt-1">
                              {new Date(reply.createdAt).toLocaleDateString('ro-RO')} • {new Date(reply.createdAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeReplyId === post.id && (
                    <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                      <Textarea
                        placeholder="Adăugați un răspuns respectuos..." 
                        value={replyText} 
                        onChange={e => setReplyText(e.target.value)}
                        className="text-sm bg-white min-h-[80px]" 
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText("");
                          }}
                        >
                          Anulează
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleReply(post.id)} 
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send size={14} className="mr-2" /> Trimite Răspuns
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] bg-black/95 border-none p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImage && (
              <img 
                src={selectedImage.startsWith('http') ? selectedImage : `${API_URL}${selectedImage}`}
                alt="Previzualizare" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default VoceaAlmajului;