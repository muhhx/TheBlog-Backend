import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import UserModel from "../models/user.model";

export async function registerUserHandler(req: Request, res: Response){
    const { name, email, emailConfirmation, password, passwordConfirmation } = req.body;

    //1. Data validation
    if (!name || !email || !emailConfirmation || !password || !passwordConfirmation) {
        return res.status(400).json({ status: "Error", error: "Preencha todos os campos."});
    }
    if (password.length < 6) {
        return res.status(400).json({ status: "Error", error: "A senha precisa ter no mínimo 6 caracteres."});
    }
    if (email !== emailConfirmation) {
        return res.status(400).json({ status: "Error", error: "Os emails não são iguais."});
    }
    if (password !== passwordConfirmation) {
        return res.status(400).json({ status: "Error", error: "As senhas não são iguais."});
    }

    //2. Encrypt password
    const salt = config.get<number>('bcryptSalt');
    const encryptedPassword = await bcrypt.hash(String(password), salt);

    //3. Save to the database
    try {
        const createdUser = await UserModel.create({
            name,
            email,
            password: encryptedPassword
        });
        return res.status(201).json({ status: "Ok", data: createdUser })
    } catch (error) {
        return res.status(400).json({ status: "Error", message: "Não foi possível criar sua conta, verifique se o email ja não está sendo usado ou tente novamente mais tarde.", error})
    }
};

// /api/user/:id PUT (Update user, update role or name for example)
// /api/user/:id DELETE (Delete user)

