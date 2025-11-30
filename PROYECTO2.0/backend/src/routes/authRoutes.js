import express from "express";
import { register, login, me } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
// Returns current user if token is valid
authRouter.get("/me", isAuthenticated, me);

export default authRouter;