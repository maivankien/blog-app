import React, { useState, useEffect } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import axios from "axios"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import moment from "moment"
import MESSAGE from "../common/message"

const Write = () => {
    let state = useLocation().state
    const [searchParams] = useSearchParams()

    if (!searchParams.get('edit')) state = null

    const [value, setValue] = useState(state?.desc || "")
    const [title, setTitle] = useState(state?.title || "")
    const [file, setFile] = useState(null)
    const [cat, setCat] = useState(state?.cat || "")
    const [image] = useState(state?.img || "")

    const navigate = useNavigate()

    useEffect(() => {
        if (state) {
            document.title = 'Chỉnh sửa'
        } else {
            document.title = 'Đăng bài'
        }
        setValue(state?.desc || '')
        setTitle(state?.title || '')
        setCat(state?.cat || '')
    }, [state])

    const upload = async () => {
        try {
            if (!file) return

            const formData = new FormData()
            formData.append("file", file)
            const res = await axios.post("/upload", formData)
            return res.data
        } catch (err) {
            console.error(err)
        }
    }


    const handleClick = async (e) => {
        e.preventDefault()
        const imgUrl = await upload()
        if (!title.trim().length) {
            return alert(MESSAGE.REQUIRED_TITLE)
        }
        if (!value.trim().length) {
            return alert(MESSAGE.REQUIRED_CONTENT)
        }
        if (title.trim().length > 255) {
            return alert(MESSAGE.MAX_LENGTH_TITLE)
        }
        try {
            state
                ? await axios.put(`/posts/${state.id}`, {
                    title,
                    desc: value,
                    cat,
                    img: file ? imgUrl : image,
                })
                : await axios.post(`/posts/`, {
                    title,
                    desc: value,
                    cat,
                    img: file ? imgUrl : image,
                    date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                })
            navigate("/")
        } catch (err) {
            alert(MESSAGE.DEFAULT_ERROR)
        }
    }

    return (
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="editorContainer">
                    <ReactQuill
                        className="editor"
                        theme="snow"
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>
            <div className="menu">
                <div className="item">
                    <div className="">
                        <input
                            style={{ display: "none" }}
                            type="file"
                            id="file"
                            name=""
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <label className="file" htmlFor="file">
                            Chọn ảnh
                        </label>
                        <div className="buttons">
                            <button onClick={handleClick}>{state ? "Cập nhật" : "Đăng bài"}</button>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <h1>Thể loại</h1>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "science"}
                            name="cat"
                            value="science"
                            id="science"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="science">Khoa học</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "technology"}
                            name="cat"
                            value="technology"
                            id="technology"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="technology">Công nghệ</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "cinema"}
                            name="cat"
                            value="cinema"
                            id="cinema"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="cinema">Phim ảnh</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "design"}
                            name="cat"
                            value="design"
                            id="design"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="design">Thiết kế</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "food"}
                            name="cat"
                            value="food"
                            id="food"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="food">Đồ ăn</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "cancel"}
                            name="cat"
                            value="cancel"
                            id="cancel"
                            onChange={(e) => setCat("")}
                            style={{ display: "none" }}
                        />
                        <label style={{ "cursor": "pointer" }} htmlFor="cancel">Bỏ chọn</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Write
