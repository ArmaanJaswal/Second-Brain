
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sharingLinkSchema = new Schema(
  {
    brainId: {
      type: Schema.Types.ObjectId,
      ref: "Brain",
      required: true,
    },
    shareableLink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Link = mongoose.model("Link", sharingLinkSchema);
