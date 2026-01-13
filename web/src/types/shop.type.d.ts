interface IShopResponse {
  id: string;
  onwer: IUserResponse;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IShopRegisterRequest {
  name: string;
  description: string;
  logo?: File;
}
