export interface ICategoryResponse {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  thumbnailUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  children: ICategoryResponse[];
}
