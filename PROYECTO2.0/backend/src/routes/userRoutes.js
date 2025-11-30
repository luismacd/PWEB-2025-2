import express from "express";
import userController from "../controllers/userController.js";
import { isAdmin , isAuthenticated } from "../middleware/auth.js";
const userRouter = express.Router();

//con permisos de administrador

userRouter.get("/",isAdmin, userController.getUsers); //todos
userRouter.get("/:id",isAdmin, userController.getUser); //uno
userRouter.put("/:id", isAdmin ,userController.updateUser);
userRouter.delete("/:id", isAdmin, userController.deleteUser);

//propios del usuario
//solo debe estar autenticado
userRouter.get("/me",isAuthenticated, userController.getMe);
userRouter.put("/me", isAuthenticated ,userController.updateMe);

export default userRouter;