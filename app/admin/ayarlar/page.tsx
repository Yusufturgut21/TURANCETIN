"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Settings = Record<string, unknown>;

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setForm(json.data);
      });
  }, []);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!json.success) {
      setError(json.error || "Bir hata oluştu.");
      return;
    }
    setForm(json.data);
    setMessage("Ayarlar kaydedildi.");
  }

  const workingHours = (form.workingHours as Record<string, string>) || {};
  const socialLinks = (form.socialLinks as Record<string, string>) || {};
  const whyUsItems =
    (form.whyUsItems as { title: string; description?: string; icon?: string }[]) ||
    [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">
        Site Ayarları
      </h1>
      <form onSubmit={save} className="mt-6 max-w-3xl space-y-6">
        <section className="space-y-4 rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold">Firma Bilgileri</h2>
          <div>
            <label className="label-field">Firma adı</label>
            <textarea
              className="input-field min-h-20"
              value={(form.companyName as string) || ""}
              onChange={(e) => setField("companyName", e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Kısa ad</label>
            <input
              className="input-field"
              value={(form.shortName as string) || ""}
              onChange={(e) => setField("shortName", e.target.value)}
            />
          </div>
          <ImageUploader
            label="Logo"
            folder="turancetin/settings"
            value={(form.logo as { url: string; publicId: string }) || null}
            onChange={(img) => setField("logo", img)}
          />
          <div>
            <label className="label-field">Logo boyutu</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={40}
                max={600}
                step={4}
                className="flex-1 accent-navy"
                value={(form.logoSize as number) || 140}
                onChange={(e) => setField("logoSize", Number(e.target.value))}
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={40}
                  className="input-field w-20 text-center"
                  value={(form.logoSize as number) || 140}
                  onChange={(e) => setField("logoSize", Math.max(40, Number(e.target.value)))}
                />
                <span className="text-sm text-muted">px</span>
              </div>
            </div>
          </div>
          <ImageUploader
            label="Favicon"
            folder="turancetin/settings"
            value={(form.favicon as { url: string; publicId: string }) || null}
            onChange={(img) => setField("favicon", img)}
          />
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold">İletişim</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-field">Telefon</label>
              <input className="input-field" value={(form.phone as string) || ""} onChange={(e) => setField("phone", e.target.value)} />
            </div>
            <div>
              <label className="label-field">WhatsApp</label>
              <input className="input-field" value={(form.whatsapp as string) || ""} onChange={(e) => setField("whatsapp", e.target.value)} placeholder="90555..." />
            </div>
          </div>
          <div>
            <label className="label-field">E-posta</label>
            <input className="input-field" value={(form.email as string) || ""} onChange={(e) => setField("email", e.target.value)} />
          </div>
          <div>
            <label className="label-field">Adres</label>
            <textarea className="input-field min-h-20" value={(form.address as string) || ""} onChange={(e) => setField("address", e.target.value)} />
          </div>
          <div>
            <label className="label-field">Google Maps linki</label>
            <input className="input-field" value={(form.googleMapsUrl as string) || ""} onChange={(e) => setField("googleMapsUrl", e.target.value)} />
          </div>
          <div>
            <label className="label-field">Google Maps embed (iframe HTML)</label>
            <textarea className="input-field min-h-24" value={(form.googleMapsEmbed as string) || ""} onChange={(e) => setField("googleMapsEmbed", e.target.value)} />
          </div>
          <div>
            <label className="label-field">Hafta içi / Cumartesi</label>
            <input className="input-field" value={workingHours.weekdays || ""} onChange={(e) => setField("workingHours", { ...workingHours, weekdays: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Pazar</label>
            <input className="input-field" value={workingHours.sunday || ""} onChange={(e) => setField("workingHours", { ...workingHours, sunday: e.target.value })} />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold">Sosyal Medya & Footer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-field">Instagram</label>
              <input className="input-field" value={socialLinks.instagram || ""} onChange={(e) => setField("socialLinks", { ...socialLinks, instagram: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Facebook</label>
              <input className="input-field" value={socialLinks.facebook || ""} onChange={(e) => setField("socialLinks", { ...socialLinks, facebook: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label-field">Footer açıklaması</label>
            <textarea className="input-field min-h-20" value={(form.footerDescription as string) || ""} onChange={(e) => setField("footerDescription", e.target.value)} />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold">Hakkımızda / Neden Biz?</h2>
          <div>
            <label className="label-field">Hakkımızda başlığı</label>
            <input className="input-field" value={(form.aboutTitle as string) || ""} onChange={(e) => setField("aboutTitle", e.target.value)} />
          </div>
          <div>
            <label className="label-field">Hakkımızda metni</label>
            <textarea className="input-field min-h-32" value={(form.aboutContent as string) || ""} onChange={(e) => setField("aboutContent", e.target.value)} />
          </div>
          <div>
            <label className="label-field">Neden Biz? başlığı</label>
            <input className="input-field" value={(form.whyUsTitle as string) || ""} onChange={(e) => setField("whyUsTitle", e.target.value)} />
          </div>
          <div className="space-y-3">
            {whyUsItems.map((item, index) => (
              <div key={index} className="grid gap-2 rounded border border-border p-3 md:grid-cols-2">
                <input
                  className="input-field"
                  placeholder="Başlık"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...whyUsItems];
                    next[index] = { ...next[index], title: e.target.value };
                    setField("whyUsItems", next);
                  }}
                />
                <input
                  className="input-field"
                  placeholder="Açıklama"
                  value={item.description || ""}
                  onChange={(e) => {
                    const next = [...whyUsItems];
                    next[index] = { ...next[index], description: e.target.value };
                    setField("whyUsItems", next);
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {message ? <p className="text-sm text-success">{message}</p> : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="btn-primary">Kaydet</button>
      </form>
    </div>
  );
}
