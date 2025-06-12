import { useMutation } from "@tanstack/react-query";
import { verifyNews } from "../../api/news/news";
import { queryClient } from "../../App";
import { toast } from "react-toastify";

export const useVerifyNews = () => {
  return useMutation((newsId: string) => verifyNews(newsId), {
    onSuccess: (response) => {
      if (response.statusIsOk) {
        toast.success("News article verified successfully!");
        // Invalidate news queries to refresh the data
        queryClient.invalidateQueries(["news"]);
        queryClient.invalidateQueries(["newsById"]);
      } else {
        toast.error(response.statusMessage || "Failed to verify news article");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.statusMessage || "Failed to verify news article"
      );
    },
  });
};
