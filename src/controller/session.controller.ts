import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";

// Login
    // Autenticar usuário (verificar email e senha)
    // Criar sessão no banco de dados
    // Criar accessToken com payload dos dados do usuario + id da sessão // Criar refreshToken
    // Mardar cookies com access e refresh tokens
// Logout
    // Deletar ou invalidar sessão do banco de dados
    // Mandar cookie, tirando o access token e o refresh token (pra ter o cookie de acesso, precisa fazer login novamente)
// Get current session

export async function loginSessionHandler(req: Request, res: Response) {
    const { email, password } = req.body

    //1. User Authentication
    if(!email || !password) {
        return res.status(400).json({ status: "Error", message: "Preencha todos os campos."})
    }

    const user = await UserModel.findOne({ email });

    if(!user) {
        return res.status(404).json({ status: "Error", message: "Usuário ou senha inválido."})
    }
    if(!await bcrypt.compare(String(password), user.password)) {
        return res.status(404).json({ status: "Error", message: "Usuário ou senha inválido."})
    }

    return res.status(200).json({ status: "Ok", data: user })
};