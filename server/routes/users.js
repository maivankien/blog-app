import express from "express"
import { myPost } from "../controllers/user.js"

const router = express.Router()

router.get('/my-post', myPost)

export default router