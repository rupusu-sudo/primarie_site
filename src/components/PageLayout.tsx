import React from 'react';
interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  title?: string;
}

const PageLayout = ({ children, breadcrumbs, title }: PageLayoutProps) => {
  return (
    <div className="flex flex-col font-sans text-slate-900 bg-slate-50 w-full">
      <main className="flex-grow pt-4 pb-16 px-4 lg:px-8"> 
        <div className="container mx-auto">
            {breadcrumbs && (
                <nav className="flex mb-6 text-sm text-slate-500 overflow-x-auto whitespace-nowrap py-2" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && <span className="mx-2 text-slate-300">/</span>}
                                {crumb.href && crumb.href !== '#' ? (
                                    <a href={crumb.href} className="hover:text-blue-600 transition-colors font-medium">
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="font-bold text-slate-800">{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            {title && (
              <h1 className="text-3xl font-bold mb-6 text-slate-900">{title}</h1>
            )}
            {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;