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

    const userData = await UserModel.find(
      { _id: { $eq: user.userId } },
      { _id: 1, name: 1, username: 1, picture: 1 }
    );

    return res
      .status(201)
      .json({ comment: createdComment, userData: userData[0] });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deleteCommentHandler(req: Request, res: Response) {
  const { commentId } = req.params;

  try {
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    return res.status(200).json(deletedComment);
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

    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: commentId },
      { comment },
      { new: true }
    );

    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getCommentsHandler(req: Request, res: Response) {
  const { postId } = req.params;

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
              _id: users[j]._id,
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
            _id: Math.random(),
            picture:
              "https://firebasestorage.googleapis.com/v0/b/the-blog-565e3.appspot.com/o/visax-IqZyFphHYbw-unsplash.jpg?alt=media&token=cde739f6-671e-4d7f-b519-44fa4422caa6",
            name: "Usuário deletado",
            username: null,
          },
        });
      }
    }

    return res.status(200).json(finalArr);
  } catch (error) {
    return res.sendStatus(500);
  }
}
