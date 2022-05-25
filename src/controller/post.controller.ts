import { Request, Response } from "express";
import crypto from "crypto";
import PostModel from "../models/post.model";

export async function createPostHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { tags, title, subtitle, image, content, summaryInput } = req.body;

    //Validate input fields
    if(!title || !subtitle || !image || !content || !summaryInput) {
        return res.status(400).json({ status: "Error", message: "Preencha todos os campos." })
    }

    const postRandomBytes = crypto.randomBytes(8).toString('hex')
    const slugInput = title.split(" ").join("-").toLowerCase()
    const slug = `${slugInput}-${postRandomBytes}`
    const summary = `${summaryInput}...`

    try {
        const post = await PostModel.create({
            slug,
            tags,
            title,
            subtitle,
            summary,
            content,
            image,
            authorId: userId
        })

        return res.status(200).json({ status: "Ok", message: "Post criado com sucesso.", data: post })
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar criar seu post.", data: error })
    }
};


export async function deletePostHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { postId } = req.params;

    const post = await PostModel.findById(postId)

    if(!post) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Author not found."});
    }
    if(userId !== post.authorId) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Not authorized."});
    }

    try {
        const response = await PostModel.findByIdAndDelete(postId)

        if(!response) {
            return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Post não encontrado." })
        }

        return res.status(200).json({ status: "Ok", message: "Post deletado com sucesso.", data: response })
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post." })
    }
}

export async function updatePostHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { postId } = req.params;
    const { tags, title, subtitle, image, content, summaryInput } = req.body;

    if(!title && !subtitle && !image && !content && !summaryInput && !tags) {
        return res.status(400).json({ status: "Error", message: "Preencha no mínimo um campo para atualizar o post." })
    }

    const post = await PostModel.findById(postId);

    if(!post) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Author not found."});
    }
    if(userId !== post.authorId) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Not authorized."});
    }


    try {
        // await PostModel.findByIdAndUpdate(postId, )

        res.send("Rota em manutenção")
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar atualizar seu post." })
    }

}
