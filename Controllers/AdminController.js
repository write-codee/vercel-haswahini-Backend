import { Blogs } from "../Models/blogSchema.js";
import { User } from "../Models/UserSchema.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteUploads } from "./blogContrller.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsFolder = path.join(__dirname, "../uploads"); // Uploads folder ka path
export const AGetAllUser = async (req, res) => {
  try {
    const alluser = await User.find({ role: { $ne: "Admin" } }).sort({
      createdOn: -1,
    });
    res.json(alluser);
  } catch (error) {
    console.log(error);
  }
};
export const updateUser = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLUDENAME,
      api_key: process.env.ALUDEAPI_KEY,
      api_secret: process.env.CLUDE_SECRET,
    });

    const { id } = req.params;
    const { name, username, email, phone, role } = req.body;

    const upDatedData = {
      name,
      username,
      email,
      phone,
      role,
    };

    if (req.file) {
      deleteUploads();
      const filePath = req.file.path;
      const response = await cloudinary.uploader.upload(filePath, {
        folder: "profile_pictures",
      });
      upDatedData.avatar = {
        public_id: response.public_id,
        url: response.secure_url,
      };
    }

    const updateData = await User.updateOne(
      { _id: id },
      {
        $set: upDatedData,
      }
    );
    if (updateData.modifiedCount > 0) {
      return res.json({ message: "Updated" });
    }
    return res.json({ message: "This Data is Same" });
  } catch (error) {
    console.log(error);
  }
};
export const ActiveBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({ Status: 1, published: true });
    res.json(blogs);
  } catch (error) {
    console.log(error);
  }
};

export const DeactiveBlog = async (_, res) => {
  try {
    const blogs = await Blogs.find({ Status: 2 }).sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (error) {
    console.log(error);
  }
};

export const requestBlogs = async (_, res) => {
  try {
    const bLogs = await Blogs.find({ Status: 0 }).sort({ createdAt: -1 });
    res.status(200).json(bLogs);
  } catch (error) {}
};

export const totalAuthor = async (_, res) => {
  try {
    const Authors = await User.find({ role: "Author" });
    res.status(200).json(Authors);
  } catch (error) {
    res.status(500).json({ message: "Internal Error for Authors" });
  }
};

export const AprovelStatus = async (req, res) => {
  try {
    const id = req.params.id;
    let { Status, message } = req.body;

    if (message) {
      const blogs = await Blogs.findOne({ _id: id });
      const userId = blogs.createdBy;
      const userMessage = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            message: {
              BlogTitle: blogs.title,
              message: message,
              blogId: blogs.id,
            },
          },
        }
      );
    }
    if (!Status) {
      Status = 2;
    }

    const update = await Blogs.findByIdAndUpdate({ _id: id }, { Status });
    res.status(200).json({ message: "Status Updated" });
  } catch (error) {
    console.log(error);
  }
};

export const adminDasbordCount = async (req, res) => {
  try {
    const totalUser = await User.countDocuments({ role: { $ne: "Admin" } });
    const blokedUser = (await User.countDocuments({ isBlocked: true })) || 0;
    const TotalAutor = (await User.countDocuments({ role: "Author" })) || 0;
    const TotalReader = (await User.countDocuments({ role: "Reader" })) || 0;
    const PrivateBlogs =
      (await Blogs.countDocuments({ published: false })) || 0;
    const PublicBlogs = (await Blogs.countDocuments({ published: true })) || 0;
    const requestBlog = (await Blogs.countDocuments({ Status: 0 })) || 0;
    const rejectBlog = (await Blogs.countDocuments({ Status: 2 })) || 0;
    const ActiveBlog =
      (await Blogs.countDocuments({ Status: 1, published: true })) || 0;
    const TotalBlogs = (await Blogs.countDocuments()) || 0;
    res.status(200).json({
      totalUser,
      blokedUser,
      TotalAutor,
      TotalReader,
      PrivateBlogs,
      PublicBlogs,
      requestBlog,
      rejectBlog,
      ActiveBlog,
      TotalBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: "internal error" });
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteData = await User.findByIdAndDelete(id);
    if (deleteData) {
      res.status(200).json({ message: "User Is Deleted" });
    } else {
      res.status(400).json({ message: "Delete Query faild" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const ChangeBloking = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;
    console.log(id);
    console.log(Status);

    const isUpdate = await User.findByIdAndUpdate(
      { _id: id },
      { isBlocked: Status }
    );
    if (isUpdate) {
      res.status(200).json({ message: "Status Updated" });
    } else {
      res.status(401).json({ message: "Status is faild" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const HandleDeactive = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blogs.findByIdAndUpdate(
      { _id: id },
      { Status: 2 }
    );
    if (updatedBlog) {
      res.status(200).json({ message: "Rejected" });
    } else {
      res.status(401).json({ message: "Not Query Reject" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const regectedBlogs = async (req, res) => {
  try {
    const reportedBlogs = await Blogs.find({ report: { $in: [1, 2, 3] } });
    res.status(200).json(reportedBlogs);
  } catch (error) {
    console.log(error);
  }
};
