import { NextFunction, Request, Response, Router } from "express";
import { ValidationMiddleware } from "../middlewares/Validation.middleware";
import authorize from "../utils/authorize";
import { getUserFields } from "../utils/authValidation";

// Validators for various endpoints (assume these exist)
import { AccountValidator } from "../validations";

import { AccountService } from "../services/account/Account.service";

const router: Router = Router();

// Register new user
router.post(
  "/register",
  ValidationMiddleware(AccountValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await AccountService.register(data);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Login
router.post(
  "/login",
  ValidationMiddleware(AccountValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await AccountService.login(data);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Refresh token
router.post(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenRequest = req.body; // expect { token, refreshToken }
      const result = await AccountService.refreshToken(tokenRequest);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Add admin user (admin-only endpoint)
router.post(
  "/addAdmin",
  authorize(),
  ValidationMiddleware(AccountValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await AccountService.addAdmin(data);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Get current user info
router.get(
  "/getCurrentUser",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization || "";
      const userData = getUserFields(token);
      const result = await AccountService.getCurrentUser(userData?.id || "");
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Logout (client may handle token removal; optionally, remove refresh token)
router.post(
  "/logout",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization || "";
      const result = await AccountService.logout(token);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Get all users (admin only)
router.get(
  "/getUsers",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AccountService.getUsers();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a user (admin only)
router.delete(
  "/:id",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await AccountService.deleteUser(id);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Forgot password
router.post(
  "/forgot-password",
  ValidationMiddleware(AccountValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await AccountService.forgotPassword(email);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Edit user (admin only)
router.post(
  "/editUser",
  authorize(),
  ValidationMiddleware(AccountValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await AccountService.editUser(data);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Reset password
router.post(
  "/reset-password",
  ValidationMiddleware(AccountValidator, {}, (req: Request) => req.body),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body; // expects { email, token, password }
      const result = await AccountService.resetPassword(data);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

export const AccountController: Router = router;
