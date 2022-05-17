import mongoose from "mongoose";
import IComment from "../interface/comment.interface";

const commentSchema = new mongoose.Schema<IComment>({
    authorId: { type: String, required: true },
    postId: { type: String, required: true },
    comment: { type: String, required: true }
}, {
    collection: 'comments',
    timestamps: true
});

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;
