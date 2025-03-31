import { useQuery } from "@tanstack/react-query";
import { getNews } from "../../api/news/news";

export const useNews = () => {
  return useQuery(["useNews"], () => getNews());
};
