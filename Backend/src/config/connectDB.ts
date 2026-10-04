import mongoose from "mongoose";


export const connectDB =async ()=>{
    try{

        if(!process.env.MONGO_URI){
            return;;
        }
        
        await mongoose.connect(process.env.MONGO_URI)
    }catch(err){
        console.log("Error in mongoDB connection");
    }
}