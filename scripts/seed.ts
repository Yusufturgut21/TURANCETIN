import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { Brand } from "../models/Brand";
import { Product } from "../models/Product";
import { Campaign } from "../models/Campaign";
import { Banner } from "../models/Banner";
import { SiteSettings } from "../models/SiteSettings";
import { slugify, COMPANY_FULL_NAME } from "../lib/utils";

/** Unsplash görselleri — beyaz eşya / mutfak / ev atmosferi */
const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const categoryData = [
  {
    name: "Kampanyalı Ürünler",
    description: "Güncel fırsatlar ve avantajlı fiyatlı ürünler.",
    image: img("1600585154340-be6161a56a0c", 800),
  },
  {
    name: "Buzdolapları & Derin Dondurucular",
    description: "Geniş hacimli, enerji tasarruflu soğutma çözümleri.",
    image: img("1571175443880-49e1d25b2bc5", 800),
  },
  {
    name: "Çamaşır & Kurutma Makineleri",
    description: "Sessiz, ekonomik ve yüksek kapasiteli yıkama.",
    image: img("1610557892470-55d9e80c0bce", 800),
  },
  {
    name: "Bulaşık Makinesi",
    description: "Hijyenik yıkama ve düşük su tüketimi.",
    image: img("1556910103-1c02745aae4d", 800),
  },
  {
    name: "Pişirme Grubu",
    description: "Fırın, ocak ve pişirme teknolojileri.",
    image: img("1556911220-bff31c812dba", 800),
  },
  {
    name: "Ankastre Ürünler",
    description: "Mutfağınıza uyumlu ankastre çözümler.",
    image: img("1556909114-f6e7ad7d3136", 800),
  },
  {
    name: "Elektrikli Süpürge",
    description: "Torbalı, torbasız ve dikey süpürgeler.",
    image: img("1558317374-067fb5f30001", 800),
  },
  {
    name: "Klima",
    description: "Serin ve konforlu yaşam alanları.",
    image: img("1631049307264-da0ec9d70304", 800),
  },
  {
    name: "Su Sebilleri ve Su Arıtma",
    description: "Temiz ve sağlıklı su için çözümler.",
    image: img("1584622650111-993a426fbf0a", 800),
  },
  {
    name: "Kahve Makinesi",
    description: "Espresso’dan filtreye günlük kahve keyfi.",
    image: img("1495474472287-4d71bcdd2085", 800),
  },
  {
    name: "Mutfak Makinesi ve Mutfak Robotu",
    description: "Hazırlık ve pişirmeyi kolaylaştıran robotlar.",
    image: img("1574269909862-7e1d70bb8078", 800),
  },
  {
    name: "Mutfak Aletleri",
    description: "Blender, toaster ve pratik mutfak yardımcıları.",
    image: img("1570222094114-d054a817e56b", 800),
  },
  {
    name: "Aksesuarlar & Temizlik ve Bakım Ürünleri",
    description: "Bakım, temizlik ve yedek aksesuarlar.",
    image: img("1563453392212-326f5e854473", 800),
  },
  {
    name: "Oyuncaklar",
    description: "Çocuklar için seçili ürünler.",
    image: img("1558060370-d644479cb6f7", 800),
  },
  {
    name: "Home Connect",
    description: "Akıllı ev bağlantılı ürünler.",
    image: img("1526170375885-4d8ecf77b99f", 800),
  },
];

const brandData = [
  { name: "TechHome", image: img("1558618666-fcd25c85cd64", 400) },
  { name: "NordFrost", image: img("1600566753190-17f0baa2a6c3", 400) },
  { name: "AquaClean", image: img("1581578731548-c64695cc6952", 400) },
  { name: "HeatMaster", image: img("1504674900247-0877df9cc836", 400) },
  { name: "AirPure", image: img("1631049307264-da0ec9d70304", 400) },
  { name: "BrewCraft", image: img("1495474472287-4d71bcdd2085", 400) },
  { name: "KitchenPro", image: img("1556911220-bff31c812dba", 400) },
  { name: "CleanWave", image: img("1558317374-067fb5f30001", 400) },
  { name: "SmartNest", image: img("1526170375885-4d8ecf77b99f", 400) },
  { name: "DemoBrand", image: img("1505693416388-ac5ce068fe85", 400) },
];

