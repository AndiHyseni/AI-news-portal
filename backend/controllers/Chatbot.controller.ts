import { NextFunction, Request, Response, Router } from "express";
import { ChatbotService } from "../services/chatbot/Chatbot.service";

export const ChatbotController: Router = Router();

// POST process a chatbot message
ChatbotController.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = req.body;
      const result = await ChatbotService.processMessage(message);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);
