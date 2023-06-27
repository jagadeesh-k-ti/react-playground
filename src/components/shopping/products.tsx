import { useAtom } from "jotai";
import { Product, cartAtom } from "./store";
import { genProduct } from "./utils";
import * as R from "remeda";
import { produce } from "immer";

const dummyProducts = R.pipe(
    R.range(0, 15),
    R.map(() => genProduct())
);

const StarRating = ({ stars }: { stars: number }) => {
    return (
        <div>
            {R.pipe(
                R.range(0, stars),
                R.map(key => (
                    <i
                        key={key}
                        className="bi bi-star-fill text-yellow-300"
                    ></i>
                ))
            )}
        </div>
    );
};

const ProductView = ({
    product,
    add,
}: {
    product: Product;
    add: (p: Product) => void;
}) => {
    return (
        <div className="product flex items-center justify-center rounded-md border border-orange-400">
            <div className="product-image w-40 flex-auto px-2">
                <img className="h-52 w-80" src={product.pictureUrl} />
            </div>
            <div className="product-details w-60 flex-auto p-2">
                <div id="title" className="p-2 font-bold">
                    <span>{product.name}</span>
                </div>
                <div title="price" className="p-2">
                    <span className="mr-2">${product.price}</span>
                    <StarRating stars={product.rating} />
                </div>
                <span>{product.desc}</span>
                <div className="p-2">
                    <button
                        disabled={!product.inStock}
                        onClick={() => add(product)}
                        className="rounded-sm bg-yellow-500 p-3 text-black disabled:bg-black disabled:text-white"
                    >
                        {product.inStock ? (
                            <div>
                                <i className="bi bi-cart4 mr-2"></i> Add to Cart
                            </div>
                        ) : (
                            "Out Of Stock"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Products = () => {
    const [cart, setCart] = useAtom(cartAtom);

    const addHandler = (p: Product) => {
        setCart(
            produce(cart, draft => {
                draft.push(p);
            })
        );
    };

    return (
        <div className="m-2 grid grid-cols-3 gap-2">
            {dummyProducts.map(p => (
                <ProductView key={p.id} add={addHandler} product={p} />
            ))}
        </div>
    );
};
