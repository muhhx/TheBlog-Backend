export default interface IFollow {
    userId: String;
    targetId: String;
    createdAt: Date;
    updatedAt: Date;
};


//Use cases:
// userId: String; //se refere ao user fazendo a ação
// targetId: String; //se refere ao user recebendo a ação

// 1. Follow -- Add doc where userId === eu, target === pessoa q eu quero seguir
// 2. Unfollow -- Delete doc where userID === o meu e targetId == a pessoa q eu quero dar unfollow
// 3. Remove person from following me -- Delete doc where targetId === o meu e userId === a pessoa que está me seguindo N VOU FAZER ISSO AGORA
// 3. Get user's followes - get all docs that targetId === o seu
// 4. Get user's following - GET all docs that userId === o teu

// E se o usuário for deletado? Nao muda nada, apenas deletar o id da tabela. Nao vou precisar de mais dados do user deletado
