export interface ICartSumary {
  totalQuantity: number;
  totalItems: number;
  subtotal: number;
}

export interface ICartItemResponse {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  imageUrl: string;
  priceSnapshot: number;
  quantity: number;
  stockSnapshot: number;
  subtotal: number;
  isAvailable: boolean;
}

export interface ICartResponse {
  id: string;
  userId: string;
  items: ICartItemResponse[];
  summary: ICartSumary;
}

export interface IAddCartRequest {
  variantId: string;
  quantity: number;
}
