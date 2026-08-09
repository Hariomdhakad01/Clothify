import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

function getCookieOptions(){
    return {
        httpOnly: true,
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        secure: config.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}

async function sendTokenResponse(user, res, message){
    const token  = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
     {expiresIn:"7d"})

    res.cookie("token",token, getCookieOptions())

    res.status(200).json({
        message,
        success:true,
        user:{
            id:user._id,
            username: user.username,
            email:user.email,
            contact: user.contact,
            role: user.role
        }
    })
}

export async function register(req,res){
    const { email, password, contact, isSeller } = req.body
    const username = (req.body.username || req.body.name || "").trim()

    try {
        const isUserExist =await userModel.findOne({
            $or:[
                {username},
                {email},
                ...(contact ? [{contact}] : [])
            ]
        })

        if(isUserExist){
            return res.status(400).json({
                message:"user with this email, username, or contact already exist",
                success:false
            })
        }
   
        const user =await userModel.create({
            username,
            email,
            contact,
            password,
            role: isSeller ? "seller" : "buyer"
        })

        await sendTokenResponse(user, res, "User registered Successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server error", success: false});
    }
}

export async function login(req, res){
    const {email, password, username} = req.body

    const user = await userModel.findOne({
        $or: [
            ...(email ? [{email}] : []),
            ...(username ? [{username}] : [])
        ]   
    })

    if(!user){
        return res.status(400).json({
            message: "Invalid username or email",
            success: false
        })
    }

    if(!user.password){
        return res.status(400).json({
            message:"Please continue with Google for this account",
            success: false
        })
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(400).json({
            message:"Invalid Password",
            success: false
        })
    }

    await sendTokenResponse(user, res, "User logged in Successfully")
}

export async function googleCallback(req, res){
    const { id, displayName, emails } = req.user

    const email = emails[0].value;

    let user = await userModel.findOne({ email })

    if(!user){
        user = await userModel.create({
            email,
            googleId: id,
            username: displayName.replace(/\s+/g, "_").slice(0, 15),
        })
    }

    const token = jwt.sign({
        id: user._id,
    },config.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("token", token, getCookieOptions())
    res.redirect(config.CLIENT_URL)
}

export async function getMe(req, res){
    const user = req.user;

    res.status(200).json({
        message: "User fetched Successfully",
        success: true,
        user:{
            id: user._id,
            email: user.email,
            contact: user.contact,
            username: user.username,
            role: user.role
        }
    })
}

export async function logout(req, res){
    res.clearCookie("token", getCookieOptions())
    res.status(200).json({
        message: "User logged out Successfully",
        success: true,
    })
}

