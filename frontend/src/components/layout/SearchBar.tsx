import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search by cuisine, location, or chef name..."
          className="pl-12 pr-4 py-6 text-lg bg-background/80 backdrop-blur border-2 border-border/50 focus:border-primary/50"
        />
        <Button
          size="lg"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-primary-glow"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
