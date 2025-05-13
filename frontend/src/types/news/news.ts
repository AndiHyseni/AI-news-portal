import { Categories } from "../categories/categories";

export interface News {
  id: string;
  user_id: string;
  category_id: string;
  content: string;
  expire_date: string;
  image: string;
  is_deleted: boolean;
  is_featured: boolean;
  subtitle: string;
  tags: string;
  title: string;
  video: string;
  number_of_clicks: number;
  created_at: string;
  updated_at: string;
  category: Categories;
}

export interface CreateNewsPayload {
  category_id: string;
  content: string;
  expire_date: string;
  image: string;
  is_deleted?: Boolean;
  is_featured?: Boolean;
  subtitle: string;
  tags?: string;
  title: string;
  video?: string;
}

export interface SavedNewsPayload {
  news_id: string;
  user_id: string;
}

export interface SavedNewsPage {
  news_id: string;
  user_id: string;
  category_id: string;
  title: string;
  image: string;
  content: string;
  expireDate: string;
  is_deleted: Boolean;
  is_featured: Boolean;
  subTitle: string;
  tags: string;
  video: string;
}
