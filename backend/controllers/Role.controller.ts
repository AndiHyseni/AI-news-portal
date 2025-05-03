import { Router, Request, Response, NextFunction } from "express";
import { RoleService } from "../services/role/Role.service";
import authorize from "../utils/authorize";

const RoleController = Router();

// Get all roles
RoleController.get(
  "/",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await RoleService.getAllRoles();
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Get role by ID
RoleController.get(
  "/:id",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await RoleService.getRoleById(id);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Create a new role
RoleController.post(
  "/",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      const result = await RoleService.createRole({ name, description });
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Update a role
RoleController.put(
  "/:id",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const result = await RoleService.updateRole(id, { name, description });
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a role
RoleController.delete(
  "/:id",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await RoleService.deleteRole(id);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Assign a role to a user
RoleController.post(
  "/assign",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, roleId } = req.body;
      const result = await RoleService.assignRoleToUser(userId, roleId);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Remove a role from a user
RoleController.post(
  "/remove",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, roleId } = req.body;
      const result = await RoleService.removeRoleFromUser(userId, roleId);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

// Get user roles
RoleController.get(
  "/user/:userId",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await RoleService.getUserRoles(userId);
      res.status(result.httpCode).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);

export default RoleController;
