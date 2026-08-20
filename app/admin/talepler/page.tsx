"use client";

import { useEffect, useState } from "react";

type Message = {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Message[]>([]);

  async function load() {
    const res = await fetch("/api/contact");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">
        Müşteri Talepleri
      </h1>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="rounded-lg border border-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-navy">{item.name}</h3>
                <p className="text-xs text-muted">
                  {new Date(item.createdAt).toLocaleString("tr-TR")} ·{" "}
                  {item.status === "unread" ? "Okunmadı" : item.status === "read" ? "Okundu" : "Silindi"}
                </p>
                {item.phone ? <p className="mt-1 text-sm">{item.phone}</p> : null}
                {item.email ? <p className="text-sm">{item.email}</p> : null}
                <p className="mt-3 text-sm text-anthracite">{item.message}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <button type="button" className="btn-outline !py-1.5 text-xs" onClick={() => setStatus(item._id, "read")}>
                  Okundu
                </button>
                <button type="button" className="btn-outline !py-1.5 text-xs" onClick={() => setStatus(item._id, "unread")}>
                  Okunmadı
                </button>
                <button type="button" className="text-danger hover:underline" onClick={() => setStatus(item._id, "deleted")}>
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-muted">Henüz talep yok.</p>
        ) : null}
      </div>
    </div>
  );
}
