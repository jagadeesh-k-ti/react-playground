import { Product, cartAtom } from "./store";
import { useAtomValue } from "jotai";

const CartView = ({ product }: { product: Product }) => {
    return (
        <div className="mb-4 flex">
            <div className="flex grow items-center">
                <img
                    width={"25%"}
                    className="rounded-lg p-1"
                    src={product.pictureUrl}
                />
                <span className="ml-2 text-4xl">{product.name}</span>
            </div>
            <div className="flex items-center justify-center p-4 text-4xl">
                ${product.price}
            </div>
        </div>
    );
};

export const Cart = () => {
    const items = useAtomValue(cartAtom);
    return (
        <div className="flex grow flex-col items-center justify-center rounded-md">
            <div className=" dark:bg-gray-800">
                {items.map(p => (
                    <CartView key={p.id} product={p} />
                ))}
            </div>
            <div className="m-4 bg-yellow-600 text-4xl">
                Total: ${items.reduce((prev, curr) => prev + curr.price, 0)}
            </div>
        </div>
    );
};
