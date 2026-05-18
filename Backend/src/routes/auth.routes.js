import express from "express";
import { loginUser, register } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", loginUser)



export default authRouter;
