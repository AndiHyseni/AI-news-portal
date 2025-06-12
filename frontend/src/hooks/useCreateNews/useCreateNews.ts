import { useMutation } from "@tanstack/react-query";
import { createNews } from "../../api/news/news";
import { queryClient } from "../../App";
import { CreateNewsPayload } from "../../types/news/news";

export const useCreateNews = () => {
  return useMutation((payload: CreateNewsPayload) => createNews(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
    },
  });
};
