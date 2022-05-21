export default interface IUser {
    name: string;
    email: string;
    isEmailVerified: Boolean;
    username: String;
    password: string;
    role: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
};