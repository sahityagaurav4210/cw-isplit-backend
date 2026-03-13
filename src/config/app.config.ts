import express from "express";
import { appGlobalErrHandlerMiddleware } from "../middlewares/app.middleware";
import router from "../routes/index";

const app = express();

app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: true, limit: "5kb" }));
app.set("trust proxy", true);

app.use("/api/v1", router);

app.use(appGlobalErrHandlerMiddleware);

export default app;
