import { userApi } from "../apis/user.api";

export const userService = {
  async fetchAllUsers(
    params: IPaginationQueries
  ): Promise<IPaginatedResponse<IUserResponse>> {
    const res = await userApi.fetchAllUsers({ ...params });
    return res.data;
  },

  async createUser(
    data: IUserCreationRequest
  ): Promise<IPaginatedResponse<IUserResponse>> {
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    const res = await userApi.createUser(formData);

    return res.data;
  },

  async activeUser(id: string): Promise<IApiResponse<IUserResponse>> {
    const res = await userApi.activeUser(id);

    return res.data;
  },

  async deActiveUser(id: string): Promise<IApiResponse<IUserResponse>> {
    const res = await userApi.deActiveUser(id);

    return res.data;
  },

  async updateUser(
    data: IUserUpdateRequest
  ): Promise<IApiResponse<IUserResponse>> {
    const res = await userApi.updateUser(data);

    return res.data;
  },

  async deleteUser(id: string) {
    await userApi.deleteUser(id);
  },
};
