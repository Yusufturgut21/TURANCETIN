import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı zorunludur."),
  description: z.string().optional(),
  image: z
    .object({
      url: z.string(),
      publicId: z.string(),
    })
    .optional()
    .nullable(),
  slug: z.string().optional(),
  parent: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const brandSchema = z.object({
  name: z.string().min(1, "Marka adı zorunludur."),
  description: z.string().optional(),
  logo: z
    .object({
      url: z.string(),
      publicId: z.string(),
    })
    .optional()
    .nullable(),
  slug: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const productSchema = z
  .object({
    title: z.string().min(1, "Ürün başlığı zorunludur."),
    brand: z.string().optional(),
    brandRef: z.string().optional().nullable(),
    model: z.string().optional(),
    category: z.string().min(1, "Kategori zorunludur."),
    subCategory: z.string().optional().nullable(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    warranty: z.string().optional(),
    specifications: z
      .array(
        z.object({
          key: z.string().min(1),
          value: z.string().min(1),
        })
      )
      .optional(),
    price: z.number().min(0).optional().nullable(),
    discountedPrice: z.number().min(0).optional().nullable(),
    images: z
      .array(
        z.object({
          url: z.string().min(1),
          publicId: z.string().min(1),
          isPrimary: z.boolean().optional(),
        })
      )
      .min(1, "En az bir ürün görseli gereklidir."),
    isCampaign: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isNew: z.boolean().optional(),
    isActive: z.boolean().optional(),
    slug: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountedPrice != null &&
      (data.price == null || data.discountedPrice >= data.price)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "İndirimli fiyat, normal fiyattan düşük olmalıdır. Normal fiyat girilmeden indirimli fiyat eklenemez.",
        path: ["discountedPrice"],
      });
    }
  });

export const campaignSchema = z.object({
  title: z.string().min(1, "Kampanya başlığı zorunludur."),
  description: z.string().optional(),
  banner: z
    .object({
      url: z.string(),
      publicId: z.string(),
    })
    .optional()
    .nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  products: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  slug: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(1, "Banner başlığı zorunludur."),
  description: z.string().optional(),
  image: z.object({
    url: z.string().min(1),
    publicId: z.string().min(1),
  }),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Ad soyad zorunludur."),
  phone: z.string().optional(),
  email: z.string().email("Geçerli e-posta girin.").optional().or(z.literal("")),
  message: z.string().min(5, "Mesaj en az 5 karakter olmalıdır."),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır."),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });
