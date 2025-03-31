export interface News {
  userId: string;
  categoryId: number;
  content: string;
  expireDate: string;
  image: string;
  isDeleted: boolean;
  isFeatured: boolean;
  newsId: number;
  subTitle: string;
  tags: string;
  title: string;
  video: string;
  numberOfClicks: number;
}

export interface CreateNewsPayload {
  categoryId: number;
  content: string;
  expireDate: string;
  image: string;
  isDeleted: Boolean;
  isFeatured: Boolean;
  newsId: number;
  subTitle: string;
  tags: string;
  title: string;
  video: string;
}

export interface SavedNewsPayload {
  newsId: number;
  userId: string;
}

export interface SavedNewsPage {
  newsId: number;
  userId: string;
  categoryId: number;
  title: string;
  image: string;
  content: string;
  expireDate: string;
  isDeleted: Boolean;
  isFeatured: Boolean;
  subTitle: string;
  tags: string;
  video: string;
}
