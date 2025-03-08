import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DbConnection from "./Utils/db.js";
import userRouter from "./Routes/userRouter.js";
import postRouter from "./Routes/BlogsRoutes.js";
import AdminRoutes from "./Routes/AdminRoutes.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");

// Agar folder exist nahi karta to bana do
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api/blog", postRouter);
app.use("/api/admin",AdminRoutes);
app.get("/",(req,res)=>
{
        res.send("hello prshant");
})

DbConnection();

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
process.on("SIGTERM", () => {
    console.log("🔴 Process Terminated!");
    process.exit(0);
  });
  
  process.on("SIGINT", () => {
    console.log("🔴 Process Interrupted!");
    process.exit(0);
  });