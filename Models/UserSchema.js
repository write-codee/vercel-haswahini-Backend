import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 character"],
    maxLength: [32, "Name cannot exced 32 character"],
  },
  username:{
    type:String,
    required:true,
    unique:true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    minLength:10,
    maxLength:10,
    trim: true,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["Reader", "Author"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "password must contain at least 8 character"],
    trim: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  message: [
    {
      BlogTitle: {
        type: String,
      },
      message: {
        type: String,
      },
      Whoreport: {
        type: Object,
      },
      blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogs",
      },
    },
  ],
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model("User", userSchema);
