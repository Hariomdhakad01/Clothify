import mongoose from "mongoose"
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    contact:{
        type:String,
        required: true,
        unique: true
    },
     password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["seller", "user"],
        default: "user",
        required: true,
    }

})
userSchema.pre("save", async function (){
    if(!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash
})

userSchema.method.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema)

export default userModel