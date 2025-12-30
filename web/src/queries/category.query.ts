import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";
import type { IPaginatedResponse } from "../types/pagination.type";
import type { ICategoryResponse } from "../types/category.type";

export const useActiveCategoriesQuery = (
  page = 1,
  limit = 20,
  search?: string,
  sort?: string
) => {
  return useQuery<IPaginatedResponse<ICategoryResponse>>({
    queryKey: ["categories", "active", page, limit, search, sort],
    queryFn: () =>
      categoryService.getActiveCategories({ page, limit, search, sort }),
    staleTime: 1000 * 60 * 5,
  });
};
