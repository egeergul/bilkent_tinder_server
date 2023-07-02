import express from "express";
import { completeLogin, completeSignUp, login, verify } from "../controllers/login_controller.js";
import { getLoggedInUser, getOtherUser } from "../controllers/user_controller.js";


const userRouter = express.Router();

userRouter.post("/login", login );
userRouter.post("/verify", verify );
userRouter.post("/complete-login", completeLogin );
userRouter.post("/complete-signup", completeSignUp );
userRouter.get("/me", getLoggedInUser );
userRouter.get("/other", getOtherUser );

export default userRouter;