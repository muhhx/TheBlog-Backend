import dotenv from "dotenv"
dotenv.config()

export default {
    port: 5000,
    host: "localhost",
    url: "http://localhost:5000",
    dbUri: process.env.MONGOOSE_URI,
    bcryptSalt: 10,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    nodemailerService: "Gmail",
    nodemailerUser: "muriloue@gmail.com",
    nodemailerPass: "unlimitedexpansion"
};