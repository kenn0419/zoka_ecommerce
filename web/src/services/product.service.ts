import { productApi } from "../apis/product.api";

export const productService = {
  async fetchActiveProducts(
    params: IProductFilterRequest
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchActiveProducts({ ...params });

    return res.data;
  },

  async fetchActiveProductsByCategory(
    categorySlug: string,
    params: IProductFilterRequest
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByCategory({
      categorySlug,
      ...params,
    });

    return res.data;
  },

  async fetchProductDetailBySlug(
    productSlug: string
  ): Promise<IProductDetailResponse> {
    const res = await productApi.fetchProductDetailBySlug(productSlug);
    return res.data;
  },

  async fetchProductDetailById(
    productId: string
  ): Promise<IProductDetailResponse> {
    const res = await productApi.fetchProductDetailById(productId);
    return res.data;
  },

  async fetchRelatedProducts(
    categorySlug: string
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByCategory({
      categorySlug,
      page: 1,
      limit: 6,
    });

    return res.data;
  },

  async suggestProducts(
    search: string
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchSuggestProducts(search);
    return res.data;
  },

  async fetchProductsByShop(
    shopId: string,
    params: IProductFilterRequest
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByShop({
      shopId,
      ...params,
    });

    return res.data;
  },

  async createProduct(
    data: IProductCreationRequest
  ): Promise<IProductListItemResponse> {
    const formData = new FormData();

    const payload = {
      name: data.name,
      categoryId: data.categoryId,
      shopId: data.shopId,
      description: data.description ?? "",
      variants: data.variants.map((item) => ({
        name: item.name,
        stock: item.stock,
        price: item.price,
        images: item.images,
      })),
    };

    formData.append("data", JSON.stringify(payload));

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    if (data.variantFiles) {
      data.variantFiles.forEach((file) => {
        formData.append("variantImages", file);
      });
    }

    const res = await productApi.createProduct(formData);

    return res.data;
  },
};
