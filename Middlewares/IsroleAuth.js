export const isAutheryjestion = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role != "Author") {
      return res.status(400).json({ message: "You are note Author" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
