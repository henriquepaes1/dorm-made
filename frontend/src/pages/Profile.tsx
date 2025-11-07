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
import { useProfile } from "@/hooks/use-profile";
import { useProfilePhoto } from "@/hooks/use-profile-photo";
import {
  GraduationCap,
  User as UserIcon,
  ArrowLeft,
  UtensilsCrossed,
  Edit2,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { User } from "@/types";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    user,
    loading,
    isEditing,
    editingUser,
    saving,
    userEvents,
    loadingEvents,
    setIsEditing,
    updateEditingUser,
    handleSave: saveProfile,
    handleCancel,
    isOwnProfile,
  } = useProfile(userId);

  const { uploadingPhoto, fileInputRef, handleFileSelect, handleUploadPhoto } = useProfilePhoto(
    (updatedUser) => {
      // Update profile hook state when photo is uploaded
      updateEditingUser(updatedUser);
    },
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelectWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e);
    const file = e.target.files?.[0];
    if (file && userId) {
      handleUploadPhoto(file, userId);
    }
  };

  const handleSaveWrapper = async () => {
    if (userId) {
      await saveProfile(userId);
    }
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
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
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
                      <AvatarImage src={editingUser.profile_picture} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelectWrapper}
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
                    <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
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
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
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
                          <Button size="sm" onClick={handleSaveWrapper} disabled={saving}>
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
                          onChange={(e) => updateEditingUser({ university: e.target.value })}
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
                          onChange={(e) => updateEditingUser({ description: e.target.value })}
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
                          onChange={(e) => updateEditingUser({ profile_picture: e.target.value })}
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
                            <p className="text-foreground leading-relaxed">{user.description}</p>
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
                  <h2 className="text-2xl font-bold">{isOwnProfile() ? "My Meals" : "Meals"}</h2>
                </div>
                <p className="text-sm text-muted-foreground">Eventos criados por {user.name}</p>
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
                    {user.id === JSON.parse(localStorage.getItem("currentUser") || "{}")?.id
                      ? "Crie seu primeiro evento culinário para começar!"
                      : `${user.name} ainda não criou nenhum evento.`}
                  </p>
                  {user.id === JSON.parse(localStorage.getItem("currentUser") || "{}")?.id && (
                    <Button asChild>
                      <Link to="/create-event">Criar Evento</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
