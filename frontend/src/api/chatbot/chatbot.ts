import { BaseUrl } from "../../enums/baseUrl";
import { axiosInstance } from "../config";

interface ChatbotMessage {
  message: string;
}

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

interface NewsResponse {
  type: "news";
  message: string;
  articles: Article[];
}

interface TextResponse {
  type: "text";
  message: string;
}

type ChatbotResponse = {
  response: NewsResponse | TextResponse;
};

export const sendChatbotMessage = async (
  message: string
): Promise<ChatbotResponse> => {
  try {
    const { data } = await axiosInstance.post(
      `${BaseUrl.DEVELOPMENT}/chatbot`,
      { message }
    );
    return data;
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    throw error;
  }
};
