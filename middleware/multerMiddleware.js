import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();

/* console.log("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set the directory where uploaded files will be stored
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    // set the name of the uploaded file
    cb(null, fileName);
  },
}); */
const upload = multer({ storage });

const parser = new DataParser();

export const formatImage = (file) => {
  console.log(file);
  const fileExtention = path.extname(file.originalname).toString();
  return parser.format(fileExtention, file.buffer).content;
};
//console.log(upload);
export default upload;
