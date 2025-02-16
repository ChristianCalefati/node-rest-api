import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export function defaultErrorHandler(
  err: HttpError,
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

  response.status(err.status).json({
    status: err.status,
    message: err.message,
  });
}

/**
 * Interface representing an http error.
 * 
 * @interface HttpError
 * @property {number} status - The HTTP status code of the error.
 * @property {string} message - A descriptive message providing details about the error.
 */
export interface HttpError {
  status: number;
  message: string;
  error?: any;
}
