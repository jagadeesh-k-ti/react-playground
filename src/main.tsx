import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Counter } from "./components/Counter.tsx";
import { TodoComponent } from "./components/Todo.tsx";
import { Shopping } from "./components/shopping/shopping.tsx";
import { Cart } from "./components/shopping/cart.tsx";
import { Products } from "./components/shopping/products.tsx";

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    {
        path: "/counter",
        element: <Counter />,
    },
    {
        path: "/todo",
        element: <TodoComponent />,
    },
    {
        path: "/shopping",
        element: <Shopping />,
        children: [
            {
                path: "",
                element: <Products />,
            },
            {
                path: "cart",
                element: <Cart />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
);
