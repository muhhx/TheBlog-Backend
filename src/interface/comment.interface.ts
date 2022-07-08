export default interface IComment {
  authorId: string;
  postId: string;
  comment: string;
  upvoteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

//Get all comments = CommentModel.find(postId) => para cada post, pegar dados do authorId (picture, name) => caso o user esteja deletado = "Usuário deletado"
//Delete comments = if(comment.authorId === auth._id) = significa que você (usuário autenticado), é o proprietário do comentário, então, mostrar opção para deletá-lo
//Update comments = if(comment.authorId === auth._id) = significa que você (usuário autenticado), é o proprietário do comentário, então, mostrar opção para editar
