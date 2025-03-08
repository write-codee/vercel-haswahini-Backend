import { User } from "../Models/UserSchema.js";
import bcrptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const reg = async (req, res) => {
  try {
    const { name, email, password, phone, role, username } = req.body;
    if (role === "Admin") {
      return res.status(404).json({ message: `${role} is Note allwoed` });
    }
    if (!name || !email || !password || !phone || !role) {
      return res.status(401).json({ message: "plse full fill detals" });
    }
    const user = await User.findOne({ email });
    console.log(user);

    if (user) {
      return res.status(402).json({ message: "Email alreday exites" });
    }
    const Validusername = await User.findOne({ username });
    if (Validusername) {
      return res.status(402).json({ message: "User name Already exites" });
    }

    const hasPsw = await bcrptjs.hash(password, 10);
    const docs = await User.create({
      name,
      email,
      password: hasPsw,
      phone,
      role,
      username,
    });
    const token = jwt.sign({ id: docs._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "user register", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if ((!email && !password && !username && !phone) || !role) {
      return res.status(400).json({ message: "Plse fill Properly" });
    }
    const userExites = await User.findOne({
      $or: [{ email }, { username: email }, { phone: email }],
    });
    if (!userExites) {
      return res.status(200).json({ message: "User not exites" });
    }
    const onePsw = await bcrptjs.compare(password, userExites.password);
    if (!onePsw) {
      return res.status(401).json({ message: "Invalid email and password" });
    }
    if (userExites.role !== role) {
      return res.status(401).json({ message: `Not a ${role} Found` });
    }
    const token = jwt.sign({ id: userExites._id }, process.env.SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.log(error);
  }
};

const getOneUser = async (req, res) => {
  try {
    const UserData = req.user;
    res.status(200).json(UserData);
  } catch (error) {
    console.log(error);
  }
};
const getAllAuthor = async (req, res) => {
  try {
    const allUthor = await User.find({ role: "Author" }, { password: 0 });
    if (!allUthor) {
      return res.status(401).json({ message: "Not A Find Author" });
    }
    res.status(200).json(allUthor);
  } catch (error) {
    console.log(error);
  }
};
export { reg, login, getOneUser, getAllAuthor };
