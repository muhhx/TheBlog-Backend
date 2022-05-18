import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import UserModel from "../models/user.model";
import { findUserWithoutPassword, deleteUser } from "../db";

export async function registerUserHandler(req: Request, res: Response){
    const { name, username, email, emailConfirmation, password, passwordConfirmation } = req.body;

    //1. Data validation
    if (!name || !username || !email || !emailConfirmation || !password || !passwordConfirmation) {
        return res.status(400).json({ status: "Error", message: "Preencha todos os campos."});
    }
    if(!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/.test(username)) {
        return res.status(400).json({ status: "Error", message: "O username não é valido, confira as regras."});
    }
    if (password.length < 6) {
        return res.status(400).json({ status: "Error", message: "A senha precisa ter no mínimo 6 caracteres."});
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
        return res.status(400).json({ status: "Error", message: "Não foi possível criar sua conta, verifique se o email ja não está sendo usado ou tente novamente mais tarde.", error })
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
    const { userId, userRole } = req.user; //if you are admin, you dont need to provide the user's password.
    const { username } = req.params;
    const { password } = req.body;

    if(!password && userRole !== "admin") {
        return res.status(400).json({ status: "Error", message: "Informe sua senha." });
    }

    //Gets data from the person making the request
    const currentUser = await UserModel.findById(userId).select('+password');

    if(!currentUser) {
        return res.status(404).json({ status: "Error", message: "Usuário não encontrado." });
    };
    
    //Verify if the user making the request is the same being deleted
    if(username !== currentUser.username && userRole !== "admin") {
        return res.status(400).json({ status: "Error", message: "Você não pode deletar outros usuários." });
    }

    try {
        //Verify if the password provided is correct
        if(!await bcrypt.compare(String(password), currentUser.password) && userRole !== "admin") {
            return res.status(401).json({ status: "Error", message: "Senha inválida." });
        };

        //3. Delete user from database
        const result = await deleteUser(username);

        if(!result) {
            return res.status(400).json({ status: "Error", message: "Não foi possível deletar o usuário." });
        }
        
        //4. Revoke JWT Cookies
        if(userRole !== "admin") {
            res.cookie("accessToken", "", {
                maxAge: 0,
                httpOnly: true,
            });
        }
        
        res.status(200).json({ status: "Ok", message: "Usuário foi deletado.", reload: true });
    } catch (error) {
        return res.status(400).json({ status: "Error", message: "Não foi possível deletar o usuário." });
    }
};
