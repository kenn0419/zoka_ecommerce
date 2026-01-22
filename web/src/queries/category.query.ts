import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
