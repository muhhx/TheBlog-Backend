import { Request, Response } from "express";
import mongoose from "mongoose";
import FollowModel from "../models/follow.model";
import UserModel from "../models/user.model";

export async function userFollowHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { targetId } = req.params;

    if(userId === targetId) {
        return res.status(400).json({ status: "Error", message: "Você não pode seguir você mesmo." });
    }
    if(!mongoose.Types.ObjectId.isValid(targetId)) {
        return res.status(400).json({ status: "Error", message: "Informe um ID válido." });
    }

    const user = await UserModel.findById(targetId);
    
    if(!user) {
        return res.status(400).json({ status: "Error", message: "Usuário não existe." });
    }

    const isFollowing = await FollowModel.findOne({ userId, targetId })

    if(isFollowing) {
        return res.status(400).json({ status: "Error", message: "Você já segue este usuário." });
    }

    try {
        const createFollow = await FollowModel.create({
            userId,
            targetId
        });

        return res.status(200).json({ status: "Ok", message: "Você seguiu o usuário.", data: createFollow });
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado. Não foi possível seguir este usuário." });
    }
};

export async function userUnfollowHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { targetId } = req.params;

    if(userId === targetId) {
        return res.status(400).json({ status: "Error", message: "Você não pode dar deixar de seguir você mesmo." });
    }
    if(!mongoose.Types.ObjectId.isValid(targetId)) {
        return res.status(400).json({ status: "Error", message: "Informe um ID válido." });
    }

    const isFollowing = await FollowModel.findOne({ userId, targetId })

    if(!isFollowing) {
        return res.status(400).json({ status: "Error", message: "Você não segue o usuário." });
    }

    try {
        const response = await FollowModel.findByIdAndDelete(isFollowing._id);

        if(!response) {
            return res.status(500).json({ status: "Error", message: "Algo deu errado. Não foi possível seguir este usuário." });
        }

        return res.status(200).json({ status: "Ok", message: "Você deixou de seguir o usuário." });
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado. Não foi possível deixar seguir este usuário." });
    }
};

export async function userFollowersHandler(req: Request, res: Response) {
    const { userId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: "Error", message: "Informe um ID válido." });
    }

    const user = await UserModel.findById(userId)

    if(!user) {
        return res.status(404).json({ status: "Error", message: "Usuário não existe ou não pode ser encontrado." });
    }

    try {
        const followers = await FollowModel.find({ targetId: userId }) 

        return res.status(200).json({ status: "Ok", message: "Seguidores deste usuário.", data: followers });
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado. Não foi possivel encontrar os usuários." });
    }
};

export async function userFollowingHandler(req: Request, res: Response) {
    const { userId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: "Error", message: "Informe um ID válido." });
    }

    const user = await UserModel.findById(userId)

    if(!user) {
        return res.status(404).json({ status: "Error", message: "Usuário não existe ou não pode ser encontrado." });
    }

    try {
        const following = await FollowModel.find({ userId: userId }) 

        return res.status(200).json({ status: "Ok", message: "Usuários.", data: following });
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado. Não foi possivel encontrar os usuários." });
    }
};
