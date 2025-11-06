import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { Footer } from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gradient-to-br from-background via-accent/20 to-secondary/30">
        <HeroSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
