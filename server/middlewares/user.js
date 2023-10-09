import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.SECRET_KEY

export const authUser = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    let user
    try {
        user = jwt.verify(token, secret)
        req.userBeingQuery = user
        next()
    } catch (err) {
        return res.status(401).json("Not authenticated!")
    }
}