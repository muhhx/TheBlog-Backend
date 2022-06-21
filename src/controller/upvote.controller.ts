import mongoose from "mongoose";
import { Request, Response } from "express";
import UpvoteModel from "../models/upvote.model";
import PostModel from "../models/post.model";
import UserModel from "../models/user.model";

export async function postUpvoteHandler(req: Request, res: Response) {
  // @ts-ignore
  const { userId } = req.user;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res
      .status(400)
      .json({ status: "Error", message: "O post não é válido." });
  }

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res
        .status(400)
        .json({ status: "Status", message: "Post não existe." });
    }

    const isUpvoted = await UpvoteModel.findOne({ userId, postId });

    if (isUpvoted) {
      return res
        .status(400)
        .json({ status: "Status", message: "Você já curtiu esse post." });
    }

    const upvote = await UpvoteModel.create({
      userId,
      postId,
    });

    return res.status(200).json({ status: "Ok", message: "Post upvoted." });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "Status",
        message: "Não foi possível dar upvote no post.",
      });
  }
}

export async function deleteUpvoteHandler(req: Request, res: Response) {
  // @ts-ignore
  const { userId } = req.user;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res
      .status(400)
      .json({ status: "Error", message: "O post não é válido." });
  }

  try {
    const upvote = await UpvoteModel.findOne({ userId, postId });

    if (!upvote) {
      return res
        .status(400)
        .json({
          status: "Status",
          message: "Você ainda não curtiu esse post.",
        });
    }

    await UpvoteModel.findByIdAndDelete(upvote._id);

    return res.status(200).json({ status: "Ok", message: "Upvote removido." });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "Status",
        message: "Não foi possível remover o upvote.",
      });
  }
}

export async function getUpvoteHandler(req: Request, res: Response) {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res
      .status(400)
      .json({ status: "Error", message: "O post não é válido." });
  }

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res
        .status(400)
        .json({ status: "Status", message: "Post não existe." });
    }

    const upvotes = await UpvoteModel.find(
      { postId: { $eq: postId } },
      { userId: 1, _id: 0 }
    );

    const array = upvotes.map((upvote) => upvote.userId);

    const users = await UserModel.find(
      { _id: { $in: array } },
      { name: 1, username: 1, picture: 1 }
    );

    return res
      .status(200)
      .json({ status: "Ok", data: users, upvoteCount: array.length });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "Status",
        message: "Não foi possível acessar os upvotes do post.",
      });
  }
}
