import { useMutation } from "@tanstack/react-query";
import { verifyNews } from "../../api/news/news";
import { queryClient } from "../../App";
import { toast } from "react-toastify";

export const useVerifyNews = () => {
  return useMutation((newsId: string) => verifyNews(newsId), {
    onSuccess: (response, newsId) => {
      if (response.statusIsOk) {
        toast.success("Verification completed!");
        // Invalidate the exact details query key used by `useNewsId`
        queryClient.invalidateQueries(["useNews", newsId]);
        // Also refresh list pages if needed
        queryClient.invalidateQueries(["news"]);
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
