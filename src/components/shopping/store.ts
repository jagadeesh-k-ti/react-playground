import { atom } from "jotai";

export type Product = Readonly<{
    id: string;
    name: string;
    desc: string;
    pictureUrl: string;
    rating: number;
    price: number;
    inStock: boolean;
}>;

export const cartAtom = atom<Product[]>([]);
export const badgeAtom = atom(get => get(cartAtom).length);
