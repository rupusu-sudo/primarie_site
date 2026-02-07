import HeroSection from "@/components/HeroSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import AboutSection from "@/components/AboutSection";
import LeadershipSection from "@/components/LeadershipSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* 1. HERO */}
      <HeroSection />
      
      {/* 2. AVIZIERUL COMUNEI */}
      <section className="w-full bg-slate-50 border-y border-slate-100 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <AnnouncementsSection />
        </div>
      </section>

      {/* 3. DESPRE PRIMĂRIE */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <AboutSection />
        </div>
      </section>

      {/* 4. CONDUCEREA */}
      <LeadershipSection />
    </div>
  );
};

export default Index;