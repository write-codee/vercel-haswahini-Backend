import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  });
const Category = mongoose.model("category",categorySchema);
export default Category;
