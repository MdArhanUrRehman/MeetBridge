import express from "express";
import { signup, login, addToHistory, getUserHistory } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/add_to_activity", addToHistory)
userRouter.get("/get_all_activity", getUserHistory)

export default userRouter;