import cloudinary from "cloudinary";
import { Blogs } from "../Models/blogSchema.js";
import cron from "node-cron";
import { User } from "../Models/UserSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsFolder = path.join(__dirname, "../uploads"); // Uploads folder ka path

const deleteUploads = () => {
  fs.readdir(uploadsFolder, (err, files) => {
    if (err) {
      console.error("Error reading uploads directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(uploadsFolder, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });
    });
  });
};

export const blogPost = async (req, res) => {
  try {
    // Cloudinary Config
    cloudinary.config({
      cloud_name: process.env.CLUDENAME,
      api_key: process.env.ALUDEAPI_KEY,
      api_secret: process.env.CLUDE_SECRET,
    });

    const { mainImg, paraOneImg, paraTwoImg, paraThreeImg } = req.files;

    // Server Folder Cleanup (Agar Required Ho)
    deleteUploads();

    if (!mainImg) {
      return res.status(400).json({ message: "Blog Main Image is required" });
    }

    const allowedFormats = [
      "image/jpg",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    const allImages = [mainImg, paraOneImg, paraTwoImg, paraThreeImg].filter(
      Boolean
    );

    for (const img of allImages) {
      if (img && !allowedFormats.includes(img[0].mimetype)) {
        return res
          .status(400)
          .json({
            message: "Invalid file type, only JPG, PNG, JPEG, WEBP allowed",
          });
      }
    }

    const {
      title,
      introContent,
      paraOneContent,
      paraOneTitle,
      paraTwoContent,
      paraTwoTitle,
      paraThreeTitle,
      paraThreeContent,
      published,
      category,
      ShudulingDate,
    } = req.body;

    
    if (!title || !introContent) {
      return res
        .status(400)
        .json({ message: "Title and intro content are required" });
    }

    // Cloudinary Upload Function
    const cloudinaryUpload = (file) => {
      return cloudinary.uploader.upload(file.path, {
        resource_type: "image",
        folder: "blog_images",
        quality: "auto:good",
        format: "webp",
      });
    };

    // Upload Images in Parallel
    const uploadPromises = [
      cloudinaryUpload(mainImg[0]),
      paraOneImg ? cloudinaryUpload(paraOneImg[0]) : Promise.resolve(null),
      paraTwoImg ? cloudinaryUpload(paraTwoImg[0]) : Promise.resolve(null),
      paraThreeImg ? cloudinaryUpload(paraThreeImg[0]) : Promise.resolve(null),
    ];

    const [mainImgRes, paraOneImgRes, paraTwoImgRes, paraThreeImgRes] =
      await Promise.all(uploadPromises);

    // Handle Upload Errors
    if (!mainImgRes || mainImgRes.error) {
      return res.status(500).json({ message: "Error uploading main image" });
    }

    const blogData = {
      title,
      introContent,
      category,
      paraOneTitle,
      paraOneContent,
      paraTwoTitle,
      paraTwoContent,
      paraThreeTitle,
      paraThreeContent,
      createdBy: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar?.url,
      published,
      ShudulingDate,
      mainImg: { public_id: mainImgRes.public_id, url: mainImgRes.secure_url },
    };

    if (paraOneImgRes)
      blogData.paraOneImg = {
        public_id: paraOneImgRes.public_id,
        url: paraOneImgRes.secure_url,
      };
    if (paraTwoImgRes)
      blogData.paraTwoImg = {
        public_id: paraTwoImgRes.public_id,
        url: paraTwoImgRes.secure_url,
      };
    if (paraThreeImgRes)
      blogData.paraThreeImg = {
        public_id: paraThreeImgRes.public_id,
        url: paraThreeImgRes.secure_url,
      };

    const blog = await Blogs.create(blogData);

    if (blog) {
      return res
        .status(200)
        .json({ message: "Blog Created Successfully", blog });
    } else {
      return res.status(400).json({ message: "Blog creation failed" });
    }
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog note Found" });
    }
    await Blogs.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog is deleted" });
  } catch (error) {
    console.log(error);
  }
};

export const getAllblogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12; // Default limit is 12 blogs per page
    const skip = (page - 1) * limit;

    // Count total blogs
    const totalBlogs = await Blogs.countDocuments({
      published: true,
      Status: 1,
    });

    // Fetch paginated blogs
    const blogs = await Blogs.find({ published: true, Status: 1 })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      blogs,
      totalPages,
      totalBlogs,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOneBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "b;pg not Found !" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
  }
};
export const getMyblog = async (req, res) => {
  try {
    const createdBy = req.user.id;

    const Myblog = await Blogs.find({ createdBy });
    res.status(200).json(Myblog);
  } catch (error) {
    console.log(error);
  }
};

