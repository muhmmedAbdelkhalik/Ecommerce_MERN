import productModel from "../models/productModel.js";


export const getAllProducts = async () => {
    return await productModel.find();
}


export const seedInitialProduct = async () => {
    try {
        const initialProducts = [
            {
                title: "Sample Product 1",
                image: "https://picsum.photos/200/300",
                price: 9.99,
                stock: 100,
            },
            {
                title: "Sample Product 2",
                image: "https://picsum.photos/200/300",
                price: 19.99,
                stock: 50,
            },
            {
                title: "Sample Product 3",
                image: "https://picsum.photos/200/300",
                price: 29.99,
                stock: 25,
            },
        ];

        // Avoid seeding if there are already products
        const count = await productModel.countDocuments();
        if (count === 0) {
            await productModel.insertMany(initialProducts);
        }
    } catch (error) {
        console.error('Error seeding initial products:', error);
    }
}