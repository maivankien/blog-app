import React, { useContext } from "react"
import { Link, useSearchParams, useLocation } from "react-router-dom"
import { AuthContext } from "../context/authContext"
import Logo from "../img/logo.png"
import Search from "./Search"

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext)

    const [searchParams] = useSearchParams()
    const cat = searchParams.get('cat')
    const url = useLocation().pathname

    const pathLogin = 
        url !== '/' ? `/login?continue=${url}` : 
        (cat ? `/login?continue=/?cat=${cat}` : '/login')

    return (
        <div className="navbar">
            <div className="container">
                <div className="logo" title="Trang chủ">
                    <Link to="/" a>
                        <img src={Logo} alt="Logo" />
                    </Link>
                </div>
                <Search></Search>
                <div className="links">
                    <Link className={`link ${cat === 'science' ? 'active' : ''}`} to="/?cat=science">
                        <h6>KHOA HỌC</h6>
                    </Link>
                    <Link className={`link ${cat === 'technology' ? 'active' : ''}`} to="/?cat=technology">
                        <h6>CÔNG NGHỆ</h6>
                    </Link>
                    <Link className={`link ${cat === 'cinema' ? 'active' : ''}`} to="/?cat=cinema">
                        <h6>PHIM ẢNH</h6>
                    </Link>
                    <Link className={`link ${cat === 'design' ? 'active' : ''}`} to="/?cat=design">
                        <h6>THIẾT KẾ</h6>
                    </Link>
                    <Link className={`link ${cat === 'food' ? 'active' : ''}`} to="/?cat=food">
                        <h6>ĐỒ ĂN</h6>
                    </Link>
                    {currentUser ? (
                        <>
                            <Link className="link" to="/my-posts" title="Bài viết của tôi">{currentUser?.username}</Link>
                            <span className="logout" onClick={logout}>
                                Đăng xuất
                            </span>
                            <span className="write">
                                <Link className="link" to="/write">
                                    Đăng bài
                                </Link>
                            </span>
                        </>
                    ) : (
                        <Link className="link" to={pathLogin}>
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar
