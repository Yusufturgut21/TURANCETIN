export type ImageAsset = {
  url: string;
  publicId?: string;
  isPrimary?: boolean;
};

export type CategoryDTO = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: ImageAsset | null;
  isActive?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type BrandDTO = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: ImageAsset | null;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type ProductDTO = {
  _id: string;
  title: string;
  brand?: string;
  model?: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  warranty?: string;
  specifications?: { key: string; value: string }[];
  price?: number | null;
  discountedPrice?: number | null;
  images: ImageAsset[];
  isCampaign?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  category?: CategoryDTO | string;
  subCategory?: CategoryDTO | string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BannerDTO = {
  _id: string;
  title: string;
  description?: string;
  image: ImageAsset;
  buttonText?: string;
  buttonLink?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type CampaignDTO = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  banner?: ImageAsset | null;
  startDate?: string;
  endDate?: string;
  products?: ProductDTO[];
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type ProductsResult = {
  items: ProductDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
