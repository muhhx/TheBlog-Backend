import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";
import { createJWT } from "../utils/jwt";

export async function loginSessionHandler(req: Request, res: Response) {
    const { email, password } = req.body

    //1. User Authentication
    if(!email || !password) {
        return res.status(400).json({ status: "Error", message: "Preencha todos os campos." })
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if(!user) {
        return res.status(401).json({ status: "Error", message: "Email ou senha inválido." })
    }
    if(!await bcrypt.compare(String(password), user.password)) {
        return res.status(401).json({ status: "Error", message: "Email ou senha inválido." })
    }

    //Verifies if user already confirmed their email
    if(!user.isEmailVerified) {
        return res.status(401).json({ success: "Error", message: "Verifique seu email para continuar. Clique aqui para enviar o email novamente." })
    };

    //2. Create JWT
    const accessToken = createJWT({ userId: user._id, userUsername: user.username, userName: user.name, isEmailVerified: user.isEmailVerified }, "1h")

    res.cookie("accessToken", accessToken, {
        maxAge: 3.6e+6,
        httpOnly: true,
    });

    return res.status(200).json({ status: "Ok", message: "Usuário logado com sucesso." })
};

export function logoutSessionHandler(req: Request, res: Response) {
    res.cookie("accessToken", "", {
        maxAge: 0,
        httpOnly: true,
    });

    res.status(200).json({ status: "Ok", message: "Logout feito com sucesso." })
};

export function verifySessionHandler(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user

    res.status(200).json({ status: "Ok", message: "O usuário está com um Token válido.", data: user  })
};
