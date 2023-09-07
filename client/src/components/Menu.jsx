import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { domain } from '../config'

const Menu = ({ cat, id }) => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/posts/?cat=${cat}`);
                console.log(res)
                setPosts(res.data.filter(item => item.id != id));
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [cat]);
    return (
        <div className="menu">
            {posts.length == 0 ? (
                <h3 style={{ display: 'none' }}>Bài viết liên quan</h3>
            ) : (
                <h3>Bài viết liên quan</h3>
            )}
            {posts.map((post) => (
                <div className="post" key={post.id}>
                    <Link className="link" to={`/post/${post.id}`}>
                        <h2>{post.title}</h2>
                    </Link>
                    <span style={{ color: '#5488c7' }}>{post.username}</span>
                    <Link className="link" to={`/post/${post.id}`}>
                        <button>Read More</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Menu;
