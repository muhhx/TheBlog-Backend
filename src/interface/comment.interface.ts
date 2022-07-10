export default interface IComment {
  authorId: string;
  postId: string;
  comment: string;
  upvoteCount: number;
  createdAt: Date;
  updatedAt: Date;
}
