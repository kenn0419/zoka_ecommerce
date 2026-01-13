import instance from "./axios-customize";

export const userApi = {
  fetchAllUsers: async ({
    page = 1,
    limit = 12,
    search,
    sort = "oldest",
  }: IPaginationQueries): Promise<
    IApiResponse<IPaginatedResponse<IUserResponse>>
  > => {
    return await instance.get(`/users`, {
      params: { page, limit, search, sort },
    });
  },

  createUser: async (data: FormData) => {
    return await instance.post("/users", data);
  },

  updateUser: async (data: IUserUpdateRequest) => {
    return await instance.post(`/users/${data.id}`, data);
  },

  activeUser: async (id: string) => {
    return await instance.patch(`/users/${id}/active`);
  },

  deActiveUser: async (id: string) => {
    return await instance.patch(`/users/${id}/deactive`);
  },

  deleteUser: async (id: string) => {
    await instance.delete(`/users/${id}`);
  },
};
