import { Express } from "express";
import { registerUserHandler } from "./controller/user.controller";
import { loginSessionHandler, logoutSessionHandler, verifySessionHandler } from "./controller/session.controller";
import verifyUser from "./middleware/verifyUser";

function routes(app: Express) {
    // /api/user POST (Register new user)
    // /api/user/:id PUT (Update user information, update role, change password) A
    // /api/user/:id DELETE (Delete user) A
    // RECUPERAR SENHA
    app.post("/api/user", registerUserHandler);

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

    // /api/comment POST (post a comment)
    // /api/comment/:id DELETE (Delete comment)
    // /api/comment/:id PUT (Update comment)
    // /api/comment?user=userId GET (Query user's comments)
    // /api/comment?post=postId GET (Query post's comments)

    // /api/newsletter POST (Submit email to newsletter)
};

export default routes;
