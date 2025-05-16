import {
  CONFIGURATION,
  EDITUSER,
  RAPPORT,
  REACTION,
  USERS,
  VIEWS,
} from "../../enums/administration/administration";
import { BaseUrl } from "../../enums/baseUrl";
import { NEWS } from "../../enums/news/url";
import {
  AddAdmin,
  AddReaction,
  AddViewModel,
  Configuration,
  EditAdmin,
  Rapport,
  Reaction,
  ReactionsDetails,
  Users,
  Views,
  ViewsDetails,
} from "../../types/administration/administration";
import { axiosInstance } from "../config";

export const getRapport = async (): Promise<Rapport> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${RAPPORT.RAPPORT}`
  );
  return data;
};

export const getUsers = async (): Promise<Users[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/Account/${USERS.GET_USERS}`
  );
  return data;
};

export const deleteUsers = async (userId: string): Promise<void> => {
  const { data } = await axiosInstance.delete(
    `${BaseUrl.DEVELOPMENT}/${USERS.GET_ACCOUNT}/${userId}`
  );
  return data;
};

export const getViews = async (): Promise<Views[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${VIEWS.VIEWS}`
  );
  return data;
};

export const getViewsDetails = async (
  newsId: string
): Promise<ViewsDetails[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${VIEWS.GET_WATCHED}/${newsId}`
  );
  return data;
};

export const getReactions = async (): Promise<Reaction[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${REACTION.GET_REACTIONS}`
  );
  return data;
};

export const getreactionsDetails = async (
  newsId: number
): Promise<ReactionsDetails[]> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${REACTION.GET_REACTIONS_DETAILS}/${newsId}`
  );
  return data;
};

export const addUser = async (payload: AddAdmin): Promise<number> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/Account/addAdmin`,
    payload
  );
  return data;
};

export const editUser = async (payload: EditAdmin): Promise<string> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/Account/${EDITUSER.EDIT_USER}`,
    payload
  );
  return data;
};

export const addReaction = async (payload: AddReaction): Promise<number> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWS}/${REACTION.GET_ADD_REACTION}`,
    payload
  );
  return data;
};

export const addViews = async (payload: AddViewModel): Promise<void> => {
  const { data } = await axiosInstance.post(
    `${BaseUrl.DEVELOPMENT}/News/addView`,
    payload
  );

  return data;
};

export const getNewsConfig = async (): Promise<Configuration> => {
  const { data } = await axiosInstance.get(
    `${BaseUrl.DEVELOPMENT}/${CONFIGURATION.NEWS_CONFIG}`
  );
  return data;
};
