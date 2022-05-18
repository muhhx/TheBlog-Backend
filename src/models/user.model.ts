import mongoose from "mongoose"
import IUser from "../interface/user.interface";

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
}, {
    collection: 'users',
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
