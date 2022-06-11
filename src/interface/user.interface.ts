export default interface IUser {
  name: string;
  email: string;
  username: String;
  password: string;
  role: string;
  bio: string;
  picture: string;
  isEmailVerified: Boolean;
  resetPasswordToken: string;
  resetPasswordExpire: Number;
  confirmEmailToken: string;
  confirmEmailExpire: Number;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}
