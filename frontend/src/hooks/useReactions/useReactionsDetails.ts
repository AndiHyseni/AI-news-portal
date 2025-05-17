import { useQuery } from "@tanstack/react-query";
import { getReactionsDetails } from "../../api/administration/administration";

export const useReactionsDetails = (newsId: string) => {
  return useQuery(["useReactionsDetails", newsId], () =>
    getReactionsDetails(newsId)
  );
};
