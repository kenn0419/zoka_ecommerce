import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import {
  type IProductCreationRequest,
  type IProductDetailResponse,
  type IProductFilterRequest,
  type IProductListItemResponse,
} from "../types/product.type";
import type {
  IPaginatedResponse,
  IPaginationQueries,
} from "../types/pagination.type";

export const useSuggestProductsQuery = (search: string) => {
  return useQuery({
    queryKey: ["products", "suggest", search],
    queryFn: () => productService.suggestProducts(search),
    enabled: search.length > 2,
    staleTime: 5 * 1000,
  });
};

export const useActiveProductsQuery = (
  params: IProductFilterRequest,
  options?: any
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
  params: IProductFilterRequest,
  options?: any
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
  params: IPaginationQueries
) => {
  return useQuery<IPaginatedResponse<IProductListItemResponse>>({
    queryKey: ["products", "shop", shopId],
    queryFn: () => productService.fetchProductsByShop(shopId, params),
  });
};

export const useProductCreationMutation = () => {
  return useMutation({
    mutationFn: (data: IProductCreationRequest) =>
      productService.createProduct(data),
  });
};
