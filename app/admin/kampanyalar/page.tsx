"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Campaign = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  products?: string[];
  banner?: { url: string; publicId: string } | null;
};

type ProductOption = { _id: string; title: string };

const empty = {
  title: "",
  description: "",
  slug: "",
  isActive: true,
  startDate: "",
  endDate: "",
  products: [] as string[],
  banner: null as { url: string; publicId: string } | null,
};

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [cRes, pRes] = await Promise.all([
      fetch("/api/campaigns?admin=1"),
      fetch("/api/products?admin=1&limit=100"),
    ]);
    const cJson = await cRes.json();
    const pJson = await pRes.json();
    if (cJson.success) setItems(cJson.data);
    if (pJson.success) setProducts(pJson.data.items);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }
    const res = await fetch(
      editId ? `/api/campaigns/${editId}` : "/api/campaigns",
      {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      }
    );
    const json = await res.json();
    if (!json.success) {
      setError(json.error || "Bir hata oluştu.");
      return;
    }
    setForm(empty);
    setEditId(null);
    setError("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Kampanya silinsin mi?")) return;
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_1.1fr]">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">Kampanyalar</h1>
        <form onSubmit={save} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-5">
          <div>
            <label className="label-field">Başlık *</label>
            <input className="input-field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Açıklama</label>
            <textarea className="input-field min-h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-field">Başlangıç</label>
              <input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Bitiş</label>
              <input type="date" className="input-field" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <ImageUploader
            label="Banner görseli"
            folder="turancetin/campaigns"
            value={form.banner}
            onChange={(img) => setForm({ ...form, banner: img as typeof form.banner })}
          />
          <div>
            <label className="label-field">Ürünler</label>
            <select
              multiple
              className="input-field min-h-40"
              value={form.products}
              onChange={(e) =>
                setForm({
                  ...form,
                  products: Array.from(e.target.selectedOptions).map((o) => o.value),
                })
              }
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">Ctrl/Cmd ile çoklu seçim</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Aktif
          </label>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <button type="submit" className="btn-primary text-sm">Kaydet</button>
        </form>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-navy">{item.title}</h3>
                <p className="text-xs text-muted">
                  {item.isActive ? "Aktif" : "Pasif"}
                  {item.endDate ? ` · Bitiş: ${new Date(item.endDate).toLocaleDateString("tr-TR")}` : ""}
                </p>
              </div>
              <div className="flex gap-2 text-sm">
                <button type="button" className="text-navy hover:underline" onClick={() => {
                  setEditId(item._id);
                  setForm({
                    title: item.title,
                    description: item.description || "",
                    slug: item.slug,
                    isActive: item.isActive,
                    startDate: item.startDate ? item.startDate.slice(0, 10) : "",
                    endDate: item.endDate ? item.endDate.slice(0, 10) : "",
                    products: (item.products || []).map((p) =>
                      typeof p === "string" ? p : (p as { _id: string })._id
                    ),
                    banner: item.banner || null,
                  });
                }}>Düzenle</button>
                <button type="button" className="text-danger hover:underline" onClick={() => remove(item._id)}>Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
