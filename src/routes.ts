import { Express } from "express";
import { registerUserHandler } from "./controller/user.controller";
import { loginSessionHandler } from "./controller/session.controller";

function routes(app: Express) {
    app.post("/api/user", registerUserHandler);

    app.post("/api/session", loginSessionHandler);

    // /api/user POST (Register new user)
    // /api/user/:id PUT (Update user, update role or name for example)
    // /api/user/:id DELETE (Delete user)

    // /api/session POST (Login)
    // /api/session DELETE (Logout)
    // /api/session GET (Verify session)
    
    // /api/blog POST (Create post)
    // /api/blog DELETE (Delete post)
    // /api/blog PUT (Update blog post)
    // /api/blog GET (Get all blog posts)
    // /api/blog/:id GET (Get specific blog post)
    // /api/blog/q?=queries GET (pagination getting posts by page) => In order to get home projects, just query for them instead of creating a new route

    // /api/newsletter POST (Submit email to newsletter)
};

export default routes;
