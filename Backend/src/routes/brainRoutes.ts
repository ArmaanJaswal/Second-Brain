import express from "express";
import {
  authMiddleware,
  type AuthRequest,
} from "../middlewares/authMiddleware.js";
import { Brain } from "../models/brainModel.js";
import mongoose from "mongoose";
import crypto from 'crypto';
import { Link } from "../models/sharingLink.js";

const Router = express.Router();

Router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, link, category } = req.body;
    if (!title || !link || !category) {
      return res.status(400).json({ Message: "All fields are required" });
    }

    const newBrain = new Brain({
      title,
      link,
      category,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await newBrain.save();

    return res.status(201).json({ message: "New Brain Created", newBrain });
  } catch (err) {
    console.log("Error while logging In", err);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

Router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try{
    const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const brains = await Brain.find({ userId });

  if (brains.length===0) {
    return res.status(404).json({ message: "Create a Brain" });
  }

  return res
    .status(200)
    .json({ message: "Brains fetched successfully", brains });
  }catch(err){
    console.log("Error while fetching the brains",err);
    return res.status(400).json({message:"Internal Server Error"});
  }
});



Router.put("/:id",authMiddleware,async(req:AuthRequest,res)=>{
    try{
        const userId = req.userId;

        const {id} = req.params;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, link, category,} = req.body;
    if (!title || !link || !category) {
      return res.status(400).json({ Message: "All fields are required" });
    }

    const updatedData = {
        title:title,
        link:link,
        category:category
    }

    const updatedBrain = await Brain.findOneAndUpdate(
  { _id: id, userId },
  updatedData,
  { new: true, runValidators: true }
);

    return res.status(200).json({message:"User Updated Successfully",updatedBrain});

    }catch(err){
        console.log("Error in Brain Updation",err);
        return res.status(400).json({message:"Internal Server Error"});
    }
})

Router.delete("/:id",authMiddleware,async(req:AuthRequest,res)=>{
    try{
        
        const userId = req.userId;
        const {id} = req.params;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }
        

        const deletedBrain = await Brain.findOneAndDelete({
  _id: id,
  userId,
});

        if (!deletedBrain) {
        return res.status(404).json({
          message: "Brain not found",
        });
      }
    return res.status(200).json({message:"Brain Deleted Successfully"});

    }catch(err){
        console.log("Error in Brain Deletion",err);
        return res.status(400).json({message:"Internal Server Error"});
    }
})



Router.patch("/share/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { share } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Brain ID" });
    }

    if (typeof share !== "boolean") {
      return res.status(400).json({
        message: "Share must be a boolean",
      });
    }

    const brain = await Brain.findOne({ _id: id, userId });

    if (!brain) {
      return res.status(404).json({ message: "Brain not found" });
    }

    if (share) {
      let linkDoc = await Link.findOne({ brainId: brain._id });

      if (!linkDoc) {
        const token = crypto.randomBytes(32).toString("hex");

        linkDoc = await Link.create({
          brainId: brain._id,
          shareableLink: token,
        });
      }

      brain.share = true;
      await brain.save();

      return res.status(200).json({
        message: "Brain shared successfully",
        shareUrl: `${process.env.FRONTEND_URL}/share/${linkDoc.shareableLink}`,
      });
    }

    brain.share = false;
    await brain.save();

    await Link.deleteMany({ brainId: brain._id });

    return res.status(200).json({
      message: "Brain sharing disabled",
    });
  } catch (err) {
    console.error("Error updating sharing settings:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});




export default Router;