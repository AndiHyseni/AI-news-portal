import { NextFunction, Request, Response, Router } from "express";
import { NewsService } from "../services/news/News.service";
import authorize from "../utils/authorize";
import { ValidationMiddleware } from "../middlewares/Validation.middleware";
import { NewsValidator } from "../validations/News.validator";

export const NewsController: Router = Router();

// GET all news
NewsController.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsService.getAllNews();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// GET news by id
NewsController.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await NewsService.getNewsById(id);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// POST add or edit news (Admin only)
NewsController.post(
  "/addnews",
  authorize(),
  ValidationMiddleware(NewsValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = req.body;
      const result = await NewsService.addOrEditNews(news);
      // Here we assume that a successful operation returns a valid HTTP code and payload
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// DELETE news (Admin only)
NewsController.delete(
  "/:id",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await NewsService.deleteNews(id);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// POST add view count (no role restrictions)
NewsController.post(
  "/addView",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newsId, userId, FingerPrintId } = req.body;
      const result = await NewsService.addView(newsId, userId, FingerPrintId);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// POST add saved news (no role restrictions)
NewsController.post(
  "/addSavedNews",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { NewsId, UserId } = req.body;
      const result = await NewsService.addSaved(NewsId, UserId);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET watched news (Admin only)
NewsController.get(
  "/getwatched/:id",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await NewsService.getWatchedNews(id);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET all views (Admin only)
NewsController.get(
  "/getViews",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsService.getViews();
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET saved news for a user (Authenticated users)
NewsController.get(
  "/getSaved/:userId",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await NewsService.getSavedNews(userId);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// POST delete saved news (Authenticated users)
NewsController.post(
  "/deleteSaved",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { NewsId, UserId } = req.body;
      const result = await NewsService.deleteSaved(NewsId, UserId);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// POST add reaction (Authenticated users)
NewsController.post(
  "/addReaction",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reaction = req.body;
      const result = await NewsService.addReaction(reaction);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET reactions for a news by id
NewsController.get(
  "/getreactions/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await NewsService.getReactionsByNews(id);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET all reactions (for view models)
NewsController.get(
  "/reaction",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsService.getAllReactions();
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET news by tag
NewsController.get(
  "/tags/:tag",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tag } = req.params;
      const result = await NewsService.getByTag(tag);
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);

// GET most viewed news
NewsController.get(
  "/mostviewed",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsService.getMostViewed();
      if (result.httpCode === 200) {
        res.status(result.httpCode).send(result.data);
      } else {
        res.status(result.httpCode).send("Something went wrong");
      }
    } catch (err) {
      next(err);
    }
  }
);
