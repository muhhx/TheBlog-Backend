### Theo Webert Blog - Backend

- Register
- Login
- Get all posts (not protected)
- Get 6 posts (then 6+, then 6+ as the user requests for the data) - PAGINATION (not protected)
- Get posts from home (not protected)
- Update post (protected)
- Delete post (protected)
- Create post (protected)
- Email

### Models
1. Blog Post (+ Comentários, + Autor, relacionando com o user) 
2. Comentarios
2. User (user can register and shit, make posts)
    1. admin (tem todas as funcionalidades)
    2. blog poster (pode criar blogs e deletar apenas os seus)
    3. user (pode escrever comentarios)
3. Session (quando o usuário é logado)???
4. Newsletter (cheio de email)

N precisa registrar pra comentar, comentario vai ser revisado?


Mandar o markdown em formato de string, ai quando a pessoa entrar na pagina do post, transformar o markdown em html de alguma maneira
Front-end: Recebe post contendo uma string em formato de markdown, usar essa string com package react-markdown, que converte a string em hmtl

    -> Para o usuário fazer o comentário, ele precisa estar registrado no banco de dados -- (Todos usuarios do bd, recebem newsletter) Disponibilizar a opção do usuário aceitar receber newsletter ou n em pagina do usuario

### Videos pra ver e tals
1. https://www.youtube.com/watch?v=qylGaki0JhY&ab_channel=TomDoesTech (autenticação login register e tudo mais)
2. https://www.youtube.com/watch?v=TbT7eO1fxuI&t=38s&ab_channel=TomDoesTech (ultimate guide typescript mongoose)
3. https://www.youtube.com/watch?v=BWUi6BS9T5Y&ab_channel=TomDoesTech (build a restful api - ver best practices e tals)
Ao final desses 3 vídeos, ja vou poder ter o backend da aplicação e um conhecimento MUITO bom sobre backend e best practices

Duvidas atuais para serem respondidas
1. Mongoose (o que sao models exatamente, onde se aplicam, etc)
2. Arquitetura do backend (o que são exatamente controllers, models, service, e tals)
3. Toda parte de Autenticação (login, auth, JWT, refresh tokens, cookies, sessions, etc)
+ Design do banco de dados do blog e site (usuarios + posts + comentarios) - ver fields que vou adicionar e tudo mais

### Front end
- https://stackoverflow.com/questions/66356329/how-to-add-styling-for-elements-in-react-markdown (styling markdown)


# Autenticação
- "/register" = Faz todas as verificações (6+caracteres, etc) + encripta senha + salva banco de dados
- "/login" = Verifica se o usuario existe e compara a senha provida com a senha encriptada

# Authorization -> Uma vez que o usuário foi autenticado, mandar o Token pra ele. Com esse token, ele pode pegar os dados
# Porém, se o usuário não for autenticado, não mandar o token, ai ele não poderá pegar esses certos dados
# O usuário fazendo a requisição tem que ser o mesmo que foi autenticado

Acess Token + Refresh Token
-> Se depois de certo tempo, o access token expirar, o refresh token vai ser usado para dar um novo access token pro usuário


Utilizar Apenas o accessToken por agora e setar o tempo do usuario para 1h, sla.
No futuro, aprender sobre: 
https://www.youtube.com/watch?v=EqzUcMzfV1w&t=1995s&ab_channel=TraversyMedia (Around 1h, 13min)
1. Cookies e tals
2. Sessions
3. Refresh Token (in details. SEARCH FOR > https://www.youtube.com/results?search_query=refresh+token+jwt)
4. PEM algorithm, SSL and shit (https://stackoverflow.com/questions/63030755/error-error0909006cpem-routinesget-nameno-start-line-node)


## Funcionalidades:
1. Não logado:
    - Pode sign in para newsletter
2. User:
    - Comentar em post ("Seus comentários")
    - Update dados do seu usuário, Deletar seu usuário (seus comentários não serão deletados, porem suas fotos e nomes dos comentarios aparecerão "Usuario deletado")
2. Blogger
    - Tudo acima
    - Revisar comentários do seu próprio post
    - Criar, update e deletar post (Contanto que seja apenas o seu)
    - Update dados do seu usuário, Deletar seu usuário (seus posts não serão deletados)
    https://jacurtis.com/author/alex-curtis/
3. Admin
    - Tudo 
    - Mudar roles dos usuários
    https://www.youtube.com/results?search_query=designing+a+database+blog


Getting liked posts:

User makes request
Middleware verify if user is auth
LikedPostsID.Model get (will get the id of all liked posts from this user in this table)
likedPosts = AllPostsDatabase.Model get if postId === likedPostId (will get all posts that have the id)
return likedPosts

Posso fazer isso com tudo (posts com mais upvotes, posts com tags === "cats", etc)


    // /api/user POST (Register new user)
    // /api/user/ PUT (Update normal user info) A
        /api/user/password 
        /api/user/email (no need to auth the email here)
    // /api/user/ DELETE (Delete user) A
    // /api/user/:id GET (Get a specific user)
    // /api/user/email - Verifica email

    // RECUPERAR SENHA

    // /api/session POST (Login)
    // /api/session DELETE (Logout) A
    // /api/session GET (Verify session) A

    // /api/blog POST (Create post) A
    // /api/blog DELETE (Delete post) A
    // /api/blog PUT (Update blog post) A
    // /api/blog GET (Get all blog posts)
    // /api/blog?teste=queries GET (pagination getting posts by page, any type of filtering) => In order to get home projects, just query for them instead of creating a new route
    // /api/blog/:id GET (Get specific blog post BY SLUG not ID)

    // /api/comment POST (post a comment) A
    // /api/comment/:id DELETE (Delete comment) A
    // /api/comment/:id PUT (Update comment) A
    // /api/comment?user=userId GET (Query user's comments)
    // /api/comment?post=postId GET (Query post's comments)

        //Toda vez que os dados dos currentUser mudam, gerar novo JWT
    app.put("/api/user", [verifyUser, verifyEmail], updateUserHandler); //Updates normal information (Name, Bio, Avatar, username)
    app.put("/api/user/email", verifyUser, () => {}) //Updates email (everytime the email is update, set user's isEmailVerified to false so he can verify again. Also logout user so he can generate a new valid JWT token)
    app.put("/api/user/password", [verifyUser, verifyEmail], () => {}) //Change password (Posso fazer isso na rota normal também)
    app.put("/api/user/verify", [verifyUser], () => {}); // Route to verify email (returns if is verified or not) - if its verified, logout the user and refresh the page
    