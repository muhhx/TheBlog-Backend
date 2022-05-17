import mongoose from "mongoose";
import IPost from "../interface/post.interface";

const postSchema = new mongoose.Schema<IPost>({
    authorId: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    meta: { type: [String] },
    tags: { type: [String] },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true }
}, {
    collection: 'posts',
    timestamps: true
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
