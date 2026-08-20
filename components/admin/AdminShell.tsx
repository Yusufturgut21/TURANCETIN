"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Folders,
  Tags,
  Megaphone,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Search,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Folders },
  { href: "/admin/markalar", label: "Markalar", icon: Tags },
  { href: "/admin/kampanyalar", label: "Kampanyalar", icon: Megaphone },
  { href: "/admin/bannerlar", label: "Bannerlar", icon: ImageIcon },
  { href: "/admin/talepler", label: "Müşteri Talepleri", icon: MessageSquare },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
  { href: "/admin/seo", label: "SEO Ayarları", icon: Search },
  { href: "/admin/kullanicilar", label: "Admin Kullanıcıları", icon: Users },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-1 p-3">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-navy text-white"
                : "text-anthracite hover:bg-surface"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:block">
          <div className="border-b border-border px-4 py-5">
            <Link href="/admin" className="font-display text-lg font-semibold text-navy">
              TURANÇETİN Admin
            </Link>
            <p className="mt-1 text-xs text-muted">{userName}</p>
          </div>
          {nav}
          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/giris" })}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm text-danger hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
            <Link href="/" className="mt-1 block px-3 py-2 text-xs text-muted hover:text-navy">
              Siteye git →
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:px-6">
            <button
              type="button"
              className="rounded-md p-2 hover:bg-surface lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="font-medium text-navy lg:hidden">Admin Panel</p>
            <div className="ml-auto text-sm text-muted">{userName}</div>
          </header>
          <div className="flex-1 p-4 md:p-6">{children}</div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="font-semibold text-navy">Menü</span>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      ) : null}
    </div>
  );
}
