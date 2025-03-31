import { useQuery } from "@tanstack/react-query";
import { savedNewsPage } from "../../api/news/news";

export const useSavedNewsPage = (userId: string) => {
  return useQuery(["useSavedNewsPage", userId], () => savedNewsPage(userId));
};
