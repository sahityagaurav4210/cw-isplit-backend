import { Router } from "express";
import appRouter from "./app.routes";

const router = Router();

router.use("/app", appRouter);

export default router;
