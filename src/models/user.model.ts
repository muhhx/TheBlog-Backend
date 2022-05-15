import mongoose from "mongoose"
import IUser from "../interface/user.interface";

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "blogger", "admin"], default: "user" }
}, {
    collection: 'users',
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
