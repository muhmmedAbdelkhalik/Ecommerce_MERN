import cartModel, { CartStatus } from "../models/cartModel.js";

interface CreateCartParams {
    userId: string;
}

export const createCart = async (params: CreateCartParams) => {
    const cart = await cartModel.create({
        userId: params.userId,
        items: [],
        totalPrice: 0,
        status: CartStatus.ACTIVE,
    });
    return {
        success: true,
        message: 'Cart created',
        data: cart,
    };
}

interface GetActiveCartParams {
    userId: string;
}

export const getActiveCart = async (params: GetActiveCartParams) => {
    let cart = await cartModel.findOne({ userId: params.userId, status: CartStatus.ACTIVE });
    if (!cart) {
        const createResult = await createCart({ userId: params.userId });
        cart = createResult.data;
    }
    return {
        success: true,
        message: 'Cart found',
        data: cart,
    };
}