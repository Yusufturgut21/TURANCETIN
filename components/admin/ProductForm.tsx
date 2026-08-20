"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Trash2 } from "lucide-react";

type Spec = { key: string; value: string };
type Img = { url: string; publicId: string; isPrimary?: boolean };
type Option = { _id: string; name: string };

type ProductFormState = {
  title: string;
  brand: string;
  model: string;
  category: string;
  subCategory: string;
  shortDescription: string;
  description: string;
  warranty: string;
  specifications: Spec[];
  price: string;
  discountedPrice: string;
  images: Img[];
  isCampaign: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  slug: string;
  seoTitle: string;
  seoDescription: string;
};

const empty: ProductFormState = {
  title: "",
  brand: "",
  model: "",
  category: "",
  subCategory: "",
  shortDescription: "",
  description: "",
  warranty: "",
  specifications: [],
  price: "",
  discountedPrice: "",
  images: [],
  isCampaign: false,
  isFeatured: false,
  isNew: false,
  isActive: true,
  slug: "",
  seoTitle: "",
  seoDescription: "",
};

type InitialProduct = {
  title?: string;
  brand?: string;
  model?: string;
  category?: string | { _id: string };
  subCategory?: string | { _id: string } | null;
  shortDescription?: string;
  description?: string;
  warranty?: string;
  specifications?: Spec[];
  price?: number | string | null;
  discountedPrice?: number | string | null;
  images?: Img[];
  isCampaign?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export function ProductForm({
  initial,
  productId,
}: {
  initial?: InitialProduct;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(() => {
    if (!initial) return empty;
    const categoryId =
      typeof initial.category === "object" && initial.category
        ? initial.category._id
        : initial.category || "";
    const subCategoryId =
      typeof initial.subCategory === "object" && initial.subCategory
        ? initial.subCategory._id
        : initial.subCategory || "";
    return {
      ...empty,
      title: initial.title || "",
      brand: initial.brand || "",
      model: initial.model || "",
      category: categoryId,
      subCategory: subCategoryId,
      shortDescription: initial.shortDescription || "",
      description: initial.description || "",
      warranty: initial.warranty || "",
      specifications: initial.specifications || [],
      price:
        initial.price != null && initial.price !== ""
          ? String(initial.price)
          : "",
      discountedPrice:
        initial.discountedPrice != null && initial.discountedPrice !== ""
          ? String(initial.discountedPrice)
          : "",
      images: initial.images || [],
      isCampaign: initial.isCampaign ?? false,
      isFeatured: initial.isFeatured ?? false,
      isNew: initial.isNew ?? false,
      isActive: initial.isActive ?? true,
      slug: initial.slug || "",
      seoTitle: initial.seoTitle || "",
      seoDescription: initial.seoDescription || "",
    };
  });
  const [categories, setCategories] = useState<Option[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories?admin=1")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      });
  }, []);

  function update<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Ürün başlığı zorunludur.");
      return;
    }
    if (!form.category) {
      setError("Kategori zorunludur.");
      return;
    }
    if (!form.images.length) {
      setError("En az bir ürün görseli yükleyin.");
      return;
    }

    const price = form.price.trim() === "" ? null : Number(form.price);
    const discountedPrice =
      form.discountedPrice.trim() === "" ? null : Number(form.discountedPrice);

    if (discountedPrice != null && (price == null || discountedPrice >= price)) {
      setError(
        "İndirimli fiyat, normal fiyattan düşük olmalıdır. Normal fiyat girilmeden indirimli fiyat eklenemez."
      );
      return;
    }

    const images = form.images.map((img, i) => ({
      ...img,
      isPrimary: i === 0,
    }));

    const payload = {
      title: form.title.trim(),
      brand: form.brand.trim() || undefined,
      model: form.model.trim() || undefined,
      category: form.category,
      subCategory: form.subCategory || null,
      shortDescription: form.shortDescription.trim() || undefined,
      description: form.description.trim() || undefined,
      warranty: form.warranty.trim() || undefined,
      specifications: form.specifications.filter((s) => s.key && s.value),
      price,
      discountedPrice,
      images,
      isCampaign: form.isCampaign,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isActive: form.isActive,
      slug: form.slug.trim() || undefined,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
    };

    setLoading(true);
    try {
      const res = await fetch(
        productId ? `/api/products/${productId}` : "/api/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
        setLoading(false);
        return;
      }
      router.push("/admin/urunler");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-8">
      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold text-navy">Temel Bilgiler</h2>
        <div className="space-y-4">
          <div>
            <label className="label-field">Ürün Başlığı *</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Örn: Bosch Serie 4 Çamaşır Makinesi"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-field">Marka</label>
              <input
                className="input-field"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Model</label>
              <input
                className="input-field"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-field">Kategori *</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                required
              >
                <option value="">Seçin</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Alt Kategori</label>
              <select
                className="input-field"
                value={form.subCategory}
                onChange={(e) => update("subCategory", e.target.value)}
              >
                <option value="">Yok</option>
                {categories
                  .filter((c) => c._id !== form.category)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold text-navy">Açıklama</h2>
        <div className="space-y-4">
          <div>
            <label className="label-field">Kısa Açıklama</label>
            <textarea
              className="input-field min-h-20"
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Ürün Açıklaması</label>
            <textarea
              className="input-field min-h-32"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold text-navy">Ürün Detayları</h2>
        <div className="space-y-4">
          <div>
            <label className="label-field">Garanti Süresi</label>
            <input
              className="input-field"
              value={form.warranty}
              onChange={(e) => update("warranty", e.target.value)}
              placeholder="Örn: 2 Yıl"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label-field mb-0">Teknik Özellikler</label>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-navy"
                onClick={() =>
                  update("specifications", [
                    ...form.specifications,
                    { key: "", value: "" },
                  ])
                }
              >
                <Plus className="h-4 w-4" /> Ekle
              </button>
            </div>
            <div className="space-y-2">
              {form.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="input-field"
                    placeholder="Örn: Kapasite"
                    value={spec.key}
                    onChange={(e) => {
                      const next = [...form.specifications];
                      next[index] = { ...next[index], key: e.target.value };
                      update("specifications", next);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Örn: 9 kg"
                    value={spec.value}
                    onChange={(e) => {
                      const next = [...form.specifications];
                      next[index] = { ...next[index], value: e.target.value };
                      update("specifications", next);
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-md border border-border p-2 text-danger"
                    onClick={() =>
                      update(
                        "specifications",
                        form.specifications.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold text-navy">Görseller</h2>
        <ImageUploader
          label="Ana görsel ve galeri *"
          multiple
          folder="turancetin/products"
          value={form.images}
          onChange={(imgs) => update("images", (imgs as Img[]) || [])}
        />
        <p className="mt-2 text-xs text-muted">
          İlk görsel ana görsel olarak kullanılır. En az 1 görsel zorunludur.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold text-navy">Fiyat</h2>
        <p className="mb-4 text-sm text-muted">
          Fiyat girmek zorunlu değildir. Boş bırakırsanız sitede “Fiyat için
          iletişime geçin” görünür.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field">Fiyat (TL)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">İndirimli Fiyat (TL)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.discountedPrice}
              onChange={(e) => update("discountedPrice", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold text-navy">Görünürlük</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["isCampaign", "Kampanyalı Ürün"],
              ["isFeatured", "Öne Çıkan Ürün"],
              ["isNew", "Yeni Ürün"],
              ["isActive", "Aktif"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => update(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold text-navy">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="label-field">Slug</label>
            <input
              className="input-field"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="Boş bırakılırsa otomatik oluşur"
            />
          </div>
          <div>
            <label className="label-field">SEO Başlığı</label>
            <input
              className="input-field"
              value={form.seoTitle}
              onChange={(e) => update("seoTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">SEO Açıklaması</label>
            <textarea
              className="input-field min-h-20"
              value={form.seoDescription}
              onChange={(e) => update("seoDescription", e.target.value)}
            />
          </div>
        </div>
      </section>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={() => router.push("/admin/urunler")}
        >
          İptal
        </button>
      </div>
    </form>
  );
}
