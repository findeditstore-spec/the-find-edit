import { ReactNode } from 'react';
import SiteHeader from '../SiteHeader';
import SiteFooter from '../SiteFooter';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <SiteHeader />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
