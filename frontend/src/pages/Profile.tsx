import { useState, useEffect } from "react";
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
import { getUser, updateUser } from "@/services/api";
import { User } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, User as UserIcon, ArrowLeft, UtensilsCrossed, Edit2, Save, X } from "lucide-react";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

                {/* User Info */}
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {user.name}
                    </h1>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="ml-4"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2 ml-4">
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
                      </div>
                    )}
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

