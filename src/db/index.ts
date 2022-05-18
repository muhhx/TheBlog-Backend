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

export async function deleteUser(username: String) {
    try {
        const response = await UserModel.remove({ username: username})

        if(!response || response.deletedCount < 1) {
            return null
        }

        return response
    } catch (error) {
        return null      
    }
};
