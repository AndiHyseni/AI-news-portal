import { NextFunction, Request, Response, Router } from "express";
import { NewsConfigService } from "../services/newsConfig/NewsConfig.service";
import authorize from "../utils/authorize";
import { ValidationMiddleware } from "../middlewares/Validation.middleware";
import { NewsConfigValidator } from "../validations";

export const NewsConfigController: Router = Router();

NewsConfigController.get(
  "/",
  // authorize(),
  // ValidationMiddleware(NewsConfigValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsConfigService.getConfigRow();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// POST: Edit the news configuration
NewsConfigController.post(
  "/",
  authorize(),
  ValidationMiddleware(NewsConfigValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await NewsConfigService.editConfigRow(req.body);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);
