import { _isoDateTime } from "better-auth/*";
import { NextFunction, Request, Response } from "express";

export const NotFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    message: "Not Found",
    time: Date,
    path: req.originalUrl,
    data: Date(),
  });
};
