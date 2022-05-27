import mongoose from "mongoose";
import IPost from "../interface/post.interface";

const postSchema = new mongoose.Schema<IPost>({
    authorId: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, maxlength: [100, "O titulo não pode ter mais de 100 caracteres."] },
    summary: { type: String, required: true, maxlength: [143, "O sumário não pode ter mais de 143 caracteres."] },
    content: { type: String, required: true },
    image: { type: String, required: true }
}, {
    collection: 'posts',
    timestamps: true
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
