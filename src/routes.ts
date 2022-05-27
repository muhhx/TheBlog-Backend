import { Express } from "express";
import { loginSessionHandler, logoutSessionHandler, verifySessionHandler } from "./controller/session.controller";
import { registerUserHandler, getUserHandler, deleteUserHandler, updateUserHandler, forgotPasswordHandler, resetPassowrdHandler, confirmEmailHandler, validateEmailHandler } from "./controller/user.controller";
import { createPostHandler, deletePostHandler, updatePostHandler, getPostHandler, getPostsHandler, getUserPostsHandler } from "./controller/post.controller";
import { userFollowHandler, userUnfollowHandler, userFollowersHandler, userFollowingHandler } from "./controller/follow.controller";
import verifyUser from "./middleware/verifyUser";
import { deleteFavoriteHandler, saveFavoriteHandler, userFavoritesHandler } from "./controller/favorite.controller";

function routes(app: Express) {
    //Toda vez que os dados dos currentUser mudam, gerar novo JWT
    app.put("/api/user", verifyUser, updateUserHandler); //Esperar 5 minutos pra mudar username ou email novamente (isso impede spam)
    app.post("/api/user", registerUserHandler);
    app.delete("/api/user", verifyUser, deleteUserHandler);
    
    app.get("/api/user/:username", getUserHandler);
    app.get("/api/user/:userId/followers", userFollowersHandler);
    app.get("/api/user/:userId/following", userFollowingHandler);
    app.get("/api/user/:userId/posts", getUserPostsHandler);
    app.get("/api/user/:userId/favorites", verifyUser, userFavoritesHandler);
    // /api/user/:userID/comments
    // /api/user/:userID/upvotes

    app.post("/api/forgotpassword", forgotPasswordHandler);
    app.put("/api/resetpassword/:resetToken", resetPassowrdHandler);
    app.post("/api/confirmemail", confirmEmailHandler);
    app.put("/api/confirmemail/:confirmToken", validateEmailHandler);
    
    app.post("/api/session", loginSessionHandler);
    app.delete("/api/session", logoutSessionHandler);
    app.get("/api/session", verifyUser, verifySessionHandler);

    app.post("/api/follow/:targetId", verifyUser, userFollowHandler);
    app.delete("/api/follow/:targetId", verifyUser, userUnfollowHandler);

    app.post("/api/post", verifyUser, createPostHandler);
    app.delete("/api/post/:postId", verifyUser, deletePostHandler);
    app.put("/api/post/:postId", verifyUser, updatePostHandler);
    app.get("/api/post/:slug", getPostHandler);
    app.get("/api/post", getPostsHandler); //Add pagination and filters (specific tag, metatag or title research)

    app.post("/api/favorite/:postId", verifyUser, saveFavoriteHandler);
    app.delete("/api/favorite/:postId", verifyUser, deleteFavoriteHandler);

    //página inicial: mostrar todos os posts + opção de selecionar categoria especifica + pesquisar, tipo behance
};

export default routes;

//Falta: update user info, update post + arrumar objeto "post" (definir melhores regras de negocio, tirar subtitulo, etc)

//Fazer diferente: Quando o usuário é criado, ele precisa confirmar o email para logar
    // Gera um random username que pode ser mudado depois (dessa forma, eu não vou ter pessoas espamando usernames e tals)
    // Quando ele confirmar o email, ai sim pode alterar as informações do seu perfil (username e tals)

    //Unico problema: Criar conta no email de outra pessoa e nunca confirmar o email
        // Não é um problema pois a pessoa que criou nunca vai conseguir confirmar o email, pois n tem acesso, e a pessoa que foi usada, pode simplesmente FORGOT PASSWORD

    //Não pode mudar email -- se vc mudar, apenas set isEmailVerified para false de novo
    //Pode mudar username e outras informações + change password
    //Quando você UPDATE as infos do usuario, incluindo a senha e username, nao é necessário gerar novo token pois ja sabemos que o usuário está autenticado. Porém, se ele fizer o logout, na proxima vez que ele for logar, precisará das informações corretas - O id presente no JWT nao muda

    //Comments:
    //1. Query all comments and store it in a variable "comments"
    //2. Map through all comments and check if(currentComment.replyTo !== null)
        //Se for, replyTo.replies.push(currentComment) - replyTo variable indicates what comment id the currentComment is replying to
        //Else, faz nada
