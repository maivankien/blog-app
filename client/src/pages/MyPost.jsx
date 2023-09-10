import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import moment from "moment"
import { AuthContext } from "../context/authContext"
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { useContext } from "react"
// import map from "../context/mapCategory"

const MyPost = () => {
    let [posts, setPosts] = useState([])

    const cat = useLocation().search
    const navigate = useNavigate()

    const { currentUser } = useContext(AuthContext)

    if (!currentUser) navigate("/")

    const handleDelete = async (postId) => {
        const shouldDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")

        if (shouldDelete) {
            try {
                await axios.delete(`/posts/${postId}`)
                const res = await axios.get('/users/my-post')
                setPosts(res.data)
                navigate("/my-posts")
            } catch (err) {
                console.log(err)
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/users/my-post')
                document.title = 'Bài viết của tôi'
                setPosts(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [cat])

    return (
        <div className="home">
            <div className="posts">
                {posts.map((post) => (
                    <div className="post" key={post.id}>
                        <div className="content">
                            <div className="info-user">
                                <p>{moment(post.date).locale('vi').fromNow()}</p>
                                {currentUser && currentUser.id === post.uid && (
                                    <div className="edit">
                                        <Link to={`/write?edit=${post.id}`} state={post}>
                                            <img src={Edit} alt="" />
                                        </Link>
                                        <img onClick={() => handleDelete(post.id)} src={Delete} alt="" />
                                    </div>
                                )}
                            </div>
                            <Link className="link" to={`/post/${post.id}`}>
                                <h3>{post.title}</h3>
                            </Link>
                            <Link className="link" to={`/post/${post.id}`}>
                                <button>Xem thêm</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyPost
