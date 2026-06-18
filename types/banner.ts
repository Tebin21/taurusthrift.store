export type BannerPosition = "HERO" | "SECONDARY" | "PROMOTIONAL";

export type Banner = {
  id: string;
  imageUrl?: string | null;
  imageUrls: string[];
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};
