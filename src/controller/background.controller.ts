import { Request, Response } from "express";
import BackgroundModel from "../models/background.model";

export async function getBackgroundHandler(req: Request, res: Response) {
  try {
    const raw = await BackgroundModel.aggregate([{ $sample: { size: 1 } }]);

    const selectedImage = raw[0].image;

    // const random = Math.floor(Math.random() * count) + 1;

    // const selectedImage = await BackgroundModel.findOne().skip(random);

    return res.status(200).json({ success: "Ok", selectedImage });
  } catch (error) {
    return res.status(500);
  }
}
