import { Express } from "express";
import { loginSessionHandler, logoutSessionHandler, verifySessionHandler } from "./controller/session.controller";
import { registerUserHandler, getUserHandler, deleteUserHandler, updateUserHandler } from "./controller/user.controller";
import { createPostHandler } from "./controller/post.controller";
import verifyUser from "./middleware/verifyUser";

function routes(app: Express) {
    app.put("/api/user", verifyUser, updateUserHandler); //Change password OR change basic user info/username
    app.post("/api/user", registerUserHandler); //Verify email (cant change after)
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
