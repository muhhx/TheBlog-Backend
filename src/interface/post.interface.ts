export default interface IPost {
  slug: string;
  title: string;
  summary: string;
  authorId: string;
  image: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
