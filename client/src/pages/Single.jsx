import React, { useEffect, useState } from "react"
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Menu from "../components/Menu"
import axios from "axios"
import moment from "moment"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import DOMPurify from "dompurify"
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'
import { domain } from "../config.js"
import 'moment/locale/vi'

const Single = () => {
    const [post, setPost] = useState({})

    const location = useLocation()
    const navigate = useNavigate()

    const postId = location.pathname.split("/")[2]

    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/posts/${postId}`)
                setPost(res.data)
                document.title = res.data.title
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [postId])


    const handleDelete = async () => {
        const shouldDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")

        if (shouldDelete) {
            try {
                await axios.delete(`/posts/${postId}`)
                navigate("/")
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleLike = async () => {
        if (!currentUser) {
            const check = window.confirm("Bạn cần đăng nhập để sử dụng tính năng này. \nBấm OK để  đăng nhập")

            if (check) return navigate("/login")
        } else {
            const reaction = post.user_reaction
            switch (reaction) {
                case 0:
                    setPost({
                        ...post,
                        user_reaction: 1,
                        likes: post.likes + 1
                    })
                    break
                case 1:
                    setPost({
                        ...post,
                        user_reaction: 0,
                        likes: post.likes - 1
                    })
                    break
                case -1:
                    setPost({
                        ...post,
                        user_reaction: 1,
                        likes: post.likes + 1,
                        dislikes: post.dislikes - 1
                    })
                    break
                default:
                    break
            }
        }
    }

    const handleDisLike = async () => {
        if (!currentUser) {
            const check = window.confirm("Bạn cần đăng nhập để sử dụng tính năng này. \nBấm OK để  đăng nhập")

            if (check) return navigate("/login")
        } else {
            const reaction = post.user_reaction
            switch (reaction) {
                case 0:
                    setPost({
                        ...post,
                        user_reaction: -1,
                        dislikes: post.dislikes + 1
                    })
                    break
                case -1:
                    setPost({
                        ...post,
                        user_reaction: 0,
                        dislikes: post.dislikes - 1
                    })
                    break
                case 1:
                    setPost({
                        ...post,
                        user_reaction: -1,
                        likes: post.likes - 1,
                        dislikes: post.dislikes + 1
                    })
                    break
                default:
                    break
            }
        }
    }

    return (
        <div className="single">
            <div className="content">
                <div className="user">
                    <div className="info">
                        <span style={{ color: '#5488c7' }}>{post.username}</span>
                        <p className="time">Đã đăng vào {moment(post.date).locale('vi').fromNow()}</p>
                    </div>
                    {currentUser && currentUser.id === post.uid && (
                        <div className="edit">
                            <Link to={`/write?edit=${post.id}`} state={post}>
                                <img src={Edit} alt="" />
                            </Link>
                            <img onClick={handleDelete} src={Delete} alt="" />
                        </div>
                    )}
                    <div style={{ "color": "#686565", "margin-top": "5px" }} className="like-dislike">
                        <span className="like">
                            <FaThumbsUp className={`icon${post.user_reaction > 0 ? ' active' : ''}`} onClick={handleLike} />
                            <span>{post.likes}</span>
                        </span>
                        <span className="like">
                            <FaThumbsDown className={`icon${post.user_reaction < 0 ? ' active' : ''}`} onClick={handleDisLike} />
                            <span>{post.dislikes}</span>
                        </span>
                    </div>
                </div>
                <h1>{post.title}</h1>
                {post.img && (
                    <img src={`${domain}/${post.img}`} alt="" />
                )}
                <p
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize((post.desc)),
                    }}
                ></p>
            </div>
            <Menu cat={post.cat} id={post.id} />
        </div>
    )
}

export default Single
