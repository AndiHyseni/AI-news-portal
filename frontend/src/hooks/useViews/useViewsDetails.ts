import { useQuery } from "@tanstack/react-query";
import { getViewsDetails } from "../../api/administration/administration";

export const useViewsDetails = (newsId: string) => {
  return useQuery(["useViewsDetails", newsId], () => getViewsDetails(newsId));
};
