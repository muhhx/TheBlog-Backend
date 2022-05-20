import { Request, Response } from "express";
import PostModel from "../models/post.model";

export function createPostHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { } = req.body;

    //Validate input fields
    //Save image (do it later)
    //Save to the database
};
