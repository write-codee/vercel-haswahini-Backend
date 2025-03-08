import Category from "../Models/Catogury.js";

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.json({ message: "categoryName is not provide" });
    }
   await Category.create({ name: categoryName });
    res.json({ message: "Adding success" });
  } catch (error) {
    res.status(400).json({message:"This Category is Added"})
  }
};
const getAllCategory = async (req, res) => {
  try {
    const allCat = await Category.find();
    if (!allCat) {
      return res.status(400).json({ message: "No Data" });
    }
    res.status(200).json(allCat);
  } catch (error) {
    console.log(error);
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Sucessfuly" });
  } catch (error) {
    console.log(error);
  }
};
const updateCategorey = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    await Category.findByIdAndUpdate({ _id: id }, { $set: { name: name } });
    res.status(200).json({ message: "Data is Updated" });
  } catch (error) {
    console.log(error);
  }
};

export { addCategory, getAllCategory, deleteCategory, updateCategorey };
