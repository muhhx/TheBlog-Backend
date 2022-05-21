import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import config from "config";
import UserModel from "../models/user.model";
import { findUserWithoutPassword } from "../db";

export async function registerUserHandler(req: Request, res: Response){
    const { name, email, emailConfirmation, password, passwordConfirmation } = req.body;

    //1. Data validation
    if (!name || !email || !emailConfirmation || !password || !passwordConfirmation) {
        return res.status(400).json({ status: "Error", message: "Preencha todos os campos."});
    }
    if (password.length < 6) {
        return res.status(400).json({ status: "Error", message: "A senha precisa ter no mínimo 6 caracteres."});
    }
    if (name.length > 30) {
        return res.status(400).json({ status: "Error", message: "O nome é muito longo."});
    }
    if (email !== emailConfirmation) {
        return res.status(400).json({ status: "Error", message: "Os emails não são iguais."});
    }
    if (password !== passwordConfirmation) {
        return res.status(400).json({ status: "Error", message: "As senhas não são iguais."});
    }

    //2. Encrypt password
    const salt = config.get<number>('bcryptSalt');
    const encryptedPassword = await bcrypt.hash(String(password), salt);

    //3. Generate random username based on the Name provided
    const usernameHash = crypto.randomBytes(10);
    const username = usernameHash.toString('hex');

    //3. Save to the database
    try {
        const createdUser = await UserModel.create({
            name,
            username,
            email,
            password: encryptedPassword
        });
        return res.status(201).json({ status: "Ok", data: "Usuário criado com sucesso." })
    } catch (error) {
        return res.status(400).json({ status: "Error", message: "Não foi possível criar sua conta, verifique se o email ou username ja não está sendo usado ou tente novamente mais tarde.", error })
    }
};

export async function getUserHandler(req: Request, res: Response) {
    const { username } = req.params;

    const user = await findUserWithoutPassword("username", username);
    
    if(!user) {
        return res.status(404).json({ status: "Error", message: "Usuário não existe ou não pode ser encontrado." });
    }

    return res.status(200).json({ status: "Ok", data: user });
};

export async function deleteUserHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { password } = req.body;

    if(!password) {
        return res.status(400).json({ status: "Error", message: "Informe sua senha." });
    }

    const user = await UserModel.findById(userId).select('+password');

    if(!user) {
        return res.status(404).json({ status: "Error", message: "Não foi possível deletar o usuário." });
    };

    try {
        if(!await bcrypt.compare(String(password), user.password)) {
            return res.status(401).json({ status: "Error", message: "Senha inválida." });
        };

        const response = await UserModel.findByIdAndDelete(userId);

        if(!response) {
            return res.status(400).json({ status: "Error", message: "Não foi possível deletar o usuário." });
        }
        
        res.cookie("accessToken", "", {
            maxAge: 0,
            httpOnly: true,
        });
        
        res.status(200).json({ status: "Ok", message: "Usuário foi deletado.", reload: true });
    } catch (error) {
        return res.status(400).json({ status: "Error", message: "Não foi possível deletar o usuário." });
    }
};

export async function updateUserHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { name, username, bio } = req.body;

    // Validação
    // Update (Criar objeto e update todos os itens do usuário)
    // Refresh Token pro usuário ver os updates

    //Verificar username
    // if(!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/.test(username)) {
    //     return res.status(400).json({ status: "Error", message: "O username não é valido, confira as regras."});
    // }
    res.json({ message: "Rota em manutenção." })
};
