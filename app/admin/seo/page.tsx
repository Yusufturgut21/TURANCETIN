"use client";

import { useEffect, useState } from "react";

export default function AdminSeoPage() {
  const [seoDefaultTitle, setTitle] = useState("");
  const [seoDefaultDescription, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setTitle(json.data.seoDefaultTitle || "");
          setDescription(json.data.seoDefaultDescription || "");
        }
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const current = await fetch("/api/settings").then((r) => r.json());
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...current.data,
        seoDefaultTitle,
        seoDefaultDescription,
      }),
    });
    const json = await res.json();
    if (json.success) setMessage("SEO ayarları kaydedildi.");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-navy">
        SEO Ayarları
      </h1>
      <p className="mt-2 text-sm text-muted">
        Ürün/kategori SEO alanları boşsa sistem otomatik başlık üretir.
      </p>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-5">
        <div>
          <label className="label-field">Varsayılan site başlığı</label>
          <input className="input-field" value={seoDefaultTitle} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Varsayılan meta açıklama</label>
          <textarea className="input-field min-h-28" value={seoDefaultDescription} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {message ? <p className="text-sm text-success">{message}</p> : null}
        <button type="submit" className="btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