export const updateBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found !" });
    }
    const newBlog = {
      title: req.body.title,
      introContent: req.body.introContent,
      category: req.body.category,
      paraOneTitle: req.body.paraOneTitle,
      paraOneContent: req.body.paraOneContent,
      paraTwoTitle: req.body.paraTwoTitle,
      paraTwoContent: req.body.paraTwoContent,
      paraThreeTitle: req.body.paraThreeTitle,
      paraThreeContent: req.body.paraThreeContent,
      published: req.body.published,
    };
    if (req.files) {
      const { mainImg, paraOneImg, paraTwoImg, paraThreeImg } = req.files;
      const allowedFormat = ["image/jpg", "image/jpeg", "image/png"];
      if (
        (mainImg && !allowedFormat.includes(mainImg.mimetype)) ||
        (paraOneImg && !allowedFormat.includes(paraOneImg.mimetype)) ||
        (paraTwoImg && !allowedFormat.includes(paraTwoImg.mimetype)) ||
        (paraThreeImg && !allowedFormat.includes(paraThreeImg.mimetype))
      ) {
        return res
          .json(400)
          .json({ message: "Invalid file formate on PNG JPG " });
      }
      if (req.files && mainImg) {
        const blogMainImageId = blog.mainImg.public_id;
        await cloudinary.uploader.destroy(blogMainImageId);
        const newBlogMainimage = await cloudinary.uploader.upload(
          mainImg.tempFilePath
        );
        newBlog.mainImg = {
          public_id: newBlogMainimage.public_id,
          url: newBlogMainimage.secure_url,
        };
      }
      if (req.files && paraOneImg) {
        if (blog.paraOneImg) {
          const blogParaOneImage = blog.paraOneImg.public_id;
          await cloudinary.uploader.destroy(blogParaOneImage);
        }
        const newBlogParaOneImg = await cloudinary.uploader.upload(
          mainImg.tempFilePath
        );
        newBlog.paraOneImg = {
          public_id: newBlogParaOneImg.public_id,
          url: newBlogParaOneImg.secure_url,
        };
      }
      if (req.files && paraTwoImg) {
        if (blog.paraTwoImg) {
          const blogParaOneImage = blog.paraTwoImg.public_id;
          await cloudinary.uploader.destroy(blogParaOneImage);
        }
        const newBlogparaTwoImg = await cloudinary.uploader.upload(
          mainImg.tempFilePath
        );
        newBlog.paraTwoImg = {
          public_id: newBlogparaTwoImg.public_id,
          url: newBlogparaTwoImg.secure_url,
        };
      }
      if (req.files && paraThreeImg) {
        if (blog.paraThreeImg) {
          const blogParaparaThreeImg = blog.paraThreeImg.public_id;
          await cloudinary.uploader.destroy(blogParaparaThreeImg);
        }
        const newBlogParaThreeImg = await cloudinary.uploader.upload(
          mainImg.tempFilePath
        );
        newBlog.paraThreeImg = {
          public_id: newBlogParaThreeImg.public_id,
          url: newBlogParaThreeImg.secure_url,
        };
      }
    }
    blog = await Blogs.findByIdAndUpdate(id, newBlog, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ message: "Update The Blogs", blog });
  } catch (error) {
    console.log(error);
  }
};
export const MessageSending = async (req, res) => {
  try {
    const messaging = req.user.message;
    res.status(200).json(messaging);
  } catch (error) {
    console.log(error);
  }
};
export const reportBlogs = async (req, res) => {
  try {
    const blogId = req.params.id;
    const user = req.user;
    const blog = await Blogs.findById(blogId);

    if (!blog) {
      res.status(404).json({ message: "Post not Found" });
    }
    if (blog.report.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "You have already reported this post" });
    }
    await Blogs.findByIdAndUpdate(
      { _id: blogId },
      { $push: { report: user._id } }
    );
    console.log("hello");

    // const reportBlogUpdate = await Blogs.updateOne(
    //   { _id: blogId },
    //   { report: blog.report.length + 1 || 1 }
    // );
    const targetBlog = await Blogs.findById(blogId);

    if (targetBlog.report.length === 3) {
      await Blogs.updateOne({ _id: blogId }, { Status: 2 });
      return res.status(200).json({ message: "This Post Is Bloked" });
    }
    // const userUpdate = await User.updateOne(
    //   { _id: blog.createdBy },
    //   {
    //     $push: {
    //       message: {
    //         BlogTitle: blog.title,
    //         Whoreport: user,
    //         blogId: blog._id,
    //         message:
    //           "This Is Report Blog Plse Action YOu Don't action Three Report To your Blog Is Bloked !",
    //       },
    //     },
    //   }
    // );

    return res.status(200).json({ message: "Report Is Send" });
  } catch (error) {
    console.log(error);
  }
};
cron.schedule("* * * * *", async () => {
  const currentDate = new Date();

  try {
    // Fetch posts with status 'draft' and publish date <= current date
    const postsToPublish = await Blogs.find({
      ShudulingDate: { $lte: currentDate },
    });

    // Update each post's status to 'published'

    postsToPublish.forEach(async (Blogs) => {
      Blogs.published = true;
      await Blogs.save();
    });

    await Blogs.updateOne({ _id: postsToPublish._id }, { published: true });
  } catch (error) {
    console.error("Error scheduling posts:", error);
  }
});
