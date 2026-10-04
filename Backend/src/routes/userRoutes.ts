import express from "express";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
const Router = express.Router();

Router.post("/signup",async (req,res)=>{
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const hashedPassword =await bcrypt.hash(password,5);
     const user =await new User({
        username,
        email,
        password:hashedPassword
    })

    await user.save();

    return res.status(201).json({message:"User Created Successfully"});
})


Router.post("/login",async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const foundUser = await User.findOne({email});

    if(!foundUser){
        return res.status(404).json({message:"User doesn't exist. Please signUp"})
    }

    const comparePassword =await bcrypt.compare(password,foundUser.password);

    if(!comparePassword){
        return res.status(400).json({message:"Invalid Credentials"})
    }
    if(!process.env.JWT_SECRET){
        return res.status(400).json({message:"Internal Server Error"});
    }
    const token = jwt.sign({id: foundUser._id},process.env.JWT_SECRET);
    

    return res.status(200).json({message:"User logged in successfully",token});
})

export default Router;