export type BannerPosition = "HERO" | "SECONDARY" | "PROMOTIONAL";

export type Banner = {
  id: string;
  title: string;
  titleKu?: string | null;
  titleAr?: string | null;
  subtitle?: string | null;
  subtitleKu?: string | null;
  subtitleAr?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  linkText?: string | null;
  linkTextKu?: string | null;
  linkTextAr?: string | null;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
