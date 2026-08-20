"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProduct(json.data);
        else setError(json.error || "Ürün yüklenemedi.");
      })
      .catch(() => setError("Bir hata oluştu. Lütfen tekrar deneyin."));
  }, [params.id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!product) return <p className="text-muted">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-navy">
        Ürünü Düzenle
      </h1>
      <ProductForm initial={product} productId={params.id} />
    </div>
  );
}
