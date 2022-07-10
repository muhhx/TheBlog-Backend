import dotenv from "dotenv";
dotenv.config();

export default {
  port: 5000,
  host: "localhost",
  url: "http://localhost:5000",
  origin: "http://localhost:3000",
  dbUri: process.env.MONGOOSE_URI,
  bcryptSalt: 10,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  nodemailerService: "gmail",
  nodemailerUser: "theblogemailservices@gmail.com",
  nodemailerPass: "lmfhpmbevpzxgdft",
  nodemailerHost: "smtp.gmail.com",
  nodemailerPort: 465,
  client_id: process.env.GOOGLE_CLIENT_ID as string,
  client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
  redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL as string,
};
