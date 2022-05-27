import mongoose from "mongoose"
import IUser from "../interface/user.interface";

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Informe um email válido."] },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Number },
    confirmEmailToken: { type: String },
    confirmEmailExpire: { type: Number },
}, {
    collection: 'users',
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

//Adicionar: 
// Social medias
// Total likes (of all your posts) -- nao preciso colocar isso no perfil, sera feito de maneira automatica
// Link
// Contato (phone + contactEmail)