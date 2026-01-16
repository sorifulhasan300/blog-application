import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = "something was wrong";
  let code = 404;
  const errorDetails = err;
  if (err instanceof Prisma.PrismaClientInitializationError) {
    code = 400;
    message = "filed missing ";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    code = 402;
    message = "soriful error";
  }

  res.status(code);
  res.send({ message: message, details: errorDetails });
};
