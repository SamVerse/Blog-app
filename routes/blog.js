import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { handleBlogUpload, handleCreateComment, handleDeleteBlog, handleDetailedViewBlog } from "../controllers/blog.js";


const router = express.Router();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user._id;
    const uploadPath = path.join(
      __dirname,
      "../public/images/uploads",
      userId.toString()
    );

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user,
    currentPath: req.path
  });
});

router.get('/:id' , handleDetailedViewBlog);

router.post("/", upload.single("coverImage"), handleBlogUpload);

router.post('/comment/:id', handleCreateComment);

router.delete('/delete/:id', handleDeleteBlog);

export default router;
