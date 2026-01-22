interface IShopResponse {
  id?: string;
  owner?: IUserResponse;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  status?: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface IShopRegisterRequest {
  name: string;
  description: string;
  logo?: File;
}

interface IShopChangeStatusRequest {
  id: string;
  status: IShopStatus;
}

type IShopStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
