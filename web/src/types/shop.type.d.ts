export interface IShopResponse {
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
