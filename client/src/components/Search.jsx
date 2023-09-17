import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Close from '../img/close.png'

function Search() {
    const [query, setQuery] = useState('')
    const [posts, setResults] = useState([])
    const [focused, setFocused] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const location = useLocation()

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                if (query.trim()) {
                    const response = await axios.get(`/posts/search?q=${query}`)
                    setResults(response.data)
                    setShowResults(true)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        if (focused) {
            fetchSearchResults()
        }
    }, [query, focused])

    useEffect(() => {
        if (location.pathname) {
            setQuery('')
            setShowResults(false)
        }
    }, [location])

    const handleFocus = () => {
        setFocused(true)
        setShowResults(true)
    }

    const handleOnClick = (id) => {
        setFocused(false)
        setShowResults(false)
        navigate(`/post/${id}`)
        setQuery('')
    }

    const CloseInput = () => {
        setFocused(false)
        setQuery('')
        setShowResults(false)
    }

    return (
        <div className="search" onClick={handleFocus}>
            <div className="input-search">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    ref={inputRef}
                />
                <img src={Close} className="close-input" onClick={CloseInput} alt="close"/>
            </div>
            {focused && showResults && query && query.trim() && (
                <ul className="search-content">
                    {posts.length ? (
                        posts.map((post) => (
                            <li className="search-item" key={post.id} onClick={() => handleOnClick(post.id)}>
                                <p className="link">{post.title}</p>
                            </li>
                        ))
                    ) : (
                        <span>Không tìm thấy bài viết nào</span>
                    )}
                </ul>
            )}
        </div>
    )
}

export default Search
