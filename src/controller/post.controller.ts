import { Request, Response } from "express";
import mongoose from "mongoose";
import PostModel from "../models/post.model";
import { createSlug, createSummary } from "../utils/format";

export async function createPostHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { title, summaryInput, image, content } = req.body;

    //Validate input fields
    if(!title || !summaryInput || !image || !content) {
        return res.status(400).json({ status: "Error", message: "Preencha todos os campos." })
    }
    if(typeof title !== "string" || typeof summaryInput !== "string" || typeof image !== "string" || typeof content !== "string") {
        return res.status(400).json({ status: "Error", message: "Os campos precisam ser strings." })
    }
    if(title.length > 100) {
        return res.status(400).json({ status: "Error", message: "O titulo não pode ter mais de 100 caracteres." })
    }
    if(summaryInput.length > 140) {
        return res.status(400).json({ status: "Error", message: "O sumário não pode ter mais de 140 caracteres." })
    }

    const slug = createSlug(title);
    const summary = createSummary(summaryInput);

    //Save to the database
    try {
        const post = await PostModel.create({
            slug,
            title,
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

    if(!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ status: "Error", message: "O post que você está tentando deletar não é válido." });
    }

    const post = await PostModel.findById(postId)

    if(!post) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Post not found."});
    }
    if(userId !== post.authorId) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Not authorized."});
    }

    try {
        const response = await PostModel.findByIdAndDelete(postId)

        if(!response) {
            return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Post não encontrado." })
        }

        return res.status(200).json({ status: "Ok", message: "Post deletado com sucesso." })
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post." })
    }
}

export async function updatePostHandler(req: Request, res: Response) {
    // @ts-ignore
    const { userId } = req.user;
    const { postId } = req.params;
    const { title, image, content, summary } = req.body;

    if(!title && !image && !content && !summary ) {
        return res.status(400).json({ status: "Error", message: "Preencha no mínimo um campo para atualizar o post." })
    }
    if(title && typeof title !== "string" || summary && typeof summary !== "string" || image && typeof image !== "string" || content && typeof content !== "string") {
        return res.status(400).json({ status: "Error", message: "Os campos precisam ser strings." })
    }
    if(title && title.length > 100) {
        return res.status(400).json({ status: "Error", message: "O titulo não pode ter mais de 100 caracteres." })
    }
    if(summary && summary.length > 140) {
        return res.status(400).json({ status: "Error", message: "O sumário não pode ter mais de 140 caracteres." })
    }
    if(!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ status: "Error", message: "O post que você está tentando atualizar não é válido." });
    }

    const post = await PostModel.findById(postId);

    if(!post) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Author not found."});
    }
    if(userId !== post.authorId) {
        return res.status(404).json({ status: "Error", message: "Algo deu errado ao tentar deletar seu post. Not authorized."});
    }

    const newPostUpdated = req.body;

    if(summary) {
        const newSummary = createSummary(summary);
        newPostUpdated.summary = newSummary;
    }
    if(title) {
        const slug = createSlug(title);
        newPostUpdated.slug = slug;
    }

    try {
        const result = await PostModel.findByIdAndUpdate(postId, newPostUpdated, { runValidators: true, new: true })

        if(!result ) {
            return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar atualizar seu post." })
        }

        return res.status(200).json({ status: "Ok", message: "Post atualizado.", data: result })
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar atualizar seu post." })
    }
}

export async function getPostHandler(req: Request, res: Response) {
    const { slug } = req.params;

    try {
        const post = await PostModel.findOne({ slug });

        if(!post) {
            return res.status(400).json({ status: "Error", message: "O post que você está tentando acessar não existe." });
        }

        return res.status(200).json({ status: "Ok", data: post });
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar acessar o post." })
    }
}

export async function getPostsHandler(req: Request, res: Response) {
    const queryParams = req.query["param"];
    //Pagination
    //Tags, etc

    try {
        const posts = await PostModel.find();

        return res.status(200).json({ status: "Ok", data: posts })
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar acessar os posts." })
    }
}

export async function getUserPostsHandler(req: Request, res: Response) {
    const { userId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: "Error", message: "O post que você está tentando acessar não é válido." });
    }

    try {
        const posts = await PostModel.find({ authorId: { $eq: userId }})

        return res.status(200).json({ status: "Ok", data: posts })
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Algo deu errado ao tentar acessar o post." })
    }
}
