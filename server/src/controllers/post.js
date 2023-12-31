import { db } from "../../db.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.SECRET_KEY

export const getPosts = (req, res) => {
    const { page = 1, limit = 30, cat } = req.query
    const offset = (page - 1) * limit
    const values = [limit, offset]
    if (cat) values.unshift(cat)

    const q = cat
        ? 
        `SELECT posts.id, posts.title, posts.date, users.username FROM posts 
        JOIN users ON posts.uid = users.id 
        WHERE cat = ? order by rand() limit ? offset ?`
        : 
        `SELECT posts.id, posts.title, posts.date, users.username FROM posts 
        JOIN users ON posts.uid = users.id order by rand() limit ? offset ?`
        
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json(data)
    })
}

export const getPost = (req, res) => {
    const postId = req.params.id
    const token = req.cookies.access_token
    let user
    if (token) {
        try {
            user = jwt.verify(token, secret)
        } catch (err) {}
    }
    const query = 
            `SELECT p.id, p.uid, username, title, \`desc\`, p.img, cat, date,
                SUM(CASE WHEN pl.action = 1 THEN 1 ELSE 0 END) AS likes,
                SUM(CASE WHEN pl.action = -1 THEN 1 ELSE 0 END) AS dislikes${user ? `,
                COALESCE((
                    SELECT action
                    FROM post_likes
                    WHERE post_id = ? AND user_id = ${user.id}
                ), 0) AS user_reaction`: ''}
            FROM users u
            JOIN posts p ON u.id = p.uid
            LEFT JOIN post_likes pl ON p.id = pl.post_id
            WHERE p.id = ?`

    db.query(query, [postId, postId], (err, data) => {
        if (err) return res.status(500).send(err)
        if (!data[0].id) return res.status(404).json("No data found")

        const resultData = {
            ...data[0],
            user_reaction: data[0].hasOwnProperty('user_reaction') ? data[0].user_reaction : 0
        }
    
        return res.status(200).json(resultData)
    })
}

export const addPost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const q =
            "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)"

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.json("Post has been created.")
        })
    })
}

export const deletePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id
        const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?"

        db.query(q, [postId, userInfo.id], (err, data) => {
            if (err) return res.status(403).json("You can delete only your post!")

            return res.json("Post has been deleted!")
        })
    })
}

export const updatePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, secret, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const postId = req.params.id
        const q =
            "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?"

        const values = [req.body.title, req.body.desc, req.body.img, req.body.cat]

        db.query(q, [...values, postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.json("Post has been updated.")
        })
    })
}

export const searchPost = (req, res) => {
    const search = req.query.q
    const limit = req.query.limit || 10
    if (!search || !search.trim().length) return res.status(400).json("Bad Request")

    const query = 
        `SELECT posts.id, posts.title, users.username FROM posts 
        JOIN users ON posts.uid = users.id 
        WHERE MATCH(title) AGAINST(?) limit ?`

    db.query(query, [search, parseInt(limit)], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })
}
