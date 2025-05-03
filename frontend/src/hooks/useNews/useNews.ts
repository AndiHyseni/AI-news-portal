import { useQuery } from "@tanstack/react-query";
import { getNews } from "../../api/news/news";
import { News } from "../../types/news/news";

type NewsResponse = News[] | { news: News[] };

export const useNews = () => {
  return useQuery<NewsResponse>(["useNews"], () => getNews(), {
    refetchOnWindowFocus: false,
  });
};
