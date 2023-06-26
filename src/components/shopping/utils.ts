import { faker } from "@faker-js/faker";
import { Product } from "./store";

faker.seed(1337);

export const genProduct = () => {
    return {
        id: faker.string.uuid(),
        name: faker.commerce.product(),
        desc: faker.commerce.productDescription(),
        pictureUrl: faker.image.urlLoremFlickr({ category: "abstract" }),
        rating: faker.number.int({ min: 1, max: 5 }),
        price: Number(faker.commerce.price()),
        inStock: faker.datatype.boolean(0.85),
    } satisfies Product;
};
