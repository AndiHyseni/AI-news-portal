import { useQuery } from "@tanstack/react-query";
import { getNewsId } from "../../api/news/news";

export const useNewsId = (newsId: string) => {
  return useQuery(["useNews", newsId], () => getNewsId(newsId));
};
