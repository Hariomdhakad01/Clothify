import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import cookie from "cookie-parser"


export async function register(req,res){
    const{username, email, password} = req.body

   const isUserExist =await userModel.findOne({
    $or:[
        {username},
        {email}
    ]
   })

   if(isUserExist){
    res.status(401).json({
        message:"username or email already",
        success:false
    })
   }

   const hashPass =await bcrypt.hash(password, 10)
   

   const user =await userModel.create({
    username,
    email,
    password:hashPass
   })

   const token = jwt.sign({
    id:user._id,
   },config.JWT_SECRET,
{expiresIn:"7d"})

res.cookie("token",token)

res.status(200).json({
    message:"user Registered Successfully",
    success:true,
    user:{
        id:user._id,
        username: user.username,
        email:user.email
    }
})


}

export async function loginUser(req,res){
    // const user = req.user
    const {username , email, password} = req.body

    const user =await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        res.status(401).json({
            message:"Unauthorized",
            success:false
        })     
    }

    // const hashedPass = await bcrypt.hash(password, 10)

    const isPassValid = await bcrypt.compare(password, user.password)

    if(!isPassValid){
        res.status(400).json({
            message:"invalid password",
            success:false
        })
    }

    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET,
{expiresIn:"1d"})

res.cookie("token",token)

res.status(200).json({
    message:"user loggedin Successfully",
    success:true,
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})


}