import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export function defaultErrorHandler(
  err,
  request: Request,
  response: Response,
  next: NextFunction
) {
  logger.error("Default Error Handler triggered; Reason - ", err);

  if (response.headersSent) {
    logger.error(
      "Response headers already sent, cannot send error response. Delegate to Express default error handler."
    );
    return next(err);
  }

  response.status(500).json({
    status: "error",
    message: "Default Error handling triggered, check logs.",
  });
}
