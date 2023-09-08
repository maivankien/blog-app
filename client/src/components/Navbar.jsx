import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/authContext"
import Logo from "../img/logo.png"

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext)

    return (
        <div className="navbar">
            <div className="container">
                <div className="logo" title="Trang chủ">
                    <Link to="/" a>
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div className="links">
                    <Link className="link" to="/?cat=science">
                        <h6>KHOA HỌC</h6>
                    </Link>
                    <Link className="link" to="/?cat=technology">
                        <h6>CÔNG NGHỆ</h6>
                    </Link>
                    <Link className="link" to="/?cat=cinema">
                        <h6>PHIM ẢNH</h6>
                    </Link>
                    <Link className="link" to="/?cat=design">
                        <h6>THIẾT KẾ</h6>
                    </Link>
                    <Link className="link" to="/?cat=food">
                        <h6>ĐỒ ĂN</h6>
                    </Link>
                    <span>{currentUser?.username}</span>
                    {currentUser ? (
                        <span className="logout" onClick={logout}>Đăng xuất</span>
                    ) : (
                        <Link className="link" to="/login">
                            Login
                        </Link>
                    )}
                    <span className="write">
                        <Link className="link" to="/write">
                            Đăng bài
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Navbar
