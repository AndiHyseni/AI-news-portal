import { BaseUrl } from "../../enums/baseUrl";
import { CREATE_NEWS, NEWS, SAVED_NEWS, TAGS } from "../../enums/news/url";
import {
  CreateNewsPayload,
  News,
  SavedNewsPage,
  SavedNewsPayload,
  DeleteSavedNewsPayload,
} from "../../types/news/news";
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

export const createNews = async (
  payload: CreateNewsPayload
): Promise<number> => {
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
