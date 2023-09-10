import { db } from "../db.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.SECRET_KEY

export const myPost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")
        const q =
            "SELECT id, title, date, cat, uid, `desc` from posts where uid = ?"

        db.query(q, [userInfo.id], (err, data) => {
            if (err) return res.status(500).send(err)

            return res.status(200).json(data)
        })
    })
}