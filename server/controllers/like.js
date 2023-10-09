import { db } from "../db.js"


export const likePost = (req, res) => {
    const { id: postId }  = req.params
    const { id: userId }  = req.userBeingQuery

    const query = 
        `INSERT INTO post_likes (post_id, user_id, action)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        action = 
            CASE
                WHEN action IN (0, -1) THEN 1
                WHEN action = 1 THEN 0
                ELSE action 
            END;`
    db.query(query, [postId, userId, 1], (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json("Success!")
    })
}


export const dislikePost = (req, res) => {
    const { id: postId }  = req.params
    const { id: userId }  = req.userBeingQuery

    const query = 
        `INSERT INTO post_likes (post_id, user_id, action)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        action = 
            CASE
                WHEN action IN (0, 1) THEN -1
                WHEN action = -1 THEN 0
                ELSE action 
            END;`

    db.query(query, [postId, userId, -1], (err, data) => {
        if (err) return res.status(500).send(err)

        return res.status(200).json("Success!")
    })
}