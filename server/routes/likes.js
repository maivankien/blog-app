import express from "express"
import { authUser } from "../middlewares/user.js"
import { likePost, dislikePost } from "../controllers/like.js"

const router = express.Router()

router.post('/like/:id', authUser, likePost)
router.post('/dislike/id', authUser, dislikePost)


export default router