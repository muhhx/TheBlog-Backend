export default interface IPost {
    slug: String; //Usar slug ao inves de id (página será criada com slug - UNIQUE)
    tags: String[]; //VAO SER HASHTAGS PRA POSSIBILITAR MAIS FLEXIBILIDADE NOS NOMES, TIPO INSTA #teste, #ooasddfgsd #4d4gd #cwb41 (qualquer coisa)
    meta: String[]; //Vai conter tags (se o post é novo, se o post é um dos mais escolhidos, etc) -- HOME (projetos q vao aparecer na home page)
    title: String;
    subtitle: String;
    summary: String; //Mostrar na pagina inicial, apenas um resuminho
    authorId: String;
    image: String;
    content: String;
    createdAt: Date;
    updatedAt: Date;
};