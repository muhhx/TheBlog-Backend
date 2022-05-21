import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>('accessTokenPrivateKey');

export function createJWT(payload: object, expiresIn: number | string) {
    return jwt.sign(payload, privateKey, { expiresIn });
};

export async function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, privateKey)

        return decoded;
    } catch (error) {
        return null;
    }
};
