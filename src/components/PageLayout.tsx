import React from "react";
import { Home, ChevronRight } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen"; 
interface PageLayoutProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
  isLoading?: boolean; 
  rightAction?: React.ReactNode;
}

const PageLayout = ({ 
  title, 
  breadcrumbs, 
  children, 
  isLoading = false,
  rightAction 
}: PageLayoutProps) => {

  // AICI ESTE SCHIMBAREA: Folosim componenta ta custom
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2 text-sm text-slate-500 overflow-hidden">
            <a href="/" className="hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
            </a>
            {breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-blue-600 transition-colors whitespace-nowrap">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="font-medium text-slate-800 whitespace-nowrap truncate">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {rightAction && (
            <div className="ml-4">
              {rightAction}
            </div>
          )}
        </div>
      </div>

      <main className="animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;