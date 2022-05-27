import mongoose from "mongoose";
import IFavorite from "../interface/favorite.interface";

const favoriteSchema = new mongoose.Schema<IFavorite>({
    userId: { type: String, required: true },
    postId: { type: String, required: true}
}, {
    collection: 'favorite',
    timestamps: true
});

const FavoriteModel = mongoose.model("Favorite", favoriteSchema);

export default FavoriteModel;
