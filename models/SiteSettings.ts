import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";
import { COMPANY_FULL_NAME } from "@/lib/utils";

const WhyUsItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema(
  {
    companyName: { type: String, default: COMPANY_FULL_NAME },
    shortName: { type: String, default: "TURANÇETİN" },
    logo: {
      url: String,
      publicId: String,
    },
    logoSize: { type: Number, default: 140 },
    favicon: {
      url: String,
      publicId: String,
    },
    phone: { type: String, default: "+90 555 000 00 00" },
    whatsapp: { type: String, default: "905550000000" },
    email: { type: String, default: "info@turancetin.com.tr" },
    address: {
      type: String,
      default: "Türkiye",
    },
    googleMapsUrl: { type: String, default: "" },
    googleMapsEmbed: { type: String, default: "" },
    workingHours: {
      weekdays: { type: String, default: "Pazartesi - Cumartesi: 09:00 - 19:00" },
      saturday: { type: String, default: "Cumartesi: 09:00 - 18:00" },
      sunday: { type: String, default: "Pazar: Kapalı" },
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String,
      twitter: String,
    },
    footerDescription: {
      type: String,
      default:
        "Beyaz eşya ve elektrikli küçük ev aletlerinde güvenilir çözüm ortağınız.",
    },
    aboutTitle: { type: String, default: "Hakkımızda" },
    aboutContent: {
      type: String,
      default:
        "TURANÇETİN DAYANIKLI TÜKETİM MALLARI OTOMOTİV İNŞAAT TEKSTİL GIDA İTHALAT İHRACAT SAN. TİC. LTD. ŞTİ. olarak beyaz eşya ve elektrikli küçük ev aletleri perakende ticaretinde müşterilerimize kaliteli ürün ve güvenilir hizmet sunuyoruz.",
    },
    whyUsTitle: { type: String, default: "Neden Biz?" },
    whyUsItems: {
      type: [WhyUsItemSchema],
      default: [
        {
          title: "Güvenilir Hizmet",
          description: "Şeffaf bilgilendirme ve dürüst satış yaklaşımı.",
          icon: "shield",
        },
        {
          title: "Kaliteli Ürünler",
          description: "Seçkin markalardan güvenilir ürün yelpazesi.",
          icon: "award",
        },
        {
          title: "Geniş Ürün Seçeneği",
          description: "Beyaz eşyadan küçük ev aletlerine geniş katalog.",
          icon: "layers",
        },
        {
          title: "Müşteri Memnuniyeti",
          description: "İhtiyaçlarınıza uygun ürün önerileri.",
          icon: "heart",
        },
        {
          title: "Satış Sonrası Destek",
          description: "Satın alma sonrası iletişim ve yönlendirme.",
          icon: "headphones",
        },
      ],
    },
    seoDefaultTitle: {
      type: String,
      default: "TURANÇETİN | Beyaz Eşya ve Küçük Ev Aletleri",
    },
    seoDefaultDescription: {
      type: String,
      default:
        "Beyaz eşya ve elektrikli küçük ev aletlerinde kaliteli ürünler, güncel kampanyalar ve güvenilir danışmanlık.",
    },
  },
  { timestamps: true }
);

export type ISiteSettings = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
