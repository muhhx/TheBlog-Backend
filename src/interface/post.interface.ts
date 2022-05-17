export default interface IPost {
    slug: String; //Usar slug ao inves de id (página será criada com slug - UNIQUE)
    tags: String[]; //Tags para pesquisa
    meta: String[]; //Vai conter tags (se o post é novo, se o post é um dos mais escolhidos, etc) -- HOME (projetos q vao aparecer na home page)
    title: String;
    summary: String;
    authorId: String;
    image: String;
    content: String;
    createdAt: Date;
    updatedAt: Date;
};