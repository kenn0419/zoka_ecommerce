import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";

export const useActiveCategoriesQuery = (
  params: IPaginationQueries,
  options?: any
) => {
  return useQuery<IPaginatedResponse<ICategoryResponse>>({
    queryKey: ["categories", "active", params],
    queryFn: () => categoryService.getActiveCategories(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useAdminCategoriesQuery = (
  params: IPaginationQueries,
  options?: any
) => {
  return useQuery<IPaginatedResponse<ICategoryResponse>>({
    queryKey: ["categories", "admin", params],
    queryFn: () => categoryService.getAdminCategories(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useCategoryCreationQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICategoryCreationRequest) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategoryUpdateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: ICategoryUpdateRequest }) =>
      categoryService.updateCategory(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategoryActivateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => categoryService.activateCategory(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategoryDeactivateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => categoryService.deactivateCategory(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCategoryDeleteQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => categoryService.deleteCategory(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
