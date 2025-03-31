import { useQuery } from "@tanstack/react-query";
import { getreactionsDetails } from "../../api/administration/administration";

export const useReactionsDetails = (newsId: number) => {
  return useQuery(["useReactionsDetails", newsId], () =>
    getreactionsDetails(newsId)
  );
};
