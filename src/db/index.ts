import UserModel from "../models/user.model";

export async function findUserWithoutPassword(field: String, input: String) {
    try {
        const user = await UserModel.find({ [`${field}`]: input });
        
        if(!user || user.length === 0) {
            return null
        };

        return user;
    } catch (error) {
        return null
    }
};
