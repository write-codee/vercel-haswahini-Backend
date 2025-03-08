import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DbConnection from "./Utils/db.js";
import userRouter from "./Routes/userRouter.js";
import postRouter from "./Routes/BlogsRoutes.js";
import AdminRoutes from "./Routes/AdminRoutes.js";

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
process.on('SIGTERM', () => {
    console.log("Process terminated!");
    process.exit(0);
  });
  