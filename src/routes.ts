import { Express } from "express";
import { registerUserHandler, getUserHandler, deleteUserHandler } from "./controller/user.controller";
import { loginSessionHandler, logoutSessionHandler, verifySessionHandler } from "./controller/session.controller";
import verifyUser from "./middleware/verifyUser";

function routes(app: Express) {
    // /api/user POST (Register new user)
    // /api/user/:id PUT (Update user information, update role, change password) A
    // /api/user/:id DELETE (Delete user) A
    // /api/user/:id GET (Get a specific user)
    app.post("/api/user", registerUserHandler);
    app.get("/api/user/:username", getUserHandler);
    app.delete("/api/user/:username", verifyUser, deleteUserHandler);
    
    // RECUPERAR SENHA
    // VERIFICAR EMAIL

    // /api/session POST (Login)
    // /api/session DELETE (Logout) A
    // /api/session GET (Verify session) A
    app.post("/api/session", loginSessionHandler);
    app.delete("/api/session", logoutSessionHandler);
    app.get("/api/session", verifyUser, verifySessionHandler);
    
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

    // /api/newsletter POST (Submit email to newsletter)
};

export default routes;
