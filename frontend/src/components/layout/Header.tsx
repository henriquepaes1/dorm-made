import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { removeAuthToken, getAuthToken, searchUsers, User as UserType } from "@/services/api";

export function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("currentUser");
      const token = getAuthToken();

      // Only set user if both user data and token exist
      if (user && token && user !== "undefined") {
        try {
          const parsedUser = JSON.parse(user);
          console.log("Header checkAuth - parsed user:", parsedUser);
          setCurrentUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setCurrentUser(null);
        }
      } else {
        console.log("Header checkAuth - setting user to null");
        setCurrentUser(null);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (when user logs in from another tab)
    window.addEventListener("storage", checkAuth);

    // Listen for custom login event
    window.addEventListener("userLogin", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("userLogin", checkAuth);
    };
  }, []);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Close search when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If query is less than 2 characters, clear results
    if (value.trim().length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    // Debounce search
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchUsers(value.trim(), 8);
        setSearchResults(results);
        setIsSearchOpen(results.length > 0);
        setIsSearching(false);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
        setIsSearchOpen(false);
        setIsSearching(false);
      }
    }, 300);
  };

  const handleUserSelect = (userId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(`/profile/${userId}`);
  };

  const handleExploreClick = (e: React.MouseEvent) => {
    if (searchQuery.trim().length >= 2) {
      e.preventDefault();
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
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

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userEmail");
    removeAuthToken();
    setCurrentUser(null);
    window.location.href = "/";
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

        {/* Search Bar */}
        <div className="flex flex-1 max-w-md mx-8">
          {currentUser && (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search meals, chefs, cuisine..." className="pl-10 bg-muted/50" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          {currentUser && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Host Event</span>
              </Link>
            </Button>
          )}

          {currentUser ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {currentUser.name.split(" ")[0]}!
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
