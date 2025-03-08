import express from "express";
import {
  ActiveBlogs,
  adminDasbordCount,
  AGetAllUser,
  AprovelStatus,
  DeactiveBlog,
  deleteUser,
  requestBlogs,
  totalAuthor,
  ChangeBloking,
  HandleDeactive,
  regectedBlogs,
  updateUser,
} from "../Controllers/AdminController.js";
import { AuthCheck } from "../Middlewares/Auth.js";
import { roleAdim } from "../Middlewares/IsRoleAdmin.js";
import { getOneBlogs } from "../Controllers/blogContrller.js";
import upload from "../Utils/Multerimg.js";

const router = express.Router();
// -------user Operations -----
router.route("/user").get(AuthCheck, roleAdim, AGetAllUser);
router.route("/deleteuser/:id").delete(AuthCheck, roleAdim, deleteUser);
router.route("/updateUser/:id").put(AuthCheck,roleAdim,upload.single('avatar'),updateUser)
router.route("/changeIsBloking/:id").put(AuthCheck, roleAdim, ChangeBloking);
router.route("/rejectedUpdate/:id").put(AuthCheck, roleAdim, HandleDeactive);
router.route("/ActiveBLog").get(AuthCheck, roleAdim, ActiveBlogs);
router.route("/DeactiveBlog").get(AuthCheck, roleAdim, DeactiveBlog);
router.route("/requestBlogs").get(AuthCheck, roleAdim, requestBlogs);
router.route("/totalAuthors").get(AuthCheck, roleAdim, totalAuthor);
router.route("/aprove/:id").put(AuthCheck, roleAdim, AprovelStatus);
router.route("/getOneBlog/:id").get(AuthCheck, roleAdim, getOneBlogs);
router.route("/DasbordCount").get(AuthCheck, roleAdim, adminDasbordCount);
router.route("/regicted").get(AuthCheck,roleAdim,regectedBlogs);
export default router;
