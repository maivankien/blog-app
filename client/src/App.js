import {
    Outlet,
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom"
import "./main.css"
import Login from "./pages/Login"
import Write from "./pages/Write"
import Home from "./pages/Home"
import MyPost from "./pages/MyPost"
import Single from "./pages/Single"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/post/:id",
                element: <Single />,
            },
            {
                path: "/write",
                element: <Write />,
            },
            {
                path: "my-posts",
                element: <MyPost />
            },
        ],
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/post/:id/notfound",
        element: <NotFound />
    },
    {
        path: '*',
        element: <NotFound />,
    }
])

function App() {
    return (
        <div className="app">
            <div className="container">
                <RouterProvider router={router} />
            </div>
        </div>
    )
}

export default App
