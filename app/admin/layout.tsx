import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page kendi layout'unu kullanır
  if (!session?.user) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <AdminShell userName={session.user.name || session.user.email}>
        {children}
      </AdminShell>
    </SessionProvider>
  );
}
