import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import QuickAccessSection from "@/components/QuickAccessSection";

const Index = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <HeroSection />
      <AnnouncementsSection />
      <AboutSection />
      <QuickAccessSection />
    </main>
  );
};

export default Index;
