import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { Footer } from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
