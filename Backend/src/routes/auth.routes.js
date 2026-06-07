import express from "express";
import {  register, login } from "../controllers/auth.controller.js";
import { registerValidationRules, loginValidationRules} from "../validator/auth.validator.js";

const authRouter = express.Router()

authRouter.post("/register",registerValidationRules, register)

authRouter.post("/login",loginValidationRules, login)



export default authRouter;
