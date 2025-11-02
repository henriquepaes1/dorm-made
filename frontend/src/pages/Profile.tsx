import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getUser, updateUser, uploadProfilePicture, getAuthToken, getUserEvents } from "@/services/api";
import { User, Event } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, User as UserIcon, ArrowLeft, UtensilsCrossed, Edit2, Save, X, Upload, Image as ImageIcon, MapPin, Clock, Users } from "lucide-react";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadUser();
    } else {
      // Se não tiver userId, tenta usar dados do localStorage
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          setUser(currentUser);
          setEditingUser({ ...currentUser });
          loadUserEvents(currentUser.id);
        } catch (e) {
          console.error("Error parsing currentUser:", e);
        }
      }
      setLoading(false);
    }
  }, [userId]);

  const loadUser = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      console.log("Loading user with ID:", userId);
      const userData = await getUser(userId);
      console.log("User data loaded:", userData);
      setUser(userData);
      setEditingUser({ ...userData });
      // Carregar eventos após o usuário ser carregado
      await loadUserEvents(userData.id);
    } catch (error: any) {
      console.error("Error loading user:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Se não conseguir carregar do backend, tenta usar dados do localStorage
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.id === userId) {
            console.log("Using user data from localStorage");
            setUser(currentUser);
            setEditingUser({ ...currentUser });
            return;
          }
        } catch (e) {
          console.error("Error parsing currentUser from localStorage:", e);
        }
      }
      
      const errorMessage = error.response?.data?.detail 
        || error.message 
        || "Não foi possível carregar o perfil do usuário";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingUser || !userId) return;

    try {
      setSaving(true);
      const updatedUser = await updateUser(userId, {
        university: editingUser.university || null,
        description: editingUser.description || null,
        profile_picture: editingUser.profile_picture || null,
      });
      
      setUser(updatedUser);
      setEditingUser({ ...updatedUser });
      setIsEditing(false);
      
      // Atualizar localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
        className: "bg-green-500 text-white border-green-600",
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Não foi possível atualizar o perfil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditingUser({ ...user });
    }
    setIsEditing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Apenas arquivos JPEG e PNG são permitidos",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Erro",
        description: "O arquivo excede o limite de 5MB",
        variant: "destructive"
      });
      return;
    }

    handleUploadPhoto(file);
  };

  const handleUploadPhoto = async (file: File) => {
    if (!userId && !user) return;

    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    console.log('[DEBUG PROFILE] Upload iniciado:', {
      userId: targetUserId,
      file: file.name,
      fileSize: file.size,
      fileType: file.type,
      apiBaseURL: import.meta.env.VITE_API_URL || 'https://dorm-made-production.up.railway.app',
      token: getAuthToken() ? 'Present' : 'Missing'
    });

    try {
      setUploadingPhoto(true);
      const updatedUser = await uploadProfilePicture(targetUserId, file);
      
      setUser(updatedUser);
      setEditingUser({ ...updatedUser });
      
      // Atualizar localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso",
        className: "bg-green-500 text-white border-green-600",
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Não foi possível fazer upload da foto",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const loadUserEvents = async (targetUserId?: string) => {
    const idToUse = targetUserId || userId || user?.id;
    if (!idToUse) return;

    try {
      setLoadingEvents(true);
      const events = await getUserEvents(idToUse);
      setUserEvents(events);
    } catch (error: any) {
      console.error("Error loading user events:", error);
      // Não mostrar toast de erro, apenas logar - pode ser que o usuário não tenha eventos
      setUserEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isOwnProfile = () => {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr && user) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        return currentUser.id === user.id;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando perfil...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Usuário não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O perfil que você está procurando não existe.
            </p>
            <Button asChild>
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                    {editingUser?.profile_picture ? (
                      <AvatarImage 
                        src={editingUser.profile_picture} 
                        alt={user.name}
                      />
                    ) : null}
                    <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="hidden"
                    id="profile-photo-upload"
                    disabled={uploadingPhoto}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 border-2 border-background shadow-lg"
                  >
                    {uploadingPhoto ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* User Info */}
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {user.name}
                    </h1>
                    <div className="flex gap-2 ml-4">
                      {!isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPhoto}
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            {uploadingPhoto ? "Enviando..." : "Upload Photo"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={saving}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? "Salvando..." : "Salvar"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="university" className="flex items-center mb-2">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Universidade
                        </Label>
                        <Input
                          id="university"
                          value={editingUser?.university || ""}
                          onChange={(e) => setEditingUser(prev => prev ? { ...prev, university: e.target.value } : null)}
                          placeholder="Digite sua universidade"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="flex items-center mb-2">
                          <UserIcon className="h-4 w-4 mr-2" />
                          Sobre você
                        </Label>
                        <Textarea
                          id="description"
                          value={editingUser?.description || ""}
                          onChange={(e) => setEditingUser(prev => prev ? { ...prev, description: e.target.value } : null)}
                          placeholder="Conte um pouco sobre você..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profile_picture" className="mb-2">
                          URL da Foto de Perfil
                        </Label>
                        <Input
                          id="profile_picture"
                          value={editingUser?.profile_picture || ""}
                          onChange={(e) => setEditingUser(prev => prev ? { ...prev, profile_picture: e.target.value } : null)}
                          placeholder="https://exemplo.com/foto.jpg"
                          type="url"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Cole a URL da sua foto de perfil
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {user.university && (
                        <div className="flex items-center text-lg text-muted-foreground mb-3">
                          <GraduationCap className="h-5 w-5 mr-2" />
                          <span>{user.university}</span>
                        </div>
                      )}

                      {user.description ? (
                        <>
                          <Separator className="my-4" />
                          <div className="space-y-2">
                            <div className="flex items-center text-sm font-medium text-muted-foreground">
                              <UserIcon className="h-4 w-4 mr-2" />
                              Sobre
                            </div>
                            <p className="text-foreground leading-relaxed">
                              {user.description}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Nenhuma descrição disponível. Clique em "Editar" para adicionar.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Meals Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {isOwnProfile() ? "My Meals" : "Meals"}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Eventos criados por {user.name}
                </p>
              </div>

              {loadingEvents ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando eventos...</p>
                  </div>
                </div>
              ) : userEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum evento criado ainda</h3>
                  <p className="text-muted-foreground mb-4">
                    {user.id === JSON.parse(localStorage.getItem('currentUser') || '{}')?.id 
                      ? "Crie seu primeiro evento culinário para começar!"
                      : `${user.name} ainda não criou nenhum evento.`}
                  </p>
                  {user.id === JSON.parse(localStorage.getItem('currentUser') || '{}')?.id && (
                    <Button asChild>
                      <Link to="/create-event">Criar Evento</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-4xl mb-2">🍳</div>
                            <p className="text-sm text-muted-foreground">Culinary Event</p>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatDate(event.event_date)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {event.current_participants}/{event.max_participants} participantes
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Explore Meals Link */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Explore Meals</h3>
                    <p className="text-sm text-muted-foreground">
                      Descubra refeições incríveis criadas por outros usuários
                    </p>
                  </div>
                </div>
                <Button asChild size="lg">
                  <Link to="/explore">
                    Explorar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

