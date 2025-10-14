export interface QuantityDiscount {
  minQuantity: number;
  maxQuantity: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  label?: string;
}

export interface SimpleDiscount {
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export interface ProductDiscount {
  isActive: boolean;
  type: "simple" | "quantity-based" | "both";
  simpleDiscount?: SimpleDiscount;
  quantityDiscounts?: QuantityDiscount[];
  startDate?: Date | string;
  endDate?: Date | string;
  maxDiscountAmount?: number;
}
