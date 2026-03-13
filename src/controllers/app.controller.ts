import type { Request, Response } from "express";
import CWISplitAPIReply from "../api/index";
import { ApiStatus, HttpCodes } from "../constants/api.constants";
import { appHealthService, pingService } from "../services/app.services";

export function pingController(request: Request, response: Response): Response {
  const reply = new CWISplitAPIReply();

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiDetails = { message: pingService() };
  reply.apiReqId = "req-id";

  return response.status(HttpCodes.OK).json(reply);
}

export function appHealthController(
  request: Request,
  response: Response,
): Response {
  const reply = new CWISplitAPIReply();

  reply.apiStatus = ApiStatus.SUCCESS;
  reply.apiDetails = { message: "App is healthy", data: appHealthService() };
  reply.apiReqId = "req-id";

  return response.status(HttpCodes.OK).json(reply);
}
