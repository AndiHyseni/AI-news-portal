import { BaseUrl } from "../../enums/baseUrl";
import { axiosInstance } from "../config";

interface ChatbotMessage {
  message: string;
}

interface ChatbotResponse {
  response: string;
}

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
