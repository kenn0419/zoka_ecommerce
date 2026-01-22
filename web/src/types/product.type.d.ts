interface IProductListItemResponse {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  avgRating: number;
  minPrice: number;
  maxPrice: number;
  hasStock: boolean;
  status?: string;
}

interface IProductDetailResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  avgRating: number;
  minPrice: number;
  maxPrice: number;
  hasStock: boolean;
  variants: IProductVariantResponse[];
  category: ICategoryResponse;
  shop: IShopResponse;
}

interface IProductFilterQueries extends IPaginationQueries {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

interface IProductCreationRequest {
  name: string;
  categoryId: string;
  description?: string;
  shopId: string;
  thumbnail: File | null;
  variantFiles: File[] | null;
  variants: IProductVariantCreaionRequest[];
}

interface IProductVariantCreaionRequest {
  id?: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
}
