import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container px-4 py-6 lg:py-4">
        <div className="flex flex-col space-y-6 lg:flex-row lg:justify-between lg:space-y-0">
          {/* Brand */}
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/images/logo.png"
                alt="Dorm Made Logo"
                className="h-8 w-8 lg:h-10 lg:w-10 object-contain"
              />
              <span className="font-bold text-lg lg:text-xl">Dorm Made</span>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground max-w-xs">
              Connecting college students through authentic cultural food experiences.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2 lg:space-y-3">
            <h3 className="font-semibold text-base lg:text-lg">Keep in touch</h3>
            <div className="space-y-2 lg:space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>hello@dormmade.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>University District</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - Always centered */}
        <div className="mt-6 lg:mt-8 text-center">
          <p className="text-xs lg:text-sm text-muted-foreground">
            © 2024 Dorm Made. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
