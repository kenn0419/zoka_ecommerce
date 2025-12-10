import instance from "./axios-customize";

export const productApi = {
  list: async () => {
    const response = await instance.get("/product");
    if (response.status === 200) {
      return response.data;
    }
  },
};
