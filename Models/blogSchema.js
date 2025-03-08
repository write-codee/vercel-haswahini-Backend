import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      requires: true,
      minLength: [8, "Blog title must containt at least 10 character"],
      maxLength: [100, "Blog title cannot exceed 40 character"],
      trim: true,
    },
    mainImg: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    introContent: {
      type: String,
      required: true,
      minLength: [250, "Blog intro must contant 250 character"],
      trim: true,
    },
    paraOneImg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    paraOneContent: {
      type: String,
      minLength: [50, "Blog intro must contant 50 character"],
    },
    paraOneTitle: {
      type: String,
      minLength: [10, "Blog title must contant 20  character"],
    },
    paraTwoImg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    paraTwoContent: {
      type: String,
      minLength: [50, "Blog intro must contant 50 character"],
    },
    paraTwoTitle: {
      type: String,
      minLength: [10, "Blog title must contant 20  character"],
    },
    paraThreeImg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    paraThreeContent: {
      type: String,
      minLength: [50, "Blog intro must contant 50 character"],
    },
    paraThreeTitle: {
      type: String,
      minLength: [20, "Blog title must contant 20  character"],
    },
    category: {
      type: String,
      required:true
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorAvtar: {
      type: String,
    },
    published: {
      type: Boolean,
      default: true,
    },
    ShudulingDate: {
      type: Date,
    },
    Status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1,
    },

    // report:{
    //   type:Number,
    // }
    report: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Blogs = mongoose.model("Blogs", blogSchema);
