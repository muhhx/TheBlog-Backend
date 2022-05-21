import mongoose from "mongoose"
import IUser from "../interface/user.interface";

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: { type: String }
}, {
    collection: 'users',
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
