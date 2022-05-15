import dotenv from "dotenv"
dotenv.config()

export default {
    port: 5000,
    host: "localhost",
    dbUri: process.env.MONGOOSE_URI,
    bcryptSalt: 10
}