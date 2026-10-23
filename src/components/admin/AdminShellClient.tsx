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
    <div className="min-h-screen bg-[#070605] text-[#f5f0eb] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userFullName={userFullName}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <AdminHeader
          onMenuToggle={() => setIsSidebarOpen(true)}
          userFullName={userFullName}
          userRole={userRole}
          isDbConnected={isDbConnected}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
