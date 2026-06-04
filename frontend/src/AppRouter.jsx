import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home";
import Category from "./Pages/Category";
import AddCategory from "./Pages/AddCategory";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/category/:id',
                element: <Category />
            },
            {
                path: '/add-category',
                element: <AddCategory />
            },
        ]
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}