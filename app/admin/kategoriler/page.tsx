"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Category = {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  image?: { url: string; publicId: string } | null;
};

const empty = {
  name: "",
  description: "",
  slug: "",
  isActive: true,
  sortOrder: 0,
  image: null as { url: string; publicId: string } | null,
};

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/categories?admin=1");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Kategori adı zorunludur.");
      return;
    }
    const res = await fetch(
      editId ? `/api/categories/${editId}` : "/api/categories",
      {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const json = await res.json();
    if (!json.success) {
      setError(json.error || "Bir hata oluştu.");
      return;
    }
    setForm(empty);
    setEditId(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Kategori silinsin mi?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">
          Kategoriler
        </h1>
        <form onSubmit={save} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold">
            {editId ? "Kategori Düzenle" : "Yeni Kategori"}
          </h2>
          <div>
            <label className="label-field">Kategori Adı *</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-field">Açıklama</label>
            <textarea
              className="input-field min-h-20"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Slug</label>
            <input
              className="input-field"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="Otomatik"
            />
          </div>
          <div>
            <label className="label-field">Sıralama</label>
            <input
              type="number"
              className="input-field"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
            />
          </div>
          <ImageUploader
            label="Kategori görseli"
            folder="turancetin/categories"
            value={form.image}
            onChange={(img) =>
              setForm({ ...form, image: img as typeof form.image })
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Aktif
          </label>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">
              Kaydet
            </button>
            {editId ? (
              <button
                type="button"
                className="btn-outline text-sm"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                İptal
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-3 text-left">Ad</th>
              <th className="px-3 py-3 text-left">Sıra</th>
              <th className="px-3 py-3 text-left">Durum</th>
              <th className="px-3 py-3 text-left">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b last:border-0">
                <td className="px-3 py-3 font-medium">{item.name}</td>
                <td className="px-3 py-3">{item.sortOrder}</td>
                <td className="px-3 py-3">
                  {item.isActive ? "Aktif" : "Pasif"}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className="mr-3 text-navy hover:underline"
                    onClick={() => {
                      setEditId(item._id);
                      setForm({
                        name: item.name,
                        description: item.description || "",
                        slug: item.slug,
                        isActive: item.isActive,
                        sortOrder: item.sortOrder,
                        image: item.image || null,
                      });
                    }}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="text-danger hover:underline"
                    onClick={() => remove(item._id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
