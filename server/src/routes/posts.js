import express from "express"
import {
    addPost,
    deletePost,
    getPost,
    getPosts,
    updatePost,
    searchPost
} from "../controllers/post.js"

const router = express.Router()

router.get("/search", searchPost)
router.get("/", getPosts)
router.get("/:id", getPost)
router.post("/", addPost)
router.delete("/:id", deletePost)
router.put("/:id", updatePost)

export default router
