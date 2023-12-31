import dotenv from 'dotenv'
import path from 'path'
import express from "express"
import authRoutes from "./src/routes/auth.js"
import userRoutes from "./src/routes/users.js"
import postRoutes from "./src/routes/posts.js"
import likeRoutes from "./src/routes/likes.js"
import cookieParser from "cookie-parser"
import bodyParser from 'body-parser'
import multer from "multer"
dotenv.config()

const app = express()

const __dirname = new URL('.', import.meta.url).pathname

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(express.json())
app.use(cookieParser())
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/img")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    },
})

const upload = multer({ storage })

app.post("/api/upload", upload.single("file"), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/likes", likeRoutes)

const port = process.env.PORT
app.listen(port, () => {
    console.log("Server on port " + port)
})
