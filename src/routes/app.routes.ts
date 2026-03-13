import { Router } from "express";
import {
  appHealthController,
  pingController,
} from "../controllers/app.controller";

const appRouter = Router();

appRouter.get("/ping", pingController);
appRouter.get("/health", appHealthController);

export default appRouter;
