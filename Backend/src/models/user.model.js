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
        required: false,
        unique: true,
        sparse: true
    },
     password:{
        type:String,
        required: function() {
            return !this.googleId;
        }
    },
    role:{
        type:String,
        enum:["seller", "buyer"],
        default: "buyer",
    },
    googleId:{
        type:String,
    }

}, {timestamps: true})
userSchema.pre("save", async function (){
    if(!this.isModified("password") || !this.password) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema)

export default userModel
