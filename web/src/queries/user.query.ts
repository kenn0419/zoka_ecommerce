import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { userService } from "../services/user.service";

export const useAllUsersQuery = (params: IPaginationQueries, options?: any) => {
  return useQuery<IPaginatedResponse<IUserResponse>>({
    queryKey: ["users", params],
    queryFn: () => userService.fetchAllUsers(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useUserCreationQuery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useUserUpdateQuery = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export function useUserDeleteQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUserActiveQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.activeUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUserDeActiveQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.deActiveUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
