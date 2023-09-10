import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import moment from "moment"
import 'moment/locale/vi'

const Menu = ({ cat, id }) => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/posts/?cat=${cat}`)
                setPosts(res.data.filter(item => item.id !== id))
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [cat, id])
    return (
        <div className="menu">
            {posts.length === 0 ? (
                <h3 style={{ display: 'none' }}>Bài viết liên quan</h3>
            ) : (
                <h3>Bài viết liên quan</h3>
            )}
            {posts.map((post) => (
                <div className="post" key={post.id}>
                    <Link className="link" to={`/post/${post.id}`}>
                        <h4>{post.title}</h4>
                    </Link>
                    <div className="info-user">
                        <span style={{ color: '#5488c7' }}>{post.username}</span>
                        <p>{moment(post.date).locale('vi').fromNow()}</p>
                    </div>
                    <Link className="link" to={`/post/${post.id}`}>
                        <button>Xem thêm</button>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default Menu
