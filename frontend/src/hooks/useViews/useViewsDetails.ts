import { useQuery } from "@tanstack/react-query";
import { getViewsDetails } from "../../api/administration/administration";

export const useViewsDetails = (newsId: number) => {
  return useQuery(["useViewsDetails", newsId], () => getViewsDetails(newsId));
};
