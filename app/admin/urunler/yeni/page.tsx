import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-navy">
        Yeni Ürün
      </h1>
      <p className="mb-6 text-sm text-muted">
        Minimum: ürün adı + kategori + görsel. Diğer alanlar isteğe bağlıdır.
      </p>
      <ProductForm />
    </div>
  );
}
