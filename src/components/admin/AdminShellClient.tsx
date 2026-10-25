'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminShellClientProps {
  children: React.ReactNode;
  userFullName?: string;
  userRole?: string;
  isDbConnected?: boolean;
}

export function AdminShellClient({
  children,
  userFullName = 'Administrator',
  userRole = 'super_admin',
  isDbConnected = true,
}: AdminShellClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0C0A] text-[#FAF7F2] flex antialiased selection:bg-[#521D2B] selection:text-[#FAF7F2] relative overflow-x-hidden">
      {/* Ambient Royal Gold atmospheric glow for depth */}
      <div 
        className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(214,181,109,0.04)_0%,_transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div 
        className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(82,29,43,0.06)_0%,_transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userFullName={userFullName}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 relative z-10">
        <AdminHeader
          onMenuToggle={() => setIsSidebarOpen(true)}
          userFullName={userFullName}
          userRole={userRole}
          isDbConnected={isDbConnected}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
