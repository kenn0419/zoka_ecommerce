import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";

export const useSuggestProductsQuery = (search: string) => {
  return useQuery({
    queryKey: ["products", "suggest", search],
    queryFn: () => productService.suggestProducts(search),
    enabled: search.length > 2,
    staleTime: 5 * 1000,
  });
};

export const useActiveProductsQuery = (
  params: IProductFilterQueries,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["products", "active", params],
    queryFn: () => productService.fetchActiveProducts(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useProductDetailBySlugQuery = (slug?: string) => {
  return useQuery<IProductDetailResponse>({
    queryKey: ["product", "detail", slug],
    queryFn: () => productService.fetchProductDetailBySlug(slug!),
    enabled: !!slug,
  });
};

export const useProductDetailByIdQuery = (id?: string) => {
  return useQuery<IProductDetailResponse>({
    queryKey: ["product", "detail", id],
    queryFn: () => productService.fetchProductDetailById(id!),
    enabled: !!id,
  });
};

export const useRelatedProductsQuery = (categorySlug: string) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["products", "related", categorySlug],
    queryFn: () => productService.fetchRelatedProducts(categorySlug),
    placeholderData: keepPreviousData,
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveProductsByCategoryQuery = (
  categorySlug: string,
  params: IProductFilterQueries,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["products", "active", "category", categorySlug],
    queryFn: () =>
      productService.fetchActiveProductsByCategory(categorySlug, params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useProductsByShop = (
  shopId: string,
  params: IPaginationQueries,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["products", "shop", shopId],
    queryFn: () => productService.fetchProductsByShop(shopId, params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useActiveShopProducts = (
  shopSlug: string,
  params: IPaginationQueries,
  options?: any,
) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["active", "products", "shop", shopSlug],
    queryFn: () => productService.fetchActiveShopProducts(shopSlug, params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useProductCreationMutation = () => {
  return useMutation({
    mutationFn: (data: IProductCreationRequest) =>
      productService.createProduct(data),
  });
};
