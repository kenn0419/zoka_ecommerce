import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import {
  type IProductDetailResponse,
  type IProductListItemResponse,
} from "../types/product.type";
import type {
  IPaginatedResponse,
  IPaginationQueries,
} from "../types/pagination.type";

export const useSuggestProductsQuery = (keyword: string) => {
  return useQuery({
    queryKey: ["suggest-products", keyword],
    queryFn: () => productService.suggestProducts(keyword),
    enabled: keyword.length > 2,
    staleTime: 5 * 1000,
  });
};

export const useActiveProductsQuery = (
  params: IPaginationQueries,
  options?: any
) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["products", "active", params],
    queryFn: () => productService.fetchActiveProducts(params),
    ...options,
  });
};

export const useProductDetailQuery = (slug?: string) => {
  return useQuery<IProductDetailResponse>({
    queryKey: ["product", slug],
    queryFn: () => productService.fetchProductDetail(slug!),
    enabled: !!slug,
  });
};

export const useRelatedProductsQuery = (categorySlug: string) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["related-products", categorySlug],
    queryFn: () => productService.fetchRelatedProducts(categorySlug),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductsByCategoryQuery = (
  categorySlug: string,
  params: IPaginationQueries,
  options: any
) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["products", "category", categorySlug],
    queryFn: () => productService.fetchProductsByCategory(categorySlug, params),
    ...options,
  });
};
