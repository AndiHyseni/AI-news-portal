import { useQuery } from "@tanstack/react-query";
import { getNewsId } from "../../api/news/news";

export const useNewsId = (newsId: number) => {
  return useQuery(["useNews", newsId], () => getNewsId(newsId));
};
