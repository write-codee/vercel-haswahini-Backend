import multer from "multer";
import fs from "fs";
import path from "path";

// ✅ Uploads folder ko define karo
const uploadDir = path.join(process.cwd(), "uploads");

// ✅ Agar folder exist nahi karta to bana do
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ Yahan correct path set karo
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: fileFilter,
});

export default upload;
