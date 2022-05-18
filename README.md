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

## Funcionalidades Blog Social Media
1. Se você não estiver logado, você pode ver alguns posts
2. Se você estiver logado, você pode comentar e criar posts (no futuro posso adicionar outras funcionalidades de SEGUIR, UPVOTE POST, UPVOTE COMMENTS, SAVE POST, etc)
    Apenas o ADM e o criador do comentário podem deletar o comentário
3. Para gerenciar (Deletar, update e tals), comentários e posts, criar página "Gerenciar comentarios / Gerenciar posts"
Quando vc for fazer request de comentarios e pegar o authorId, porem o BD nao encontrar usuario com esse id, setar Nome: Deleted user

Getting liked posts:

User makes request
Middleware verify if user is auth
LikedPostsID.Model get (will get the id of all liked posts from this user in this table)
likedPosts = AllPostsDatabase.Model get if postId === likedPostId (will get all posts that have the id)
return likedPosts

Posso fazer isso com tudo (posts com mais upvotes, posts com tags === "cats", etc)