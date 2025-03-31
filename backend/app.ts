import { Model } from "objection";
import Knex from "knex";
import express, { Application } from "express";

import { AppErrorHandlerMiddleware } from "./middlewares/AppErrorHandler.middleware";
import { CorsMiddleware } from "./middlewares/Cors.middleware";
import knexConfig from "./knexfile";

// Routes
import { routes } from "./routes";
import { MEMORY_LIMIT } from "./config/env";

// Creates knex instance
export const knex = Knex(knexConfig);

import * as expressStatusMonitor from "express-status-monitor";

const statusMonitor = expressStatusMonitor.default({
  title: "Express Status",
  path: "/api/status",
  spans: [
    {
      interval: 1, // Every second
      retention: 60, // Keep 60 data-points in memory
    },
    {
      interval: 5,
      retention: 60,
    },
    {
      interval: 15,
      retention: 60,
    },
  ],
  chartVisibility: {
    mem: true,
    rps: true,
    cpu: true,
    load: true,
    statusCodes: true,
    responseTime: true,
  },
  healthChecks: [
    {
      protocol: "http",
      host: "localhost",
      path: "/health",
      port: "5000",
    },
  ],
});

Model.knex(knex);

// Boot express
const app: Application = express();

app.use(statusMonitor);

knex
  .raw("SELECT 1+1")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.log("Database not connected");
    console.error(e);
  });

// CORS
app.use(CorsMiddleware);

// Express configuration
app.use(express.json({ limit: `${MEMORY_LIMIT}mb` }));
app.use(
  express.urlencoded({
    extended: true,
    limit: `${MEMORY_LIMIT}mb`,
    parameterLimit: Number(`${MEMORY_LIMIT}000`),
  })
);

// Application routing
routes(app);

// Application (global) error handling
app.use(AppErrorHandlerMiddleware);

export { app };
