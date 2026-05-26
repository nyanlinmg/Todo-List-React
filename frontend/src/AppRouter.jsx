import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Home from "./Pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            }
        ]
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}