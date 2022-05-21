import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

async function verifyUser(req: Request, res: Response, next: NextFunction) {
    const { accessToken } = req.cookies;

    if(!accessToken) {
        return res.status(403).json({ success: "Error", message: "Faça o login para continuar.", reload: true })
    };

    const user = await verifyJWT(accessToken);

    if(!user) {
        return res.status(403).json({ success: "Error", message: "Acesso negado." })
    };

    // @ts-ignore
    if(!user.isEmailVerified) {
        return res.status(401).json({ success: "Error", message: "Verifique seu email para continuar." })
    };

    // @ts-ignore
    req.user = user;
    return next();
};

export default verifyUser;
