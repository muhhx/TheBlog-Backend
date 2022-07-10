import mongoose from "mongoose";

const backgroundSchema = new mongoose.Schema(
  {
    image: { type: String },
  },
  { collection: "background" }
);

const BackgroundModel = mongoose.model("Background", backgroundSchema);

export default BackgroundModel;
