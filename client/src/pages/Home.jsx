import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Home = () => {
    let [posts, setPosts] = useState([]);

    const cat = useLocation().search
    moment.locale('vi');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/posts${cat}`);
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [cat]);

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }


    console.log(posts[1])

    return (
        <div className="home">
            <div className="posts">
                {posts.map((post) => (
                    <div className="post" key={post.id}>
                        <div className="content">
                            <div className="">
                                <span style={{ color: '#5488c7' }}>{post.username}</span>
                                <span>Posted {moment(post.date).fromNow()}</span>
                            </div>
                            <Link className="link" to={`/post/${post.id}`}>
                                <h3>{post.title}</h3>
                            </Link>
                            <Link className="link" to={`/post/${post.id}`}>
                                <button>Read More</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
