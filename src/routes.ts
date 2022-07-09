import { Express } from "express";
import {
  loginSessionHandler,
  logoutSessionHandler,
  refreshTokenHandler,
  verifySessionHandler,
  googleOauthHandler,
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
  updatePasswordHandler,
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
import {
  postCommentHandler,
  deleteCommentHandler,
  updateCommentHandler,
  getCommentsHandler,
} from "./controller/comment.controller";
import { getBackgroundHandler } from "./controller/background.controller";
import verifyUser from "./middleware/verifyUser";
import errorHandling from "./middleware/errorHandling";

function routes(app: Express) {
  app.get("/api/background", getBackgroundHandler); //DONE

  app.put("/api/user", verifyUser, updateUserHandler); //DONE
  app.put("/api/user/password", verifyUser, updatePasswordHandler); //DONE
  app.post("/api/user", registerUserHandler); //DONE
  app.put("/api/user/delete", verifyUser, deleteUserHandler); //DONE

  app.get("/api/user/:username", getUserHandler); //DONE
  app.get("/api/user/:username/followers", userFollowersHandler); //DONE
  app.get("/api/user/:username/following", userFollowingHandler); //DONE
  app.get("/api/user/:username/posts", getUserPostsHandler); //DONE
  app.get("/api/user/:username/favorites", verifyUser, userFavoritesHandler); //DONE

  app.post("/api/forgotpassword", forgotPasswordHandler); //DONE (Problema, email n ta chegando usuario)
  app.put("/api/resetpassword/:resetToken", resetPassowrdHandler); //DONE
  app.post("/api/confirmemail", confirmEmailHandler); //DONE
  app.put("/api/confirmemail/:confirmToken", validateEmailHandler); //DONE

  app.get("/api/session/oauth/google", googleOauthHandler);
  app.post("/api/session", loginSessionHandler); //DONE
  app.delete("/api/session", logoutSessionHandler); //DONE
  app.get("/api/session", verifyUser, verifySessionHandler); //DONE
  app.put("/api/session", refreshTokenHandler); //DONE

  app.post("/api/follow/:targetId", verifyUser, userFollowHandler); //DONE
  app.delete("/api/follow/:targetId", verifyUser, userUnfollowHandler); //DONE

  app.post("/api/post", verifyUser, createPostHandler); //DONE
  app.delete("/api/post/:postId", verifyUser, deletePostHandler); //DONE -- REMOVER TODOS OS LIKES E SALVOS RELACIONADOS A ESSE POST
  app.put("/api/post/:postId", verifyUser, updatePostHandler);
  app.get("/api/post/:slug", getPostHandler); //DONE
  app.get("/api/post", getPostsHandler); //Add pagination + filters (specific tag, metatag or title research) + personalized content based on what the user likes (what tags did he liked. what types of tags he sees everyday, etc. - 10 posts per page (5 what he MOST like, 3 other tags that he likes 2 recomendations))

  app.post("/api/favorite/:postId", verifyUser, saveFavoriteHandler); //DONE
  app.delete("/api/favorite/:postId", verifyUser, deleteFavoriteHandler); //DONE
  app.put("/api/favorite/:postId", checkFavoriteHandler); //DONE

  app.post("/api/upvote/:postId", verifyUser, postUpvoteHandler); //DONE
  app.delete("/api/upvote/:postId", verifyUser, deleteUpvoteHandler); //DONE
  app.get("/api/upvote/:postId", getUpvoteHandler); //DONE

  app.get("/api/comment/:postId", getCommentsHandler); //DONE
  app.post("/api/comment/:postId", verifyUser, postCommentHandler); //DONE
  app.delete("/api/comment/:commentId", verifyUser, deleteCommentHandler); //DONE
  app.put("/api/comment/:commentId", verifyUser, updateCommentHandler); //DONE

  app.use(errorHandling);
}

export default routes;
