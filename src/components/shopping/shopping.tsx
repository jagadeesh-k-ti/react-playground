import { Outlet, Link } from "react-router-dom";
import { badgeAtom } from "./store";
import { useAtomValue } from "jotai";

const Header = () => {
    const cartCount = useAtomValue(badgeAtom);

    return (
        <header className="flex flex-1 bg-slate-200 dark:bg-slate-600">
            <span className="flex items-center text-2xl">
                <Link className="mx-2" to={"/shopping"}>
                    Shopping Component
                </Link>
            </span>
            <Link to={"cart"} className="m-4 flex grow justify-end text-4xl">
                <i className="bi bi-cart4 mr-2"></i>
                <span>{cartCount}</span>
            </Link>
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="bg-slate-200 text-center dark:bg-slate-600">
            Copyright @ JK
        </footer>
    );
};

export const Shopping = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};
