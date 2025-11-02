import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/services/api";
import { User } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, User as UserIcon, ArrowLeft, UtensilsCrossed } from "lucide-react";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userData = await getUser(userId);
      setUser(userData);
    } catch (error: any) {
      console.error("Error loading user:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil do usuário",
        variant: "destructive"
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
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

  if (!user) {
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
                  {user.profile_picture ? (
                    <AvatarImage 
                      src={user.profile_picture} 
                      alt={user.name}
                    />
                  ) : null}
                  <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {user.name}
                  </h1>
                  
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
                      Nenhuma descrição disponível
                    </p>
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

