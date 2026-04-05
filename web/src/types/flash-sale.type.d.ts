interface IFlashSaleItemResponse {
  id: string;
  variantId: string;
  salePrice: number;
  quantity: number;
  sold: number;
  product?: IProductListItemResponse;
}

interface IFlashSaleResponse {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: "UPCOMING" | "ACTIVE" | "ENDED" | "CANCELLED";
  maxPerUser?: number;
  items: IFlashSaleItemResponse[];
  createdAt: string;
}

interface IFlashSaleFilterQueries extends IPaginationQueries {
  search?: string;
  sort?: string;
}
