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
    res.status(400).json({
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

// export async function loginUser(req,res){
//     // const user = req.user
//     const {username , email, password} = req.body

//     const user =await userModel.findOne({
//         $or:[
//             {contact},
//             {email}
//         ]
//     })
//     if(!user){
//         res.status(401).json({
//             message:"Unauthorized",
//             success:false
//         })     
//     }

    // const hashedPass = await bcrypt.hash(password, 10)

    // const isPassValid = await bcrypt.compare(password, user.password)

    // if(!isPassValid){
    //     res.status(400).json({
    //         message:"invalid password",
    //         success:false
    //     })
    // }


    // await sendTokenResponse(user)

//     const token = jwt.sign({
//         id:user._id
//     },config.JWT_SECRET,
// {expiresIn:"1d"})

// res.cookie("token",token)

// res.status(200).json({
//     message:"user loggedin Successfully",
//     success:true,
//     user:{
//         id:user._id,
//         username:user.username,
//         email:user.email
//     }
// })


// }