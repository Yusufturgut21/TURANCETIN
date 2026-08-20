"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Banner = {
  _id: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  sortOrder: number;
  isActive: boolean;
  image: { url: string; publicId: string };
};

const empty = {
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  sortOrder: 0,
  isActive: true,
  image: null as { url: string; publicId: string } | null,
};

export default function AdminBannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/banners?admin=1");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.image) {
      setError("Başlık ve görsel zorunludur.");
      return;
    }
    const res = await fetch(editId ? `/api/banners/${editId}` : "/api/banners", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
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
    if (!confirm("Banner silinsin mi?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">Bannerlar</h1>
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
              <label className="label-field">Buton metni</label>
              <input className="input-field" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Buton linki</label>
              <input className="input-field" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} placeholder="/urunler" />
            </div>
          </div>
          <div>
            <label className="label-field">Sıralama</label>
            <input type="number" className="input-field" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
          <ImageUploader
            label="Banner görseli *"
            folder="turancetin/banners"
            value={form.image}
            onChange={(img) => setForm({ ...form, image: img as typeof form.image })}
          />
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
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-muted">Sıra: {item.sortOrder} · {item.isActive ? "Aktif" : "Pasif"}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button type="button" className="text-navy hover:underline" onClick={() => {
                  setEditId(item._id);
                  setForm({
                    title: item.title,
                    description: item.description || "",
                    buttonText: item.buttonText || "",
                    buttonLink: item.buttonLink || "",
                    sortOrder: item.sortOrder,
                    isActive: item.isActive,
                    image: item.image,
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
