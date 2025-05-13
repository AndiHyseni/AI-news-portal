import { Router, Request, Response, NextFunction } from "express";
import { NewsService } from "../services/news/News.service";
import authorize from "../utils/authorize";

export const ViewsController: Router = Router();

// Get all views
ViewsController.get(
  "/",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsService.getViews();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);
