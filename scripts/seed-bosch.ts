import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { slugify } from "../lib/utils";

const titles = [
  "Serie 6 Alttan Donduruculu Ankastre Buzdolabı 193.5 x 70.8 cm softClosing Düz Menteşe",
  "Serie 6 Alttan Donduruculu Ankastre Buzdolabı 177.2 x 55.8 cm Düz Menteşe",
  "Serie 4 Gardırop Tipi Buzdolabı 183 x 90.5 cm Paslanmaz çelik",
  "Serie 8 Alttan Donduruculu Buzdolabı 186 x 86 cm Parmak izi bırakmayan siyah inoks",
  "Serie 8 Alttan Donduruculu Buzdolabı 186 x 86 cm Paslanmaz çelik",
  "Serie 8 Alttan Donduruculu Buzdolabı 186 x 75 cm Paslanmaz çelik",
  "Serie 8 Alttan Donduruculu Buzdolabı 186 x 75 cm Paslanmaz çelik",
  "Serie 8 Alttan Donduruculu Buzdolabı 186 x 86 cm Beyaz",
  "Serie 6 Üstten Donduruculu Buzdolabı 186 x 86 cm Paslanmaz çelik",
  "Serie 8 Alttan Donduruculu Buzdolabı 186 x 75 cm Beyaz",
  "Serie 6 Alttan Donduruculu Buzdolabı 186 x 75 cm Parmak izi bırakmayan siyah inoks",
  "Serie 6 Alttan Donduruculu Buzdolabı 186 x 86 cm Paslanmaz çelik",
  "Serie 6 Üstten Donduruculu Buzdolabı 186 x 86 cm Beyaz",
  "Serie 6 Üstten Donduruculu Buzdolabı 186 x 75 cm Paslanmaz çelik",
  "Serie 6 Alttan Donduruculu Buzdolabı 186 x 86 cm Beyaz",
  "Serie 6 Alttan Donduruculu Buzdolabı 186 x 75 cm Paslanmaz çelik",
  "Serie 6 Alttan Donduruculu Buzdolabı 186 x 75 cm Beyaz",
  "Serie 6 Alttan Donduruculu Buzdolabı 193 x 70 cm Siyah",
  "Serie 6 Alttan Donduruculu Buzdolabı 186 x 86 cm Beyaz",
  "Serie 4 Alttan Donduruculu Buzdolabı 186 x 75 cm Paslanmaz çelik",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 75 cm Paslanmaz çelik",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 86 cm Beyaz",
  "Serie 4 Alttan Donduruculu Buzdolabı 186 x 75 cm Beyaz",
  "Serie 4 Alttan Donduruculu Buzdolabı 186.2 x 69.5 cm Kolay temizlenebilir Inox",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 75 cm Beyaz",
  "Serie 4 Alttan Donduruculu Buzdolabı 186 x 70 cm Paslanmaz çelik",
  "Serie 4 Alttan Donduruculu Buzdolabı 186.2 x 69.5 cm Beyaz",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 75 cm Beyaz",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 70 cm Paslanmaz çelik",
  "Serie 4 Alttan Donduruculu Buzdolabı 186 x 70 cm Beyaz",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 70 cm Beyaz",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 70 cm Paslanmaz çelik",
  "Serie 2 Alttan Donduruculu Buzdolabı 186.2 x 69.5 cm Beyaz",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 70 cm Beyaz",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 70 cm Inox Görünümlü",
  "Serie 4 Üstten Donduruculu Buzdolabı 186 x 70 cm Beyaz",
  "Serie 2 Üstten Donduruculu Buzdolabı 178 x 70 cm Beyaz",
];

async function seedBosch() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI tanımlı değil.");
  }

  await connectDB();

  const category = await Category.findOne({ name: "Buzdolapları & Derin Dondurucular" });
  if (!category) {
    console.error('Kategori bulunamadı: "Buzdolapları & Derin Dondurucular"');
    process.exit(1);
  }
  console.log(`Kategori: ${category.name} (${category._id})`);

  // Bu kategorideki mevcut Bosch ürünlerini temizle
  const deleted = await Product.deleteMany({ category: category._id, brand: "Bosch" });
  console.log(`${deleted.deletedCount} eski Bosch ürünü silindi.`);

  const slugCount: Record<string, number> = {};
  let added = 0;

  for (const title of titles) {
    const baseSlug = `bosch-${slugify(title)}`;

    // Bu base için kaçıncı kullanım olduğunu say
    slugCount[baseSlug] = (slugCount[baseSlug] || 0) + 1;
    const slug = slugCount[baseSlug] === 1 ? baseSlug : `${baseSlug}-${slugCount[baseSlug]}`;

    const exists = await Product.findOne({ slug });
    if (exists) {
      console.log(`Atlandı (mevcut): ${slug}`);
      continue;
    }

    const doc = new Product({
      title,
      brand: "Bosch",
      category: category._id,
      images: [],
      isCampaign: false,
      isFeatured: false,
      isNew: false,
      isActive: true,
      slug,
    });

    await doc.save({ validateBeforeSave: false });
    added++;
    console.log(`✓ ${title}`);
    // Ekleme sırasını garantilemek için küçük gecikme
    await new Promise((r) => setTimeout(r, 20));
  }

  console.log(`\nTamamlandı: ${added} ürün eklendi.`);
  await mongoose.disconnect();
}

seedBosch().catch((err) => {
  console.error(err);
  process.exit(1);
});
