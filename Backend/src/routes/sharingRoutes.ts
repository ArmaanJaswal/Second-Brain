import express from "express";
import { Link } from "../models/sharingLink.js";
import { Brain } from "../models/brainModel.js";

const Router = express.Router();

Router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const linkDoc = await Link.findOne({
      shareableLink: token,
    });

    if (!linkDoc) {
      return res.status(404).json({
        message: "Shared Brain doesn't exist",
      });
    }

    const brain = await Brain.findOne({
      _id: linkDoc.brainId,
      share: true,
    }).select("title link category");

    if (!brain) {
      return res.status(404).json({
        message: "Shared Brain not found or sharing is disabled",
      });
    }

    return res.status(200).json({
      message: "Brain fetched successfully",
      brain,
    });
  } catch (err) {
    console.error("Error fetching shared Brain:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default Router;