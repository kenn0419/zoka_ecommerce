interface IUserResponse {
  id: string;
  email: string;
  fullName: string;
  slug: string;
  phone: string;
  address: string;
  avatarUrl: string;
  status: string;
  roles?: IRoleResponse[];
}

interface IUserCreationRequest {
  email: string;
  fullName: string;
  password: string;
  slug: string;
  phone: string;
  address: string;
  avatar?: File;
}

interface IUserUpdateRequest extends Partial<IUserCreationRequest> {
  id: string;
}

type IUserSort = "OLDEST" | "NEWEST" | "NAME_ASC" | "NAME_DESC";
