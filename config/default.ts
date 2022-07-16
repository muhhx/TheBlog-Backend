import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  url: process.env.BASE_URL,
  dbUri: process.env.MONGOOSE_URI,
  bcryptSalt: 10,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  nodemailerService: process.env.NODEMAILER_SERVICE,
  nodemailerUser: process.env.NODEMAILER_USER,
  nodemailerPass: process.env.NODEMAILER_PASS,
  nodemailerHost: process.env.NODEMAILER_HOST,
  nodemailerPort: process.env.NODEMAILER_PORT,
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
};
