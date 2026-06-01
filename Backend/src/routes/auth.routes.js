import express from "express";
import {  register } from "../controllers/auth.controller.js";
import { registerValidationRules, loginValidationRules } from "../validator/auth.validator.js";
// loginUser,
const authRouter = express.Router()

authRouter.post("/register",registerValidationRules, register)
// authRouter.post("/login",loginValidationRules, loginUser)



export default authRouter;
