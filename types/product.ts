export type ProductVariant = {
  id: string;
  productId: string;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  sku?: string | null;
  stock: number;
  price?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  name: string;
  nameKu?: string | null;
  nameAr?: string | null;
  slug: string;
  description?: string | null;
  descriptionKu?: string | null;
  descriptionAr?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  images: string[];
  thumbnailUrl?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  tags: string[];
  material?: string | null;
  brand?: string | null;
  condition?: string | null;
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariant[];
  categories?: {
    id: string;
    name: string;
    nameKu?: string | null;
    nameAr?: string | null;
    slug: string;
    imageUrl?: string | null;
  }[];
};

export type Category = {
  id: string;
  name: string;
  nameKu?: string | null;
  nameAr?: string | null;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
};

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  variantInfo?: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  stock: number;
};
