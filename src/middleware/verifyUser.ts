import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

async function verifyUser(req: Request, res: Response, next: NextFunction) {
  const { accessToken } = req.cookies;
  const accessKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;

  if (!accessToken) {
    return res.status(401).json({
      success: "Error",
      message: "Faça o login para continuar.",
    });
  }

  const user = await verifyJWT(accessToken, accessKey);

  if (!user) {
    return res.status(403).json({
      success: "Error",
      message: "Token expirado.",
    });
  }

  // @ts-ignore
  req.user = user;
  return next();
}

export default verifyUser;
