import mongoose from "mongoose";
import IFollow from "../interface/follow.interface";

const followSchema = new mongoose.Schema<IFollow>({
    userId: { type: String, required: true },
    targetId: { type: String, required: true }
}, {
    collection: "follow",
    timestamps: true
});

const FollowModel = mongoose.model("FollowModel", followSchema);

export default FollowModel;
