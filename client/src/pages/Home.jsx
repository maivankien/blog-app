import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import moment from "moment"
import CATEGORY from "../common/category"

const Home = () => {
    let [posts, setPosts] = useState([])

    const cat = useLocation().search

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/posts${cat}`)
                if (cat.length) {
                    document.title = CATEGORY[cat.split("=")[1]]
                } else {
                    document.title = 'Trang chủ'
                }
                setPosts(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [cat])

    return (
        <div className="home">
            <div className="posts">
                {posts.length ? posts.map((post) => (
                    <div className="post" key={post.id}>
                        <div className="content">
                            <div className="info-user">
                                <span style={{ color: '#5488c7' }}>{post.username}</span>
                                <p>{moment(post.date).locale('vi').fromNow()}</p>
                            </div>
                            <Link className="link" to={`/post/${post.id}`}>
                                <h3>{post.title}</h3>
                            </Link>
                            <Link className="link" to={`/post/${post.id}`}>
                                <button>Xem thêm</button>
                            </Link>
                        </div>
                    </div>
                )) : <div>Không có bài biết nào</div>}
            </div>
        </div>
    )
}

export default Home
