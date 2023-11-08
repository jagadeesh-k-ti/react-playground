import { Product, cartAtom } from "./store";
import { useAtomValue } from "jotai";

const CartProduct = ({ product }: { product: Product }) => {
    return (
        <div className="mb-4 flex">
            <div className="flex items-center">
                <img
                    width={"15%"}
                    className="rounded-lg p-1"
                    src={product.pictureUrl}
                />
                <span className="ml-2 text-2xl">{product.name}</span>
            </div>
            <div className="flex items-center justify-center p-4 text-2xl">
                ${product.price}
            </div>
        </div>
    );
};

const CartView = ({ items }: { items: Product[] }) => {
    return (
        <div className="my-4 flex flex-col items-center justify-center rounded-md">
            <div className="bg-gray-200 p-4 dark:bg-gray-800">
                {items.map(p => (
                    <CartProduct key={p.id} product={p} />
                ))}
            </div>
            <div className="m-4 bg-yellow-600 text-4xl">
                Total: ${items.reduce((prev, curr) => prev + curr.price, 0)}
            </div>
        </div>
    );
};

export const Cart = () => {
    const items = useAtomValue(cartAtom);
    if (items.length > 0) {
        return <CartView items={items} />;
    } else {
        return <></>;
    }
};
