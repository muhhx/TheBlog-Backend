export default interface IComment {
  authorId: string;
  postId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
