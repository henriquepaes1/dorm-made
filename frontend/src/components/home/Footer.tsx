import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DM</span>
              </div>
              <span className="font-bold text-xl">Dorm Made</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Connecting college students through authentic cultural food experiences.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* For Foodies */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">For Foodies</h3>
            <div className="space-y-2">
              <Link to="/explore" className="block text-muted-foreground hover:text-foreground transition-colors">
                Browse Meals
              </Link>
              <Link to="/favorites" className="block text-muted-foreground hover:text-foreground transition-colors">
                My Favorites
              </Link>
              <Link to="/calendar" className="block text-muted-foreground hover:text-foreground transition-colors">
                My Calendar
              </Link>
              <Link to="/reviews" className="block text-muted-foreground hover:text-foreground transition-colors">
                Write Reviews
              </Link>
            </div>
          </div>

          {/* For Chefs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">For Chefs</h3>
            <div className="space-y-2">
              <Link to="/host" className="block text-muted-foreground hover:text-foreground transition-colors">
                Host a Meal
              </Link>
              <Link to="/menu" className="block text-muted-foreground hover:text-foreground transition-colors">
                Manage Menu
              </Link>
              <Link to="/earnings" className="block text-muted-foreground hover:text-foreground transition-colors">
                Track Earnings
              </Link>
              <Link to="/recipes" className="block text-muted-foreground hover:text-foreground transition-colors">
                Recipe Book
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Connected</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@dormmade.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>University District</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Newsletter</p>
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="text-sm" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Dorm Made. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}