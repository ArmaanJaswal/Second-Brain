import mongoose from "mongoose";

const Schema = mongoose.Schema;

const brainSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    link:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        enum:["twitter","youtube","document","other"],
        required:true,
    },
    share:{
        type:Boolean,
        default:false
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
})

export const Brain = mongoose.model("Brain",brainSchema);