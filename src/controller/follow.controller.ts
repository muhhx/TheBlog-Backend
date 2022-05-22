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
        return res.status(400).json({ status: "Error", message: "Informe um id válido." });
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

};

export async function userFollowersHandler(req: Request, res: Response) {

};

export async function userFollowingHandler(req: Request, res: Response) {

};
