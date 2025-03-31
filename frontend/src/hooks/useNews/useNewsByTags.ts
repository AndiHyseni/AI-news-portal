import { useQuery } from "@tanstack/react-query";
import { getNewsByTags } from "../../api/news/news";

export const useNewsByTags = (tags: string) => {
  return useQuery(["useNewsByTags", tags], () => getNewsByTags(tags));
};
