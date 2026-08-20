export interface ISpecification {
  key: string;
  value: string;
}

export interface IProductImage {
  url: string;
  publicId: string;
  isPrimary?: boolean;
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface IWorkingHours {
  weekdays?: string;
  saturday?: string;
  sunday?: string;
}

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "newest";

export interface ProductFilters {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  campaign?: boolean;
  isNew?: boolean;
  featured?: boolean;
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}
