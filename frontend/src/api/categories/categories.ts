import { BaseUrl } from "../../enums/baseUrl";
import { CATEGORIES } from "../../enums/categories/url";
import { Categories } from "../../types/categories/categories";
import { axiosInstance } from "../config";

export const getCategories = async (): Promise<Categories[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${CATEGORIES.GET_CATEGORY}`
  );
  return data;
};

export const createCategories = async (
  payload: Categories
): Promise<number> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${CATEGORIES.GET_CATEGORY}`,
    payload
  );
  return data;
};

export const deleteCategories = async (categoryId: number): Promise<void> => {
  const { data } = await axiosInstance.delete(
    `${BaseUrl.DEVELOPMENT}/${CATEGORIES.GET_CATEGORY}/${categoryId}`
  );
  return data;
};
