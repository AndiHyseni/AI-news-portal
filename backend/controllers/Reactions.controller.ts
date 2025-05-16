import { Router, Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news/News.service";
import authorize from "../utils/authorize";

export const ReactionsController: Router = Router();

// Get all views
ReactionsController.get(
  "/",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsService.getAllReactions();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);
