import mongoose from "mongoose";
import { Request, Response } from "express";
import FavoriteModel from "../models/favorite.model";
import PostModel from "../models/post.model";
import UserModel from "../models/user.model";

export async function saveFavoriteHandler(req: Request, res: Response) {
  // @ts-ignore
  const { userId } = req.user;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      status: "Error",
      message: "O post que você está tentando salvar não é válido.",
    });
  }

  const post = await PostModel.findById(postId);

  if (!post) {
    return res.status(400).json({
      status: "Error",
      message: "O post que você está tentando salvar não existe.",
    });
  }
  if (userId === post.authorId) {
    return res.status(400).json({
      status: "Error",
      message: "Você não pode savar seus próprios posts.",
    });
  }

  const isFavorited = await FavoriteModel.findOne({ userId, postId });

  if (isFavorited) {
    return res.status(400).json({
      status: "Error",
      message: "O post que você está tentando salvar já foi favoritado.",
    });
  }

  try {
    const createFavorite = await FavoriteModel.create({
      userId,
      postId,
    });

    return res.status(200).json({
      status: "Ok",
      message: "O post foi adicionado aos favoritos.",
      data: createFavorite,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Algo deu errado ao tentar salvar o post.",
    });
  }
}

export async function deleteFavoriteHandler(req: Request, res: Response) {
  // @ts-ignore
  const { userId } = req.user;
  const { postId } = req.params;

  try {
    const favorite = await FavoriteModel.findOne({ userId, postId });

    if (!favorite) {
      return res.status(400).json({
        status: "Error",
        message: "O post ainda não foi adicionado aos favoritos.",
      });
    }

    await FavoriteModel.findByIdAndDelete(favorite._id);

    return res
      .status(200)
      .json({ status: "Ok", message: "O post foi removido dos favoritos." });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Ocorreu algum erro ao remover o post dos favoritos.",
    });
  }
}

export async function userFavoritesHandler(req: Request, res: Response) {
  // @ts-ignore
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({
        status: "Error",
        message: "Algo deu errado ao tentar acessar seus posts favoritos.",
      });
    }

    const favorites = await FavoriteModel.find(
      { userId: { $eq: user._id } },
      { postId: 1, _id: 0 }
    );

    const array = favorites.map((favorite) => favorite.postId);

    const posts = await PostModel.find({ _id: { $in: array } });

    return res
      .status(200)
      .json({ status: "Ok", data: posts, favoriteCount: array.length });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Ocorreu algum erro ao acessar seus posts favoritos.",
    });
  }
}

export async function checkFavoriteHandler(req: Request, res: Response) {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const response = await FavoriteModel.find({
      userId: { $eq: userId },
      postId: { $eq: postId },
    });

    const isSaved = response.length === 0 ? false : true;

    return res.status(200).json({ status: "Ok", isSaved });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Ocorreu algum erro.",
    });
  }
}
