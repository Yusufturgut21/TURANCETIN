"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Phone,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: { url?: string } | null;
};

type Settings = {
  shortName?: string;
  logo?: { url?: string };
  phone?: string;
  whatsapp?: string;
};

export function Header({
  categories,
  settings,
}: {
  categories: Category[];
  settings: Settings;
}) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { _id: string; title: string; slug: string; brand?: string }[]
  >([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) setResults(json.data);
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const phone = settings.phone || "";
  const whatsapp = settings.whatsapp || "";
  const brand = settings.shortName || "TURANÇETİN";

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setOpen(false);
    router.push(`/urunler?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-border bg-surface text-sm md:block">
        <div className="container-main flex h-9 items-center justify-between text-muted">
          <span>Beyaz eşya ve küçük ev aletleri</span>
          <div className="flex items-center gap-4">
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-navy">
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={getWhatsAppUrl(whatsapp, "Merhaba, bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-navy"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container-main flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          {settings.logo?.url ? (
            <SmartImage
              src={settings.logo.url}
              alt={brand}
              width={140}
              height={40}
              keepAspect
              className="max-h-9 object-contain"
            />
          ) : (
            <span className="font-display text-lg font-semibold tracking-tight text-navy md:text-xl">
              {brand}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
          >
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-anthracite hover:bg-surface hover:text-navy"
            >
              Ürünler
              <ChevronDown className="h-4 w-4" />
            </Link>
            {mega ? (
              <div className="absolute left-0 top-full z-50 w-[720px] rounded-lg border border-border bg-white p-4 shadow-xl">
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(0, 12).map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/kategori/${cat.slug}`}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-surface"
                      onClick={() => setMega(false)}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-surface">
                        {cat.image?.url ? (
                          <SmartImage
                            src={cat.image.url}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted">
                            {cat.name.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-navy line-clamp-2">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <Link
                    href="/urunler"
                    className="text-sm font-semibold text-navy hover:underline"
                    onClick={() => setMega(false)}
                  >
                    Tüm ürünleri gör →
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
          <Link href="/urunler?campaign=1" className="rounded-md px-3 py-2 text-sm font-medium text-anthracite hover:bg-surface hover:text-navy">
            Kampanyalı Ürünler
          </Link>
          <Link href="/hakkimizda" className="rounded-md px-3 py-2 text-sm font-medium text-anthracite hover:bg-surface hover:text-navy">
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="rounded-md px-3 py-2 text-sm font-medium text-anthracite hover:bg-surface hover:text-navy">
            İletişim
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block" ref={searchRef}>
            <form onSubmit={submitSearch} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Ürün, marka veya model ara..."
                className="input-field w-56 pl-9 lg:w-72"
              />
            </form>
            {searchOpen && results.length > 0 ? (
              <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
                {results.map((item) => (
                  <Link
                    key={item._id}
                    href={`/urun/${item.slug}`}
                    className="block border-b border-border px-3 py-2.5 last:border-0 hover:bg-surface"
                    onClick={() => setSearchOpen(false)}
                  >
                    <p className="text-sm font-medium text-navy line-clamp-1">
                      {item.title}
                    </p>
                    {item.brand ? (
                      <p className="text-xs text-muted">{item.brand}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-navy hover:bg-surface md:hidden"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Ara"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="rounded-md p-2 text-navy hover:bg-surface lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-border px-4 py-3 md:hidden" ref={searchRef}>
          <form onSubmit={submitSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün ara..."
              className="input-field"
              autoFocus
            />
          </form>
          {results.length > 0 ? (
            <div className="mt-2 max-h-64 overflow-auto rounded-md border border-border">
              {results.map((item) => (
                <Link
                  key={item._id}
                  href={`/urun/${item.slug}`}
                  className="block border-b border-border px-3 py-2 last:border-0"
                  onClick={() => {
                    setSearchOpen(false);
                    setOpen(false);
                  }}
                >
                  <p className="text-sm font-medium">{item.title}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {open ? (
        <div className="max-h-[80vh] overflow-y-auto border-t border-border bg-white lg:hidden">
          <div className="container-main space-y-1 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Kategoriler
            </p>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/kategori/${cat.slug}`}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-navy hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="my-3 border-t border-border" />
            <Link href="/urunler?campaign=1" className="block rounded-md px-3 py-2.5 text-sm font-medium" onClick={() => setOpen(false)}>
              Kampanyalı Ürünler
            </Link>
            <Link href="/hakkimizda" className="block rounded-md px-3 py-2.5 text-sm font-medium" onClick={() => setOpen(false)}>
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="block rounded-md px-3 py-2.5 text-sm font-medium" onClick={() => setOpen(false)}>
              İletişim
            </Link>
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-navy">
                <Phone className="h-4 w-4" /> {phone}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
