import { db } from "../../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.SECRET_KEY

export const register = (req, res) => {
    const { email, password, username }= req.body
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    if (!username) return res.status(400).json("Username is required")
    if (!emailRegex.test(email)) return res.status(400).json("Invalid email")
    if (password.length < 6) return res.status(400).json("Password minimum 6 characters")
    
    const q = "SELECT * FROM users WHERE email = ?"
    db.query(q, [email], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length) return res.status(409).json("User already exists!")

        //Hash the password and create a user
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)"
        const values = [req.body.username, req.body.email, hash]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json("User has been created.")
        })
    })
}

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ?"

    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length === 0) return res.status(404).json("Wrong email or password!")

        //Check password
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            data[0].password
        )

        if (!isPasswordCorrect)
            return res.status(400).json("Wrong email or password!")

        const token = jwt.sign({ id: data[0].id }, secret)
        const { password, ...other } = data[0]

        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(other)
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.")
}
