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
import { TodoQueryComponent } from "./components/Query/todo.tsx";
import { Datagrid } from "./components/Datagrid/Datagrid.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
        path: "/datagrid",
        element: <Datagrid />,
    },
    {
        path: "/query",
        element: (
            <>
                <TodoQueryComponent />
                <ReactQueryDevtools />
            </>
        ),
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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}></RouterProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
