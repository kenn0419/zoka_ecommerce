interface ICartSumary {
  totalQuantity: number;
  totalItems: number;
  subtotal: number;
}

interface ICartItemResponse {
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

interface ICartResponse {
  id: string;
  userId: string;
  items: ICartItemResponse[];
  summary: ICartSumary;
}

interface IAddCartRequest {
  variantId: string;
  quantity: number;
}
