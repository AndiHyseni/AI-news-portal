import { Application, Router } from "express";

// controllers
import { AccountController } from "../controllers/Account.controller";
import { CategoryController } from "../controllers/Category.controller";
import { NewsController } from "../controllers/News.controller";
import { RapportController } from "../controllers/Raport.controller";
import { NewsConfigController } from "../controllers/NewsConfig.controller";
import RoleController from "../controllers/Role.controller";
import { ViewsController } from "../controllers/Views.controller";
import { ReactionsController } from "../controllers/Reactions.controller";
import { NewsAPIController } from "../controllers/NewsAPI.controller";
import { ChatbotController } from "../controllers/Chatbot.controller";

const endpoints: [string, Router][] = [
  ["/api/Account", AccountController],
  ["/api/Category", CategoryController],
  ["/api/News", NewsController],
  ["/api/rapport", RapportController],
  ["/api/NewsConfig", NewsConfigController],
  ["/api/roles", RoleController],
  ["/api/views", ViewsController],
  ["/api/reaction", ReactionsController],
  ["/api/newsapi", NewsAPIController],
  ["/api/chatbot", ChatbotController],
];

export const routes = (app: Application): void => {
  [...endpoints].forEach((route) => {
    const [url, controller] = route;
    app.use(url, controller);
  });
};
