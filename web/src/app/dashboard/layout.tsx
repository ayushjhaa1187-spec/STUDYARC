import { ReactNode } from 'react';
import { Header } from '@/components/dashboard/Header';
import { ProgressSidebar } from '@/components/dashboard/ProgressSidebar';

export const metadata = {
  title: 'Dashboard | SkillBridge Pro',
  description: 'Sprint Execution Dashboard',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <ProgressSidebar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
