import jwt from "jsonwebtoken";
import express from "express";
import { User } from "../models/userModel.js";

import type { Response, Request, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (req: AuthRequest,res: Response,next: NextFunction,) => {
    try{
        const token = req.headers.token;

  if (!token) {
    return res.status(400).json({ message: "Please Login First" });
  }

  if (typeof token != "string") {
    return res.status(401).json({ message: "Please login first" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(400).json({ message: "JWT_SECRET not found" });
  }
  const decrypted = jwt.verify(token, process.env.JWT_SECRET);

  if (typeof decrypted === "string" || !("id" in decrypted)) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
  const { id } = decrypted;
  const foundUser = await User.findById(id);

  if (!foundUser) {
    return res.status(400).json({ message: "Please Login first" });
  }

  req.userId = foundUser._id.toString();

  next();
    }catch(err){
        return res.status(400).json({message:"Internal Server Error"});
        console.log("Error in authMiddleware ",err);
    }
};
