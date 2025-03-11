import express from "express";
import {
  blogPost,
  deleteBlog,
  getAllblogs,
  getMyblog,
  getOneBlogs,
  MessageSending,
  reportBlogs,
  ResentBlog,
  updateBlogs,
} from "../Controllers/blogContrller.js";
import { AuthCheck } from "../Middlewares/Auth.js";
import upload from "../Utils/Multerimg.js";
import { isAutheryjestion } from "../Middlewares/IsroleAuth.js";
const router = express.Router();

router.post(
  "/post",
  AuthCheck,
  isAutheryjestion,
  upload.fields([
    { name: "mainImg", maxCount: 1 },
    { name: "paraOneImg", maxCount: 1 },
    { name: "paraTwoImg", maxCount: 1 },
    { name: "paraThreeImg", maxCount: 1 },
  ]),
  blogPost
);
router.route("/delete/:id").delete(AuthCheck, isAutheryjestion, deleteBlog);
router.route("/all").get(getAllblogs);
router.route("/singleBlog/:id").get(AuthCheck, getOneBlogs);
router.route("/getMyblog").get(AuthCheck, isAutheryjestion, getMyblog);
router.route("/updateBlog/:id").put(
  AuthCheck,
  isAutheryjestion,
  upload.fields([
    { name: "mainImg", maxCount: 1 },
    { name: "paraOneImg", maxCount: 1 },
    { name: "paraTwoImg", maxCount: 1 },
    { name: "paraThreeImg", maxCount: 1 },
  ]),
  updateBlogs
);
router.route("/messageSending").get(AuthCheck,isAutheryjestion,MessageSending)
router.route("/blogReport/:id").put(AuthCheck,reportBlogs)
router.get("/resentBlogs",ResentBlog)
export default router;
