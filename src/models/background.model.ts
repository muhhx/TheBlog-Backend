import mongoose from "mongoose";
import IBackground from "../interface/background.interface";

const backgroundSchema = new mongoose.Schema(
  {
    image: { type: String },
  },
  { collection: "background" }
);

const BackgroundModel = mongoose.model("Background", backgroundSchema);

export default BackgroundModel;
