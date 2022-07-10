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
  getUserPostsHandler,
  getDiscoverHandler,
  getForyouHandler,
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
  app.get("/api/background", getBackgroundHandler);

  app.put("/api/user", verifyUser, updateUserHandler);
  app.put("/api/user/password", verifyUser, updatePasswordHandler);
  app.post("/api/user", registerUserHandler);
  app.put("/api/user/delete", verifyUser, deleteUserHandler);

  app.get("/api/user/:username", getUserHandler);
  app.get("/api/user/:username/followers", userFollowersHandler);
  app.get("/api/user/:username/following", userFollowingHandler);
  app.get("/api/user/:username/posts", getUserPostsHandler);
  app.get("/api/user/:username/favorites", verifyUser, userFavoritesHandler);
  app.get("/api/user/:id/foryou", verifyUser, getForyouHandler);

  app.post("/api/forgotpassword", forgotPasswordHandler);
  app.put("/api/resetpassword/:resetToken", resetPassowrdHandler);
  app.post("/api/confirmemail", confirmEmailHandler);
  app.put("/api/confirmemail/:confirmToken", validateEmailHandler);

  app.get("/api/session/oauth/google", googleOauthHandler);
  app.post("/api/session", loginSessionHandler);
  app.delete("/api/session", logoutSessionHandler);
  app.get("/api/session", verifyUser, verifySessionHandler);
  app.put("/api/session", refreshTokenHandler);

  app.post("/api/follow/:targetId", verifyUser, userFollowHandler);
  app.delete("/api/follow/:targetId", verifyUser, userUnfollowHandler);

  app.post("/api/post", verifyUser, createPostHandler);
  app.delete("/api/post/:postId", verifyUser, deletePostHandler);
  app.put("/api/post/:postId", verifyUser, updatePostHandler);
  app.get("/api/post/:slug", getPostHandler);
  app.get("/api/post", getDiscoverHandler);

  app.post("/api/favorite/:postId", verifyUser, saveFavoriteHandler);
  app.delete("/api/favorite/:postId", verifyUser, deleteFavoriteHandler);
  app.put("/api/favorite/:postId", checkFavoriteHandler);

  app.post("/api/upvote/:postId", verifyUser, postUpvoteHandler);
  app.delete("/api/upvote/:postId", verifyUser, deleteUpvoteHandler);
  app.get("/api/upvote/:postId", getUpvoteHandler);

  app.get("/api/comment/:postId", getCommentsHandler);
  app.post("/api/comment/:postId", verifyUser, postCommentHandler);
  app.delete("/api/comment/:commentId", verifyUser, deleteCommentHandler);
  app.put("/api/comment/:commentId", verifyUser, updateCommentHandler);

  app.use(errorHandling);
}

export default routes;
