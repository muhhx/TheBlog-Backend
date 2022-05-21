import { Express } from "express";
import { loginSessionHandler, logoutSessionHandler, verifySessionHandler } from "./controller/session.controller";
import { registerUserHandler, getUserHandler, deleteUserHandler, updateUserHandler } from "./controller/user.controller";
import { createPostHandler } from "./controller/post.controller";
import verifyUser from "./middleware/verifyUser";

function routes(app: Express) {
    //Toda vez que os dados dos currentUser mudam, gerar novo JWT
    app.put("/api/user", verifyUser, updateUserHandler);
    app.post("/api/user", registerUserHandler);
    app.delete("/api/user", verifyUser, deleteUserHandler);
    app.get("/api/user/:username", getUserHandler);
    //forgot password
    //refresh tokens
    
    app.post("/api/session", loginSessionHandler);
    app.delete("/api/session", logoutSessionHandler);
    app.get("/api/session", verifyUser, verifySessionHandler);

    app.post("/api/post", verifyUser, createPostHandler); //handle images
    //delete posts
    //update posts
    //get posts (queries and searchs, etc - what should appea to a person, etc)
};

export default routes;

//Fazer diferente: Quando o usuário é criado, ele precisa confirmar o email para logar
    // Gera um random username que pode ser mudado depois (dessa forma, eu não vou ter pessoas espamando usernames e tals)
    // Quando ele confirmar o email, ai sim pode alterar as informações do seu perfil (username e tals)

    //Unico problema: Criar conta no email de outra pessoa e nunca confirmar o email
        // Possivel solução: Criar um expiration date, ai se alguem tentar criar a conta com o mesmo email e o expirationDate ja passou, deixar criar

    //Não pode mudar email
    //Pode mudar username e outras informações + change password
    //Quando você UPDATE as infos do usuario, incluindo a senha e username, nao é necessário gerar novo token pois ja sabemos que o usuário está autenticado. Porém, se ele fizer o logout, na proxima vez que ele for logar, precisará das informações corretas - O id presente no JWT nao muda