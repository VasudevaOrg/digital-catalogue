// src/types/index.ts - Updated Product interface with Discount support

// Discount interfaces
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

// Product Variant interface
export interface ProductVariant {
  _id?: string;
  sku: string;
  weight: number;
  weightUnit:
    | "kg"
    | "grams"
    | "ltr"
    | "ml"
    | "box"
    | "bags"
    | "pieces"
    | "other";
  customUnit?: string;
  price: number;
  stock: number;
  costPrice?: number;
  isActive: boolean;
  lowStockThreshold?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  weightUnit:
    | "kg"
    | "grams"
    | "ltr"
    | "ml"
    | "box"
    | "bags"
    | "pieces"
    | "other";
  category: string;
  images: string[];
  stock: number;
  isEligibleForFreeDelivery: boolean;
  isRecommended: boolean;
  tags: string[];
  discount?: ProductDiscount; // NEW: Discount field
  hasVariants?: boolean; // NEW: Indicates if product has variants
  variants?: ProductVariant[]; // NEW: Product variants array
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant; // NEW: Selected variant if product has variants
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalWeight: number;
  isEligibleForFreeDelivery: boolean;
}

export interface Customer {
  id: string;
  phoneNumber: string;
  name?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Updated Order interface with new status options
export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  totalWeight: number;
  deliveryType: "delivery" | "pickup";
  paymentMethod: "prepaid" | "cash_on_pickup";
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus:
    | "confirmed" // Order is confirmed and being processed
    | "delivered" // Order has been delivered/completed
    | "cancelled"; // Order was cancelled
  deliveryAddress?: Address;
  deliveryFee: number;
  invoiceNumber: string;
  originalInvoice?: string; // For returns/modifications
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  returned: boolean;
  returnedQuantity: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  totalAmount: number;
  totalWeight: number;
  customerType: "online" | "walkin";
  isModified: boolean;
  originalInvoiceId?: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface DeliveryZone {
  pincode: string;
  radiusKm: number;
  isActive: boolean;
}

export interface WhatsAppMessage {
  id: string;
  customerId: string;
  orderId?: string;
  messageType:
    | "order_enquiry"
    | "order_confirmation"
    | "status_update"
    | "delivery_update"
    | "promotional";
  content: string;
  status: "sent" | "delivered" | "read" | "failed";
  sentAt: string;
}

export interface SMSMessage {
  id: string;
  customerId: string;
  messageType: "otp" | "order_update" | "promotional";
  content: string;
  status: "sent" | "delivered" | "failed";
  sentAt: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  product: Product;
  threshold: number;
  currentStock: number;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
}

export interface ProductFilters {
  category: string;
  priceRange: [number, number];
  searchQuery: string;
  sortBy: "name" | "price" | "newest" | "recommended";
  sortOrder: "asc" | "desc";
  tags?: string[];
  isRecommended?: boolean;
}

export interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  isVisible: boolean;
  autoHide: boolean;
  duration: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OTPVerification {
  phoneNumber: string;
  otp: string;
  expiresAt: string;
  verified: boolean;
}

export interface CheckoutData {
  deliveryType: "delivery" | "pickup";
  paymentMethod: "prepaid" | "cash_on_pickup";
  deliveryAddress?: Address;
  customerNotes?: string;
}

// New interfaces for product tags and recommendations
export interface ProductTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Weight unit utility type
export type WeightUnit =
  | "kg"
  | "grams"
  | "ltr"
  | "ml"
  | "box"
  | "bags"
  | "pieces"
  | "other";

// Weight unit display names
export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: "Kilogram (kg)",
  grams: "Grams (g)",
  ltr: "Litre (L)",
  ml: "Millilitre (ml)",
  box: "Box",
  bags: "Bags",
  pieces: "Pieces",
  other: "Other",
};

// Common product tags
export const COMMON_TAGS = [
  "recommended",
  "best-selling",
  "fresh",
  "organic",
  "local",
  "premium",
  "seasonal",
  "new-arrival",
  "discounted",
  "limited-offer",
];
