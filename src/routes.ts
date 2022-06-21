import { Express } from "express";
import {
  loginSessionHandler,
  logoutSessionHandler,
  refreshTokenHandler,
  verifySessionHandler,
} from "./controller/session.controller";
import {
  registerUserHandler,
  getUserHandler,
  deleteUserHandler,
  updateUserHandler,
  forgotPasswordHandler,
  resetPassowrdHandler,
  confirmEmailHandler,
  validateEmailHandler,
} from "./controller/user.controller";
import {
  createPostHandler,
  deletePostHandler,
  updatePostHandler,
  getPostHandler,
  getPostsHandler,
  getUserPostsHandler,
} from "./controller/post.controller";
import {
  userFollowHandler,
  userUnfollowHandler,
  userFollowersHandler,
  userFollowingHandler,
} from "./controller/follow.controller";
import verifyUser from "./middleware/verifyUser";
import {
  deleteFavoriteHandler,
  saveFavoriteHandler,
  userFavoritesHandler,
  checkFavoriteHandler,
} from "./controller/favorite.controller";
import {
  deleteUpvoteHandler,
  getUpvoteHandler,
  postUpvoteHandler,
} from "./controller/upvote.controller";
import { getBackgroundHandler } from "./controller/background.controller";

function routes(app: Express) {
  app.get("/api/background", getBackgroundHandler); //DONE

  app.put("/api/user", verifyUser, updateUserHandler);
  app.post("/api/user", registerUserHandler); //DONE
  app.delete("/api/user", verifyUser, deleteUserHandler);

  app.get("/api/user/:username", getUserHandler); //DONE
  app.get("/api/user/:username/followers", userFollowersHandler); //DONE
  app.get("/api/user/:username/following", userFollowingHandler); //DONE
  app.get("/api/user/:username/posts", getUserPostsHandler); //DONE
  app.get("/api/user/:username/favorites", verifyUser, userFavoritesHandler); //DONE

  app.post("/api/forgotpassword", forgotPasswordHandler); //DONE (Problema, email n ta chegando usuario)
  app.put("/api/resetpassword/:resetToken", resetPassowrdHandler); //DONE
  app.post("/api/confirmemail", confirmEmailHandler); //DONE
  app.put("/api/confirmemail/:confirmToken", validateEmailHandler); //DONE

  app.post("/api/session", loginSessionHandler); //DONE
  app.delete("/api/session", logoutSessionHandler); //DONE
  app.get("/api/session", verifyUser, verifySessionHandler); //DONE
  app.put("/api/session", refreshTokenHandler); //DONE

  app.post("/api/follow/:targetId", verifyUser, userFollowHandler); //DONE
  app.delete("/api/follow/:targetId", verifyUser, userUnfollowHandler); //DONE

  app.post("/api/post", verifyUser, createPostHandler); //DONE
  app.delete("/api/post/:postId", verifyUser, deletePostHandler); //DONE
  app.put("/api/post/:postId", verifyUser, updatePostHandler);
  app.get("/api/post/:slug", getPostHandler); //DONE
  app.get("/api/post", getPostsHandler); //Add pagination + filters (specific tag, metatag or title research) + personalized content based on what the user likes (what tags did he liked. what types of tags he sees everyday, etc. - 10 posts per page (5 what he MOST like, 3 other tags that he likes 2 recomendations))

  app.post("/api/favorite/:postId", verifyUser, saveFavoriteHandler);
  app.delete("/api/favorite/:postId", verifyUser, deleteFavoriteHandler);
  app.put("/api/favorite/:postId", checkFavoriteHandler); //DONE

  app.post("/api/upvote/:postId", verifyUser, postUpvoteHandler); //DONE
  app.delete("/api/upvote/:postId", verifyUser, deleteUpvoteHandler); //DONE
  app.get("/api/upvote/:postId", getUpvoteHandler);

  //api/comment/:postId POST Auth (Comment on a post)
  //api/comment/:postId DELETE Auth (Delete comment)
  //api/comment/:postId GET (Get posts' comments)
  //api/comment/:postId/upvote POST (Upvote comment)
  //api/comment/:postId/upvote DELETE (Remote comments upvote)
  //api/comment/:postId/upvote GET (get comments upvotesCount)

  //Tags (Post tags, user tags)
  //Comment
  //Notification -- Usar axios interceptors pra toda vez q eu curtir, seguir, etc, criar uma notificação no banco de dados
}

export default routes;

//Falta: update user info, update post + arrumar objeto "post" (definir melhores regras de negocio, tirar subtitulo, etc)

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