const productCatalog = [
  {
    title: "NordFrost No-Frost Buzdolabı 560L",
    brand: "NordFrost",
    model: "NF-560X",
    cat: 1,
    short: "Geniş hacimli, No-Frost teknolojili çift kapılı buzdolabı.",
    specs: [
      { key: "Hacim", value: "560 L" },
      { key: "Enerji Sınıfı", value: "A" },
      { key: "Renk", value: "Inox" },
    ],
    price: 42999,
    discounted: 38999,
    images: [img("1571175443880-49e1d25b2bc5"), img("1600585154340-be6161a56a0c")],
    campaign: true,
    featured: true,
    isNew: false,
    warranty: "3 Yıl",
  },
  {
    title: "AquaClean Serie 6 Çamaşır Makinesi 9 kg",
    brand: "AquaClean",
    model: "AC-W9",
    cat: 2,
    short: "9 kg kapasite, sessiz motor ve enerji tasarruflu yıkama.",
    specs: [
      { key: "Kapasite", value: "9 kg" },
      { key: "Devir", value: "1200 rpm" },
      { key: "Enerji Sınıfı", value: "A" },
    ],
    price: 24999,
    discounted: null,
    images: [img("1610557892470-55d9e80c0bce"), img("1581578731548-c64695cc6952")],
    campaign: false,
    featured: true,
    isNew: true,
    warranty: "2 Yıl",
  },
  {
    title: "CleanWave Bulaşık Makinesi 14 Kişilik",
    brand: "CleanWave",
    model: "CW-D14",
    cat: 3,
    short: "14 kişilik kapasite, hijyen programı ve sessiz çalışma.",
    specs: [
      { key: "Kapasite", value: "14 kişilik" },
      { key: "Enerji Sınıfı", value: "A" },
      { key: "Renk", value: "Beyaz" },
    ],
    price: 21999,
    discounted: 18999,
    images: [img("1556910103-1c02745aae4d")],
    campaign: true,
    featured: true,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "HeatMaster Ankastre Fırın 72L",
    brand: "HeatMaster",
    model: "HM-O72",
    cat: 5,
    short: "Sıcak hava fanlı, dokunmatik kontrol ankastre fırın.",
    specs: [
      { key: "Hacim", value: "72 L" },
      { key: "Fonksiyon", value: "8 program" },
      { key: "Renk", value: "Siyah cam" },
    ],
    price: 17999,
    discounted: null,
    images: [img("1556909114-f6e7ad7d3136"), img("1556911220-bff31c812dba")],
    campaign: false,
    featured: true,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "KitchenPro Gazlı Ankastre Ocak",
    brand: "KitchenPro",
    model: "KP-G4",
    cat: 5,
    short: "4 gözlü, döküm ızgaralı ankastre ocak.",
    specs: [
      { key: "Göz sayısı", value: "4" },
      { key: "Malzeme", value: "Inox" },
    ],
    price: 8999,
    discounted: 7499,
    images: [img("1556911220-bff31c812dba")],
    campaign: true,
    featured: false,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "BrewCraft Barista Espresso Makinesi",
    brand: "BrewCraft",
    model: "BC-E20",
    cat: 9,
    short: "Süt köpürtücülü, profesyonel espresso deneyimi.",
    specs: [
      { key: "Basınç", value: "15 bar" },
      { key: "Su haznesi", value: "1.5 L" },
    ],
    price: 12999,
    discounted: null,
    images: [img("1495474472287-4d71bcdd2085"), img("1498804103079-a6351b050096")],
    campaign: false,
    featured: true,
    isNew: true,
    warranty: "2 Yıl",
  },
  {
    title: "CleanWave Dik Süpürge Pro",
    brand: "CleanWave",
    model: "CW-V1",
    cat: 6,
    short: "Kablosuz, yüksek emiş güçlü dikey süpürge.",
    specs: [
      { key: "Şarj süresi", value: "4 saat" },
      { key: "Çalışma", value: "45 dk" },
    ],
    price: 9999,
    discounted: 8499,
    images: [img("1558317374-067fb5f30001")],
    campaign: true,
    featured: true,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "AirPure Inverter Klima 12.000 BTU",
    brand: "AirPure",
    model: "AP-12I",
    cat: 7,
    short: "A+++ enerji, sessiz uyku modu ve hızlı soğutma.",
    specs: [
      { key: "Kapasite", value: "12.000 BTU" },
      { key: "Enerji", value: "A+++" },
      { key: "Tip", value: "Inverter" },
    ],
    price: 27999,
    discounted: null,
    images: [img("1631049307264-da0ec9d70304")],
    campaign: false,
    featured: true,
    isNew: true,
    warranty: "3 Yıl",
  },
  {
    title: "TechHome Su Arıtma Cihazı 5 Aşamalı",
    brand: "TechHome",
    model: "TH-W5",
    cat: 8,
    short: "5 aşamalı filtrasyon ile temiz içme suyu.",
    specs: [
      { key: "Aşama", value: "5" },
      { key: "Kapasite", value: "75 GPD" },
    ],
    price: 6999,
    discounted: 5999,
    images: [img("1584622650111-993a426fbf0a")],
    campaign: true,
    featured: false,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "KitchenPro Mutfak Robotu 1200W",
    brand: "KitchenPro",
    model: "KP-R12",
    cat: 10,
    short: "Çok fonksiyonlu mutfak robotu, 5 aksesuar.",
    specs: [
      { key: "Güç", value: "1200 W" },
      { key: "Kase", value: "4.5 L" },
    ],
    price: 7499,
    discounted: null,
    images: [img("1574269909862-7e1d70bb8078")],
    campaign: false,
    featured: false,
    isNew: true,
    warranty: "2 Yıl",
  },
  {
    title: "NordFrost Derin Dondurucu 250L",
    brand: "NordFrost",
    model: "NF-F250",
    cat: 1,
    short: "Dikey derin dondurucu, hızlı dondurma özelliği.",
    specs: [
      { key: "Hacim", value: "250 L" },
      { key: "Enerji Sınıfı", value: "A" },
    ],
    price: 18999,
    discounted: null,
    images: [img("1600566753190-17f0baa2a6c3")],
    campaign: false,
    featured: false,
    isNew: false,
    warranty: "3 Yıl",
  },
  {
    title: "AquaClean Kurutma Makinesi 8 kg",
    brand: "AquaClean",
    model: "AC-D8",
    cat: 2,
    short: "Isı pompalı, kumaş korumalı kurutma.",
    specs: [
      { key: "Kapasite", value: "8 kg" },
      { key: "Tip", value: "Isı pompalı" },
    ],
    price: 26999,
    discounted: 23999,
    images: [img("1610557892470-55d9e80c0bce")],
    campaign: true,
    featured: false,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "HeatMaster Solo Fırın",
    brand: "HeatMaster",
    model: "HM-S60",
    cat: 4,
    short: "60 cm solo fırın, kolay temizlik iç yüzey.",
    specs: [
      { key: "Genişlik", value: "60 cm" },
      { key: "Hacim", value: "65 L" },
    ],
    price: null,
    discounted: null,
    images: [img("1504674900247-0877df9cc836")],
    campaign: false,
    featured: true,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "BrewCraft Filtre Kahve Makinesi",
    brand: "BrewCraft",
    model: "BC-F10",
    cat: 9,
    short: "Programlanabilir filtre kahve makinesi.",
    specs: [
      { key: "Kapasite", value: "1.25 L" },
      { key: "Program", value: "Timer" },
    ],
    price: 3499,
    discounted: null,
    images: [img("1498804103079-a6351b050096")],
    campaign: false,
    featured: false,
    isNew: true,
    warranty: "2 Yıl",
  },
  {
    title: "SmartNest Home Connect Buzdolabı",
    brand: "SmartNest",
    model: "SN-R420",
    cat: 14,
    short: "Uygulama ile kontrol edilebilen akıllı buzdolabı.",
    specs: [
      { key: "Hacim", value: "420 L" },
      { key: "Bağlantı", value: "Wi-Fi" },
    ],
    price: 52999,
    discounted: 47999,
    images: [img("1571175443880-49e1d25b2bc5"), img("1526170375885-4d8ecf77b99f")],
    campaign: true,
    featured: true,
    isNew: true,
    warranty: "3 Yıl",
  },
  {
    title: "TechHome Mini Fırın 45L",
    brand: "TechHome",
    model: "TH-M45",
    cat: 4,
    short: "Kompakt mini fırın, pizza ve ızgara fonksiyonu.",
    specs: [
      { key: "Hacim", value: "45 L" },
      { key: "Güç", value: "2000 W" },
    ],
    price: 4999,
    discounted: 4299,
    images: [img("1556911220-bff31c812dba")],
    campaign: true,
    featured: false,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "KitchenPro Blender Seti",
    brand: "KitchenPro",
    model: "KP-B3",
    cat: 11,
    short: "El blenderı, doğrayıcı ve çırpıcı seti.",
    specs: [
      { key: "Güç", value: "800 W" },
      { key: "Parça", value: "3'lü set" },
    ],
    price: 2499,
    discounted: null,
    images: [img("1570222094114-d054a817e56b")],
    campaign: false,
    featured: false,
    isNew: false,
    warranty: "2 Yıl",
  },
  {
    title: "DemoBrand Temizlik Bakım Seti",
    brand: "DemoBrand",
    model: "DB-C01",
    cat: 12,
    short: "Makine bakım ve temizlik ürünleri seti (demo).",
    specs: [{ key: "İçerik", value: "3 ürün" }],
    price: 899,
    discounted: null,
    images: [img("1563453392212-326f5e854473")],
    campaign: false,
    featured: false,
    isNew: false,
    warranty: undefined,
  },
  {
    title: "AirPure Salon Tipi Fan",
    brand: "AirPure",
    model: "AP-F40",
    cat: 7,
    short: "Sessiz, salınımlı salon tipi vantilatör.",
    specs: [
      { key: "Çap", value: "40 cm" },
      { key: "Hız", value: "3 kademe" },
    ],
    price: null,
    discounted: null,
    images: [img("1631049307264-da0ec9d70304")],
    campaign: false,
    featured: false,
    isNew: true,
    warranty: "2 Yıl",
  },
  {
    title: "NordFrost Side by Side Buzdolabı",
    brand: "NordFrost",
    model: "NF-SBS",
    cat: 1,
    short: "Amerikan tipi side by side, buz/su dispenser.",
    specs: [
      { key: "Hacim", value: "610 L" },
      { key: "Dispenser", value: "Var" },
      { key: "Renk", value: "Inox" },
    ],
    price: 68999,
    discounted: 62999,
    images: [img("1600585154340-be6161a56a0c"), img("1571175443880-49e1d25b2bc5")],
    campaign: true,
    featured: true,
    isNew: true,
    warranty: "3 Yıl",
  },
];

