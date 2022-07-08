import { Request, Response, NextFunction } from "express";

function errorHandling(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.sendStatus(500);
}

export default errorHandling;
