import React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
    useEffect(() => {
        document.title = 'Đăng ký'
    })
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    })
    const [err, setError] = useState(null)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (inputs.password !== inputs.confirm_password) {
            return setError("Password incorrect")
        }
        try {
            await axios.post("/auth/register", inputs)
            navigate("/login")
        } catch (err) {
            setError(err.response.data)
        }

    }

    return (
        <div className="auth">
            <h1>Đăng ký</h1>
            <form>
                <input
                    required
                    type="text"
                    placeholder="username"
                    name="username"
                    onChange={handleChange}
                />
                <input
                    required
                    type="email"
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
                <input
                    required
                    type="password"
                    placeholder="confirm password"
                    name="confirm_password"
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>Đăng ký</button>
                {err && <p className="show-err">{err}</p>}
                <span>
                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </span>
            </form>
        </div>
    )
}

export default Register
