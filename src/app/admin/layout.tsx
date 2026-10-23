import type { Metadata } from 'next';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { isDatabaseConfigured } from '@/lib/db/client';
import { AdminShellClient } from '@/components/admin/AdminShellClient';

export const metadata: Metadata = {
  title: 'Concierge Command Center | Royal Wedding Hub Admin',
  description: 'Administrative portal for Royal Wedding Hub content and inquiries.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  const dbConfigured = isDatabaseConfigured();

  // If there's no authenticated session (e.g. on /admin/login), render children directly without the shell
  if (!admin) {
    return <>{children}</>;
  }

  return (
    <AdminShellClient
      userFullName={admin.fullName}
      userRole={admin.role}
      isDbConnected={dbConfigured}
    >
      {children}
    </AdminShellClient>
  );
}
