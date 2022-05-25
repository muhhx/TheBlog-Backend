import mongoose from "mongoose";
import IPost from "../interface/post.interface";

const postSchema = new mongoose.Schema<IPost>({
    authorId: { type: String, required: true },
    slug: { type: String, required: true, unique: true, maxlength: [70, "O slug não pode ter mais de 70 caracteres."] }, //n pode ter caractere especial
    meta: { type: [String] },
    tags: { type: [String], maxlength: [5, "Você só pode adicionar 5 tags."] },
    title: { type: String, required: true, maxlength: [100, "O titulo não pode ter mais de 100 caracteres."] },
    subtitle: { type: String, required: true, maxlength: [140, "O subtitulo não pode ter mais de 140 caracteres."] },
    summary: { type: String, required: true, maxlength: 227 },
    content: { type: String, required: true },
    image: { type: String, required: true }
}, {
    collection: 'posts',
    timestamps: true
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
