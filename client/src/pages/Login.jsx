import React, { useEffect, useState } from "react"
import { useContext } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { AuthContext } from "../context/authContext"

const Login = () => {
    useEffect(() => {
        document.title = 'Đăng nhập'
    })
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    })
    const [err, setError] = useState(null)

    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const [searchParams] = useSearchParams()

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(inputs)
            const continute = searchParams.get("continue")
            if (continute) {
                navigate(continute)
            } else {
                navigate("/")
            }
        } catch (err) {
            setError(err.response.data)
        }
    }
    return (
        <div className="auth">
            <h1>Đăng nhập</h1>
            <form>
                <input
                    required
                    type="text"
                    placeholder="email"
                    name="email"
                    onChange={handleChange}
                />
                <input
                    required
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>Đăng nhập</button>
                {err && <p>{err}</p>}
                <span>
                Bạn chưa có tài khoản? <Link to="/register"> Đăng ký</Link>
                </span>
            </form>
        </div>
    )
}

export default Login
