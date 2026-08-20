"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatPrice } from "@/lib/utils";

type Product = {
  _id: string;
  title: string;
  brand?: string;
  slug: string;
  price?: number;
  discountedPrice?: number;
  isActive: boolean;
  isCampaign: boolean;
  createdAt: string;
  images: { url: string }[];
  category?: { _id?: string; name?: string };
};

type Category = {
  _id: string;
  name: string;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(Array.isArray(json.data) ? json.data : []);
      });
  }, []);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ admin: "1", limit: "50" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (categoryId) params.set("category", categoryId);
    const res = await fetch(`/api/products?${params}`);
    const json = await res.json();
    if (json.success) setItems(json.data.items);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    const product = items.find((p) => p._id === id);
    if (!product) return;
    const full = await fetch(`/api/products/${id}`).then((r) => r.json());
    if (!full.success) return;
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...full.data, category: full.data.category?._id || full.data.category, isActive }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  async function duplicate(id: string) {
    const res = await fetch(`/api/products/${id}/duplicate`, { method: "POST" });
    const json = await res.json();
    if (json.success) {
      window.location.href = `/admin/urunler/${json.data._id}`;
    }
  }

  async function bulk(action: "activate" | "deactivate" | "delete") {
    if (!selected.length) return;
    if (action === "delete" && !confirm("Seçili ürünler silinsin mi?")) return;
    await fetch("/api/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected, action }),
    });
    setSelected([]);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Ürünler</h1>
          <p className="text-sm text-muted">Ürün kataloğunu yönetin</p>
        </div>
        <Link href="/admin/urunler/yeni" className="btn-primary text-sm">
          + Yeni Ürün
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <select
          className="input-field max-w-[180px]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="campaign">Kampanya</option>
        </select>
        <select
          className="input-field max-w-[220px]"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={load} className="btn-outline text-sm">
          Filtrele
        </button>
      </div>

      {selected.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 rounded-lg border border-border bg-white p-3 text-sm">
          <span>{selected.length} seçili</span>
          <button type="button" className="underline" onClick={() => bulk("activate")}>
            Aktif yap
          </button>
          <button type="button" className="underline" onClick={() => bulk("deactivate")}>
            Pasif yap
          </button>
          <button type="button" className="text-danger underline" onClick={() => bulk("delete")}>
            Sil
          </button>
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === items.length && items.length > 0}
                  onChange={(e) =>
                    setSelected(e.target.checked ? items.map((i) => i._id) : [])
                  }
                />
              </th>
              <th className="px-3 py-3">Görsel</th>
              <th className="px-3 py-3">Ürün</th>
              <th className="px-3 py-3">Marka</th>
              <th className="px-3 py-3">Kategori</th>
              <th className="px-3 py-3">Fiyat</th>
              <th className="px-3 py-3">Durum</th>
              <th className="px-3 py-3">Kampanya</th>
              <th className="px-3 py-3">Tarih</th>
              <th className="px-3 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-muted">
                  Yükleniyor...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-muted">
                  Ürün bulunamadı.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-b border-border last:border-0">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={(e) =>
                        setSelected((prev) =>
                          e.target.checked
                            ? [...prev, item._id]
                            : prev.filter((id) => id !== item._id)
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-surface">
                      {item.images?.[0]?.url ? (
                        <SmartImage src={item.images[0].url} alt="" fill className="object-contain p-1" sizes="48px" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-medium">{item.title}</td>
                  <td className="px-3 py-3">{item.brand || "—"}</td>
                  <td className="px-3 py-3">{item.category?.name || "—"}</td>
                  <td className="px-3 py-3">
                    {item.price != null ? formatPrice(item.discountedPrice ?? item.price) : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-3 py-3">{item.isCampaign ? "Evet" : "Hayır"}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2 whitespace-nowrap">
                      <Link href={`/admin/urunler/${item._id}`} className="text-navy hover:underline">
                        Düzenle
                      </Link>
                      <Link href={`/urun/${item.slug}`} target="_blank" className="hover:underline">
                        Görüntüle
                      </Link>
                      <button type="button" onClick={() => duplicate(item._id)} className="hover:underline">
                        Kopyala
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(item._id, !item.isActive)}
                        className="hover:underline"
                      >
                        {item.isActive ? "Pasif yap" : "Aktif yap"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item._id)}
                        className="text-danger hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
