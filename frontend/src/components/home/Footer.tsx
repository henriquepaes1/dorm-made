import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DM</span>
              </div>
              <span className="font-bold text-xl">Dorm Made</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Connecting college students through authentic cultural food experiences.
            </p>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Keep in touch</h3>
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
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 Dorm Made. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
