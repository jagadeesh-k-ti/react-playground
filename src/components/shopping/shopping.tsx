import { Outlet, Link } from "react-router-dom";
import { badgeAtom } from "./store";
import { useAtom } from "jotai";

export const Shopping = () => {
    const cartCount = useAtom(badgeAtom);
    return (
        <>
            <header className="mb-4 flex h-16 w-[100%] flex-1 bg-slate-200 dark:bg-slate-600">
                <span className="flex grow items-center text-2xl">
                    <Link to={"/shopping"}>Shopping Component</Link>
                </span>
                <Link
                    to={"cart"}
                    className="m-4 flex grow justify-end text-4xl"
                >
                    <i className="bi bi-cart4 mr-2"></i>
                    <span>{cartCount}</span>
                </Link>
            </header>
            <Outlet />
            <footer className="bg-slate-200 text-center dark:bg-slate-600">
                Copyright @ JK
            </footer>
        </>
    );
};
