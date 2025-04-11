import { NextFunction, Request, Response, Router } from "express";
import { CategoriesService } from "../services/categories/Categories.service";
import authorize from "../utils/authorize";
import { ValidationMiddleware } from "../middlewares/Validation.middleware";
import { CategoryValidator } from "../validations/Category.validator";

export const CategoryController: Router = Router();

CategoryController.get(
  "/",
  authorize(),
  ValidationMiddleware(CategoryValidator, {}, (req: Request) => req.query),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CategoriesService.getAllCategories();

      res.send(result.data).status(result.httpCode);
    } catch (err) {
      next(err);
    }
  }
);

CategoryController.get(
  "/getCategoriesOnline",
  authorize(),
  ValidationMiddleware(CategoryValidator, {}, (req: Request) => req.query),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CategoriesService.getAllCategoriesOnline();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

CategoryController.get(
  "/:id",
  authorize(),
  ValidationMiddleware(CategoryValidator, {}, (req: Request) => req.query),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CategoriesService.getCategoryById(id);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

CategoryController.post(
  "/",
  authorize(),
  ValidationMiddleware(CategoryValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const result = await CategoriesService.addCategory(name);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

CategoryController.delete(
  "/:id",
  authorize(),
  ValidationMiddleware(CategoryValidator, {}, (req: Request) => req.query),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CategoriesService.deleteCategory(id);

      res.send(result.data).status(result.httpCode);
    } catch (err) {
      next(err);
    }
  }
);
