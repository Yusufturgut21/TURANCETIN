"use client";

import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { Upload, X } from "lucide-react";

type Uploaded = { url: string; publicId: string };

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = "turancetin",
  label = "Görsel yükle",
}: {
  value?: Uploaded | Uploaded[] | null;
  onChange: (value: Uploaded | Uploaded[] | null) => void;
  multiple?: boolean;
  folder?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setLoading(true);
    setError("");
    try {
      const uploaded: Uploaded[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Yükleme başarısız");
        }
        uploaded.push(json.data);
      }

      if (multiple) {
        const current = Array.isArray(value) ? value : [];
        onChange([...current, ...uploaded]);
      } else {
        onChange(uploaded[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  }

  const list = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value && !Array.isArray(value)
      ? [value]
      : [];

  return (
    <div>
      <label className="label-field">{label}</label>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center hover:border-navy/40">
        <Upload className="mb-2 h-6 w-6 text-muted" />
        <span className="text-sm text-muted">
          {loading ? "Yükleniyor..." : "Görsel seçin veya sürükleyin"}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          disabled={loading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      {list.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {list.map((img, index) => (
            <div
              key={img.publicId}
              className="relative h-24 w-24 overflow-hidden rounded border border-border"
            >
              <SmartImage src={img.url} alt="" fill className="object-cover" sizes="96px" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5"
                onClick={() => {
                  if (multiple) {
                    onChange(list.filter((_, i) => i !== index));
                  } else {
                    onChange(null);
                  }
                }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
