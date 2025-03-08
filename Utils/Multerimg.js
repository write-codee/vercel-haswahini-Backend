import multer from "multer";
import path from "path";
   
   const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, "uploads"); 
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
          cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."), false); 
      }
  };
  
 const upload = multer({
      storage: storage,
      limits: { fileSize: 2000000}, 
      fileFilter: fileFilter,
  });
 
 
export default upload;