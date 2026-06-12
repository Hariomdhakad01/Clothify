import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import cookie from "cookie-parser"



async function sendTokenResponse(user, res, message){
    const token  = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
     {expiresIn:"7d"})

res.cookie("token",token)


     res.status(200).json({
    message,
    success:true,
    user:{
        id:user._id,
        username: user.username,
        email:user.email,
        role: user.role
    }
})

}

export async function register(req,res){
    const{username, email, password,contact , isSeller} = req.body

    try {
         const isUserExist =await userModel.findOne({
    $or:[
        {contact},
        {email}
    ]
   })

   if(isUserExist){
    return res.status(400).json({
        message:"user with this email or contact already exist",
        success:false
    })
   }
   

   const user =await userModel.create({
    username,
    email,
    contact,
    password,
    role: isSeller ? "seller" : "user"
   })

   
await sendTokenResponse(user, res, "User registered Successfully")

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server error"});
        
    }
  


}

export async function login(req, res){
    const {email, password, username} = req.body

    const user = await userModel.findOne({

        $or: [
            {email},
            {username}
        ]   
})

if(!user){
    return res.status(400).json({
        message: "Invalid username or email",
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

    const { id, displayName, emails, photos } = req.user

    const email = emails[0].value;
    const profilePic = photos[0].value;

    let user = await userModel.findOne({
        $or:[
            {email}
            
        ]
    })

    if(!user){
        user = await userModel.create({
            email,
            googleId: id,
            username: displayName,
        })
    }


    const token = jwt.sign({
        id: user._id,
    },config.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.redirect("http://localhost:5173/")

    
}