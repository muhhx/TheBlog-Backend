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