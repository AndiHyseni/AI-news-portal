export interface NewsAPISource {
  id: string | null;
  name: string;
}

export interface NewsAPIArticle {
  source: NewsAPISource;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export interface ImportNewsAPIPayload {
  query?: string;
  category?: string | null;
  category_id: string;
}
