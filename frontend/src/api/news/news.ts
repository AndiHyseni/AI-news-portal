import { BaseUrl } from "../../enums/baseUrl";
import {
  CREATE_NEWS,
  GENERATE_SUMMARIES,
  GENERATE_TAGS,
  NEWS,
  NEWS_API,
  SAVED_NEWS,
  TAGS,
} from "../../enums/news/url";
import {
  CreateNewsPayload,
  News,
  SavedNewsPage,
  SavedNewsPayload,
  DeleteSavedNewsPayload,
} from "../../types/news/news";
import {
  ImportNewsAPIPayload,
  NewsAPIResponse,
} from "../../types/news/newsapi";
import { axiosInstance } from "../config";

export const getNews = async () => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}`
  );
  return data;
};

export const getNewsId = async (newsId: string): Promise<News> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWSID}/${newsId}`
  );
  return data;
};

export const createNews = async (payload: CreateNewsPayload) => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${CREATE_NEWS.CREATE_NEWS}`,
    payload
  );
  return data;
};

export const deleteNews = async (newsId: string): Promise<void> => {
  const { data } = await axiosInstance.delete(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWSID}/${newsId}`
  );
  return data;
};

export const generateSummaries = async (): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${GENERATE_SUMMARIES.GENERATE}`
  );
  return data;
};

// NewsAPI functions
export const searchNewsAPI = async (
  query: string
): Promise<NewsAPIResponse> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS_API.SEARCH}`,
    {
      params: { query },
    }
  );
  return data;
};

export const getTopHeadlines = async (
  category?: string,
  country: string = "us"
): Promise<NewsAPIResponse> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS_API.TOP_HEADLINES}`,
    {
      params: { category, country },
    }
  );
  return data;
};

export const importNewsFromAPI = async (
  payload: ImportNewsAPIPayload
): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS_API.IMPORT}`,
    payload
  );
  return data;
};

export const generateSummariesWithNewsAPI = async (): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS_API.GENERATE_SUMMARIES}`
  );
  return data;
};

export const savedNews = async (payload: SavedNewsPayload): Promise<number> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${SAVED_NEWS.SAVED_NEWS}`,
    payload
  );
  return data;
};

export const savedNewsPage = async (
  userId: string
): Promise<SavedNewsPage[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${SAVED_NEWS.GET_SAVED}/${userId}`
  );
  return data;
};

export const deleteSavedNews = async (
  payload: DeleteSavedNewsPayload | string
): Promise<void> => {
  // If payload is a string (old method), wrap it in an object
  const data = typeof payload === "string" ? { news_id: payload } : payload;

  const response = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${SAVED_NEWS.DELETE_SAVED}`,
    data
  );
  return response.data;
};

export const getNewsByTags = async (tags: string): Promise<News[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${TAGS.TAGS}/${tags}`
  );

  if (data && data.news && Array.isArray(data.news)) {
    return data.news;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

// Get related news for a specific article
export const getRelatedNews = async (
  newsId: string,
  limit: number = 4
): Promise<News[]> => {
  try {
    const { data } = await axiosInstance.get(
      `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${newsId}/related`,
      {
        params: { limit },
      }
    );

    if (data && data.relatedNews && Array.isArray(data.relatedNews)) {
      return data.relatedNews;
    }

    return [];
  } catch (error) {
    console.error("Error fetching related news:", error);
    return [];
  }
};

// NLP functions
export const generateSummariesWithNLP = async (): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${GENERATE_SUMMARIES.GENERATE}`
  );
  return data;
};

export const generateTagsWithNLP = async (): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${GENERATE_TAGS.GENERATE}`
  );
  return data;
};

// NLP functions for individual articles
export const generateSummaryForArticle = async (
  newsId: string
): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/generate-summary/${newsId}`
  );
  return data;
};

export const generateTagsForArticle = async (newsId: string): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/generate-tags/${newsId}`
  );
  return data;
};

// Verify news article
export const verifyNews = async (newsId: string): Promise<any> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/verify/${newsId}`
  );
  return data;
};
