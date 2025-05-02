import { NextFunction, Request, Response, Router } from "express";
import { RaportValidator } from "../validations/Raport.validator";
import authorize from "../utils/authorize";
import { ValidationMiddleware } from "../middlewares/Validation.middleware";
import { RapportService } from "../services/raport/Rapport.service";

export const RapportController: Router = Router();

// GET dashboard view model
RapportController.get(
  "/",
  // authorize(),
  // ValidationMiddleware(RaportValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await RapportService.getDashboardViewModel();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// POST first raport view model
RapportController.post(
  "/",
  authorize(),
  ValidationMiddleware(RaportValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reportParams = req.body;
      const result = await RapportService.getFirstRaportViewModel(reportParams);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);
