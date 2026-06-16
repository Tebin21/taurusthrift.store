export type DiscountType = "PERCENTAGE" | "FIXED";

export type Coupon = {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minimumOrder?: number | null;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CouponValidationResult = {
  valid: boolean;
  coupon?: Pick<
    Coupon,
    | "id"
    | "code"
    | "discountType"
    | "discountValue"
    | "minimumOrder"
    | "maximumDiscount"
  >;
  error?: string;
};
