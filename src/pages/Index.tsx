import { Suspense, lazy } from "react";
import HeroSection from "@/components/HeroSection";

const AnnouncementsSection = lazy(() => import("@/components/AnnouncementsSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

const SectionSkeleton = ({ className }: { className?: string }) => (
  <div className={className}>
    <div className="mx-auto h-8 w-44 animate-pulse rounded-xl bg-slate-200" />
    <div className="mx-auto mt-6 h-40 max-w-5xl animate-pulse rounded-2xl bg-slate-200" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* 1. HERO */}
      <HeroSection />
      
      {/* 2. AVIZIERUL COMUNEI */}
      <section className="w-full bg-slate-50 border-y border-slate-100 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SectionSkeleton className="py-8" />}>
            <AnnouncementsSection />
          </Suspense>
        </div>
      </section>

      {/* 3. DESPRE PRIMĂRIE */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<SectionSkeleton className="py-10" />}>
            <AboutSection />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default Index;