const bannerImages = [
  img("1556911220-bff31c812dba", 1800),
  img("1600585154340-be6161a56a0c", 1800),
  img("1495474472287-4d71bcdd2085", 1800),
];

const campaignImages = [
  img("1556909114-f6e7ad7d3136", 1600),
  img("1610557892470-55d9e80c0bce", 1600),
  img("1571175443880-49e1d25b2bc5", 1600),
  img("1558317374-067fb5f30001", 1600),
  img("1495474472287-4d71bcdd2085", 1600),
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI tanımlı değil. .env.local dosyasını oluşturun.");
  }

  await connectDB();

  console.log("Mevcut demo veriler temizleniyor...");
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Campaign.deleteMany({}),
    Banner.deleteMany({}),
  ]);

  await SiteSettings.findOneAndUpdate(
    {},
    {
      companyName: COMPANY_FULL_NAME,
      shortName: "TURANÇETİN",
      phone: "+90 555 000 00 00",
      whatsapp: "905550000000",
      email: "info@turancetin.com.tr",
      address: "Örnek Mah. Demo Cad. No:1, Türkiye",
      footerDescription:
        "Beyaz eşya ve elektrikli küçük ev aletlerinde güvenilir çözüm ortağınız. Geniş ürün yelpazesi, uzman danışmanlık.",
      aboutContent: `${COMPANY_FULL_NAME} olarak beyaz eşya ve elektrikli küçük ev aletleri perakende ticaretinde müşterilerimize kaliteli ürün, şeffaf bilgilendirme ve güvenilir satış sonrası destek sunuyoruz.`,
      seoDefaultTitle: "TURANÇETİN | Beyaz Eşya ve Küçük Ev Aletleri",
      seoDefaultDescription:
        "Buzdolabı, çamaşır makinesi, fırın, klima ve küçük ev aletlerinde geniş katalog. Güncel kampanyalar ve WhatsApp ile hızlı bilgi.",
    },
    { upsert: true, new: true }
  );

  const adminEmail = process.env.ADMIN_EMAIL || "admin@turancetin.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "Site Yöneticisi",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: "admin",
    });
    console.log(`Admin oluşturuldu: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin zaten var: ${adminEmail}`);
  }

  const categories = await Category.insertMany(
    categoryData.map((c, index) => ({
      name: c.name,
      description: c.description,
      slug: slugify(c.name),
      isActive: true,
      sortOrder: index + 1,
      image: { url: c.image, publicId: `demo/category-${index}` },
    }))
  );

  const brands = await Brand.insertMany(
    brandData.map((b, index) => ({
      name: b.name,
      description: `${b.name} — demo marka koleksiyonu.`,
      slug: slugify(b.name),
      isActive: true,
      sortOrder: index + 1,
      logo: { url: b.image, publicId: `demo/brand-${index}` },
    }))
  );

  const brandByName = Object.fromEntries(brands.map((b) => [b.name, b]));

  const products = await Product.insertMany(
    productCatalog.map((p, i) => {
      const brand = brandByName[p.brand] || brands[0];
      const category = categories[Math.min(p.cat, categories.length - 1)];
      return {
        title: p.title,
        brand: p.brand,
        brandRef: brand._id,
        model: p.model,
        category: category._id,
        shortDescription: p.short,
        description: `${p.short}\n\nBu bir demo üründür. Güncel fiyat, stok ve teslimat bilgisi için WhatsApp veya telefon ile iletişime geçebilirsiniz.\n\nTURANÇETİN olarak size en uygun ürünü birlikte seçelim.`,
        warranty: p.warranty,
        specifications: p.specs,
        price: p.price ?? undefined,
        discountedPrice: p.discounted ?? undefined,
        images: p.images.map((url, idx) => ({
          url,
          publicId: `demo/product-${i}-${idx}`,
          isPrimary: idx === 0,
        })),
        isCampaign: p.campaign,
        isFeatured: p.featured,
        isNew: p.isNew,
        isActive: true,
        slug: slugify(p.title),
      };
    })
  );

  const campaignTitles = [
    {
      title: "Bahar Mutfak Kampanyası",
      description: "Ankastre ve pişirme grubunda seçili ürünlerde avantajlı fırsatlar.",
    },
    {
      title: "Çamaşır Günleri",
      description: "Yıkama ve kurutma makinelerinde sezon fırsatları.",
    },
    {
      title: "Soğutma Festivali",
      description: "Buzdolabı ve derin dondurucularda özel seçimler.",
    },
    {
      title: "Temizlik Zamanı",
      description: "Süpürge ve bulaşık makinelerinde kampanyalı ürünler.",
    },
    {
      title: "Kahve Keyfi",
      description: "Espresso ve filtre kahve makinelerinde fırsatlar.",
    },
  ];

  await Campaign.insertMany(
    campaignTitles.map((c, i) => ({
      title: c.title,
      description: c.description,
      slug: slugify(c.title),
      banner: {
        url: campaignImages[i],
        publicId: `demo/campaign-${i}`,
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + (40 - i * 5) * 24 * 60 * 60 * 1000),
      products: products.slice(i * 2, i * 2 + 4).map((p) => p._id),
      isActive: true,
    }))
  );

  await Banner.insertMany([
    {
      title: "Evinizin Konforu İçin Doğru Seçim",
      description: "Beyaz eşya ve küçük ev aletlerinde geniş ürün yelpazesi.",
      image: { url: bannerImages[0], publicId: "demo/banner-1" },
      buttonText: "Ürünleri İncele",
      buttonLink: "/urunler",
      sortOrder: 1,
      isActive: true,
    },
    {
      title: "Kampanyalı Ürünleri Keşfedin",
      description: "Seçili ürünlerde avantajlı fırsatlar sizi bekliyor.",
      image: { url: bannerImages[1], publicId: "demo/banner-2" },
      buttonText: "Kampanyalı Ürünler",
      buttonLink: "/urunler?campaign=1",
      sortOrder: 2,
      isActive: true,
    },
    {
      title: "Mutfakta Yeni Nesil Deneyim",
      description: "Kahve makinelerinden ankastreye kadar her şey.",
      image: { url: bannerImages[2], publicId: "demo/banner-3" },
      buttonText: "Keşfet",
      buttonLink: "/urunler",
      sortOrder: 3,
      isActive: true,
    },
  ]);

  console.log("Seed tamamlandı (görselli):");
  console.log(`- ${categories.length} kategori`);
  console.log(`- ${brands.length} marka`);
  console.log(`- ${products.length} ürün`);
  console.log("- 5 kampanya");
  console.log("- 3 banner");
  console.log(`Admin: ${adminEmail}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
