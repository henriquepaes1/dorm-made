import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Heart, Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">DM</span>
          </div>
          <span className="font-bold text-xl text-foreground">Dorm Made</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search meals, chefs, cuisine..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/explore">
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Explore</span>
            </Link>
          </Button>
          
          {currentUser && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Host Event</span>
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="sm" asChild>
            <Link to="/favorites">
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/calendar">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Calendar</span>
            </Link>
          </Button>
          
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {currentUser.name.split(' ')[0]}!
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}