import express from "express";
import {
  createPost,
  editPost,
  likePost,
  commentPost,
  deletePost,
  loadHome,
  getUserPosts
} from "../controllers/post.controller.js";
import { protect } from "../middlewares/authMiddleware.js"; // Assuming you have an auth middleware

const router = express.Router();

router.post("/", createPost);                 
router.put("/edit", editPost); 
router.post("/like", likePost); 
router.post("/comment", commentPost);
router.post("/delete", deletePost);
router.post("/loadhome", loadHome);
router.get("/userposts", getUserPosts); // Route to get user posts by user ID

// Route to load home posts
router.get("/home", protect, loadHome);

export default router;
