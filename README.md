### Theo Webert Blog - Backend

- Register
- Login
- Get all posts
- Get 6 posts (then 6+, then 6+ as the user requests for the data) - PAGINATION
- Get posts from home
- Update post
- Delete post
- Create post

### Models
1. Blog Post (+ Comentários, + Autor, relacionando com o user) 
    -> Para o usuário fazer o comentário, ele precisa estar registrado no banco de dados -- (Todos usuarios do bd, recebem newsletter) Disponibilizar a opção do usuário aceitar receber newsletter ou n em pagina do usuario
2. User (user can register and shit, make posts)
3. Session (quando o usuário é logado)

Mandar o markdown em formato de string, ai quando a pessoa entrar na pagina do post, transformar o markdown em html de alguma maneira
Front-end: Recebe post contendo uma string em formato de markdown, usar essa string com package react-markdown, que converte a string em hmtl