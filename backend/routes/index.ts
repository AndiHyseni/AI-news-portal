import { Application, Router } from "express";

// controllers
import { AccountController } from "../controllers/Account.controller";
import { CategoryController } from "../controllers/Category.controller";
import { NewsController } from "../controllers/News.controller";
import { RapportController } from "../controllers/Raport.controller";
import { NewsConfigController } from "../controllers/NewsConfig.controller";
import RoleController from "../controllers/Role.controller";

const endpoints: [string, Router][] = [
  ["/api/Account", AccountController],
  ["/api/Category", CategoryController],
  ["/api/News", NewsController],
  ["/api/rapport", RapportController],
  ["/api/NewsConfig", NewsConfigController],
  ["/api/roles", RoleController],
];

export const routes = (app: Application): void => {
  [...endpoints].forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};
