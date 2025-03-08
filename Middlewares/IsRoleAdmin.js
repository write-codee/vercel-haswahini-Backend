export const roleAdim = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({ message: "You Are Not Admin" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
