const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  getPost,
  deletePost,
  addImage,
} = require("../controllers/postController");
const { authenticateUser } = require("../middleware/authUser");
const { upload } = require("../middleware/uploadImage");

router.post("/create-post", authenticateUser, createPost);
router.get("/get-post/:post_id", authenticateUser, getPost);
router.put("/update-post/:post_id", authenticateUser, updatePost);
router.delete("/delete-post/:post_id", authenticateUser, deletePost);
router.post(
  "/upload-image/:post_id",
  upload.array("images", 1),
  authenticateUser,
  addImage
);

module.exports = router;
