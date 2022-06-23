export default interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  bio: string;
  picture: string;
  isEmailVerified: boolean;
  resetPasswordToken: string;
  resetPasswordExpire: number;
  confirmEmailToken: string;
  confirmEmailExpire: number;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}
