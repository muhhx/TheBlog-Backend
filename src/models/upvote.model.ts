import mongoose from "mongoose";
import IUpvote from "../interface/upvote.interface";

const upvoteSchema = new mongoose.Schema<IUpvote>({
    postId: { type: String, required: true },
    userId: { type: String, required: true }
}, {
    collection: 'upvote',
    timestamps: true
});

const UpvoteModel = mongoose.model("Upvote", upvoteSchema);

export default UpvoteModel;
