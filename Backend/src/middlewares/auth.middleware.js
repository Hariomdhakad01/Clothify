import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export async function authUser(req,res,next){


    const token = req.cookies.token


    if(!token){
        res.status(402).json({
            message:"Unautorized User",
            success:false
        })
    }

    try {
        
    const decoded = jwt.verify(token,config.JWT_SECRET)
    req.user = decoded
    next()

    } catch (error) {

      return res.status(401).json({
            message: "Invalid token",
            success: false,
        })
    } 

}