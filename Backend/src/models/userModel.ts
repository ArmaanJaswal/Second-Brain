import mongoose from "mongoose";

const Schema = mongoose.Schema;

 const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
 },{timestamps:true})

 export  const User = mongoose.model("User",userSchema)