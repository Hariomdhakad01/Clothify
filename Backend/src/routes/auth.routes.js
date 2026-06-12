import express from "express";
import {  register, login, googleCallback } from "../controllers/auth.controller.js";
import { registerValidationRules, loginValidationRules} from "../validator/auth.validator.js";
import passport from "passport";
import {config} from "../config/config.js"

const authRouter = express.Router()

authRouter.post("/register",registerValidationRules, register)

authRouter.post("/login",loginValidationRules, login)

authRouter.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))

authRouter.get("/google/callback", passport.authenticate("google", {
    session: false, 
    failureRedirect:config.NODE_ENV==="development"? "http://localhost:5173/login": "/login"}),

googleCallback)

export default authRouter;
