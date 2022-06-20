import mongoose from "mongoose";
import IUser from "../interface/user.interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      match: [/^[a-zA-Z_]+( [a-zA-Z_]+)*$/, "O nome é inválido"],
      minlength: [1, "Pelo menos 1 caracter."],
      maxlength: [30, "No maximo 30 caracteres"],
    },
    username: { type: String, required: true, unique: true }, //REJEX
    picture: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    password: {
      type: String,
      required: true,
      // match: [
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
      //   "Informe uma senha válida",
      // ],
      select: false,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: { type: String }, //REJEX MAX LIMIT
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Number },
    confirmEmailToken: { type: String },
    confirmEmailExpire: { type: Number },
    refreshToken: { type: String, select: false },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
