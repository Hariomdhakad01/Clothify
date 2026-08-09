import express from "express";
import {  register, login, googleCallback, getMe, logout } from "../controllers/auth.controller.js";
import { registerValidationRules, loginValidationRules} from "../validator/auth.validator.js";
import passport from "passport";
import {config} from "../config/config.js"
import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router()

authRouter.post("/register",registerValidationRules, register)

authRouter.post("/login",loginValidationRules, login)

authRouter.post("/logout", logout)

authRouter.get("/google", (req, res, next) => {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
        return res.status(503).json({
            message: "Google login is not configured",
            success: false,
        })
    }

    return passport.authenticate("google", {scope: ["profile", "email"]})(req, res, next)
})

authRouter.get("/google/callback", passport.authenticate("google", {
    session: false, 
    failureRedirect:config.NODE_ENV==="development"? `${config.CLIENT_URL}/login`: "/login"}),

googleCallback)


authRouter.get("/me",authenticateUser, getMe)


export default authRouter;
