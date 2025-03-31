import { BaseUrl } from "../../enums/baseUrl";
import { CREATE_NEWS, NEWS, SAVED_NEWS, TAGS } from "../../enums/news/url";
import {
  CreateNewsPayload,
  News,
  SavedNewsPage,
  SavedNewsPayload,
} from "../../types/news/news";
import { axiosInstance } from "../config";

export const getNews = async (): Promise<News[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}`
  );
  return data;
};

export const getNewsId = async (newsId: number): Promise<News> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWSID}/${newsId}`
  );
  return data;
};

export const createNews = async (
  payload: CreateNewsPayload
): Promise<number> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${CREATE_NEWS.CREATE_NEWS}`,
    payload
  );
  return data;
};

export const deleteNews = async (newsId: number): Promise<void> => {
  const { data } = await axiosInstance.delete(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWSID}/${newsId}`
  );
  return data;
};

export const savedNews = async (payload: SavedNewsPayload): Promise<number> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${SAVED_NEWS.SAVED_NEWS}`,
    payload
  );
  return data;
};

export const savedNewsPage = async (
  userId: string
): Promise<SavedNewsPage[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${SAVED_NEWS.GET_SAVED}/${userId.split(",")[0]}`
  );
  return data;
};

export const deleteSavedNews = async (newsId: number): Promise<void> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${SAVED_NEWS.DELETE_SAVED}`,
    newsId
  );
  return data;
};

export const getNewsByTags = async (tags: string): Promise<News[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${TAGS.TAGS}/${tags}`
  );
  return data;
};
