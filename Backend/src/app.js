import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import authRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import morgan from "morgan"
import cors from "cors"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {config} from "../src/config/config.js"
import cookieParser from "cookie-parser"

const app= express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors({
    origin: config.CLIENT_URL,
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use(passport.initialize());

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    }, (accessToken, refreshToken, profile, done)=>{
        return done(null, profile);
    }))
}

app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.use("/api/payments", paymentRouter)

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        success: false,
    })
})

export default app;
