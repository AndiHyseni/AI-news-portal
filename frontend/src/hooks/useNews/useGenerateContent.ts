import { useMutation } from "@tanstack/react-query";
import { generateContentFromTitle } from "../../api/news/news";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

interface GenerateContentPayload {
  title: string;
  categoryId?: string;
}

interface GenerateContentResponse {
  content: string;
  subtitle?: string;
  summary?: string;
}

export const useGenerateContent = () => {
  return useMutation(
    (payload: GenerateContentPayload) =>
      generateContentFromTitle(payload.title, payload.categoryId),
    {
      onMutate: () => {
        const randomId = generateRandomString(20);
        startNotification(randomId);
        return { randomId };
      },
      onSuccess: (data, variables, context) => {
        const randomId = context?.randomId || generateRandomString(20);
        endNotification(randomId, "Content generated successfully!", true);
      },
      onError: (error: any, variables, context) => {
        const randomId = context?.randomId || generateRandomString(20);
        const errorMessage =
          error?.response?.data?.error || "Failed to generate content";
        endNotification(randomId, errorMessage, false);
      },
    }
  );
};
