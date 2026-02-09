'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-white dark:bg-[#0A0A0A]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="lg:pl-64">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="min-h-screen pt-16 bg-gray-50 dark:bg-[#0A0A0A]">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
