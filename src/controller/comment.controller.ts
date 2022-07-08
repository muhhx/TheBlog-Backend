import { Request, Response } from "express";
import CommentModel from "../models/comment.model";
import UserModel from "../models/user.model";

export async function postCommentHandler(req: Request, res: Response) {
  // @ts-ignore
  const user = req.user;
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    if (!comment || comment.length > 500) {
      return res
        .status(400)
        .json({ success: "Error", message: "O comentário não é válido." });
    }

    const createdComment = await CommentModel.create({
      authorId: user.userId,
      postId,
      comment,
    });

    return res.status(201).json({
      success: "Error",
      message: "Comentário criado com sucesso.",
      createdComment,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deleteCommentHandler(req: Request, res: Response) {
  const { commentId } = req.params;

  try {
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: "Ok",
      message: "Comentário deletado com sucesso.",
      deletedComment,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function updateCommentHandler(req: Request, res: Response) {
  const { commentId } = req.params;
  const { comment } = req.body;

  try {
    if (!comment || comment.length > 500) {
      return res
        .status(400)
        .json({ success: "Error", message: "Comentário inválido." });
    }

    await CommentModel.findOneAndUpdate({ _id: commentId }, { comment });

    return res.status(200).json({
      success: "Ok",
      message: "Comentário atualizado com sucesso.",
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getCommentsHandler(req: Request, res: Response) {
  const { postId } = req.params;

  //1. Get all comments that postId === postId;
  //2. Criar uma array de author Ids
  //3. Get all users que estão inclusos nessa array de authorIds
  //4. Para cada comentário, retornar um objeto contendo os dados do comentário + dados do autor (picture, name, username) || caso o authorId não esteja incluso na array, retornar "usuario deletado"
  //
  //1. Pegar todos os comentarios que contem postId
  //2. Iterar os comentários, para cada comentario: buscar usuário com o authorId.
  // caso user.lenght === 0, retornar "usuário nao encontrado"
  // caso contrario, retornar dados do usuário

  try {
    const comments = await CommentModel.find({ postId: { $eq: postId } });

    if (comments.length === 0) {
      return res.status(200).json(comments);
    }

    const userIds = comments.map((comment) => comment.authorId);

    const users = await UserModel.find({ _id: { $in: userIds } });

    let finalArr = [];
    for (let i = 0; i < comments.length; i++) {
      let found = false;
      for (let j = 0; j < users.length; j++) {
        if (comments[i].authorId === String(users[j]._id)) {
          finalArr.push({
            comment: comments[i],
            userData: {
              picture: users[j].picture,
              name: users[j].name,
              username: users[j].username,
            },
          });
          found = true;
        }
      }

      if (users.length === 0 || found === false) {
        finalArr.push({
          comment: comments[i],
          userData: {
            picture:
              "https://firebasestorage.googleapis.com/v0/b/the-blog-565e3.appspot.com/o/visax-IqZyFphHYbw-unsplash.jpg?alt=media&token=cde739f6-671e-4d7f-b519-44fa4422caa6",
            name: "Usuário deletado",
            username: "usuariodeletado",
          },
        });
      }
    }

    return res.status(200).json({ success: "Ok", finalArr });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function upvoteCommentHandler(req: Request, res: Response) {
  const { commentId } = req.params;

  try {
    await CommentModel.findOneAndUpdate(
      { _id: commentId },
      { $inc: { upvoteCount: 1 } }
    );

    return res.status(200).json({ status: "Ok" });
  } catch (error) {
    return res.sendStatus(500);
  }
}
