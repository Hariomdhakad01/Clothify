import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variable")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variable")
}

export const config={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    PORT: process.env.PORT || 3000,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET || "",
    NODE_ENV:process.env.NODE_ENV || "development",
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY || "",
    PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || "razorpay",
    // RAZORPAY CODE START - env keys kept together for easy removal.
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
    // RAZORPAY CODE END
}
