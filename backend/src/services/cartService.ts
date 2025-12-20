import cartModel, { CartStatus } from "../models/cartModel.js";
import orderModel, { OrderStatus, type IOrderItem } from "../models/orderModel.js";
import productModel from "../models/productModel.js";

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
    let cart = await cartModel.findOne({ userId: params.userId, status: CartStatus.ACTIVE }).populate('items.product');
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

interface AddItemToCartParams {
    userId: string;
    productId: string;
    quantity: number;
}

export const addItemToCart = async (params: AddItemToCartParams) => {
    const cart = await getActiveCart({ userId: params.userId });
    if (!cart) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    const existsInCart = cart.data?.items.find((item) => {
        const productId = typeof item.product === 'object' && item.product._id
            ? item.product._id.toString()
            : item.product.toString();
        return productId === params.productId;
    });
    if (existsInCart) {
        return {
            success: false,
            message: 'Item already in cart',
            data: null,
        };
    }
    const product = await productModel.findById(params.productId);
    if (!product) {
        return {
            success: false,
            message: 'Product not found',
            data: null,
        };
    }
    if (!cart.data) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    if (params.quantity > product.stock) {
        return {
            success: false,
            message: 'Quantity is greater than stock',
            data: null,
        };
    }
    const item = {
        product: product._id,
        unitPrice: product.price,
        quantity: params.quantity,
    } as any;
    cart.data.items.push(item);
    cart.data.totalPrice += product.price * params.quantity;
    product.stock -= params.quantity;
    await product.save();
    await cart.data.save();
    await cart.data.populate('items.product');
    return {
        success: true,
        message: 'Item added to cart',
        data: cart.data,
    };
}

interface UpdateItemInCartParams {
    userId: string;
    productId: string;
    quantity: number;
}

export const updateItemInCart = async (params: UpdateItemInCartParams) => {
    const cart = await getActiveCart({ userId: params.userId });
    if (!cart || !cart.data) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    const item = cart.data.items.find((item) => {
        const productId = typeof item.product === 'object' && item.product._id
            ? item.product._id.toString()
            : item.product.toString();
        return productId === params.productId;
    });
    if (!item) {
        return {
            success: false,
            message: 'Item not found in cart',
            data: null,
        };
    }
    const product = await productModel.findById(params.productId);
    if (!product) {
        return {
            success: false,
            message: 'Product not found',
            data: null,
        };
    }
    const oldQuantity = item.quantity;
    const quantityDifference = params.quantity - oldQuantity;

    if (quantityDifference > product.stock) {
        return {
            success: false,
            message: 'Quantity is greater than stock',
            data: null,
        };
    }

    // Update item quantity
    item.quantity = params.quantity;

    // Update totalPrice by the difference (subtract old, add new)
    cart.data.totalPrice -= item.unitPrice * oldQuantity;
    cart.data.totalPrice += item.unitPrice * params.quantity;

    // Update product stock by the difference
    product.stock -= quantityDifference;
    await product.save();
    await cart.data.save();
    await cart.data.populate('items.product');

    return {
        success: true,
        message: 'Item updated in cart',
        data: cart.data,
    };
}

interface DeleteItemFromCartParams {
    userId: string;
    productId: string;
}

export const deleteItemFromCart = async (params: DeleteItemFromCartParams) => {
    const cart = await getActiveCart({ userId: params.userId });
    if (!cart || !cart.data) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    const item = cart.data.items.find((item) => {
        const productId = typeof item.product === 'object' && item.product._id
            ? item.product._id.toString()
            : item.product.toString();
        return productId === params.productId;
    });
    if (!item) {
        return {
            success: false,
            message: 'Item not found in cart',
            data: null,
        };
    }
    const product = await productModel.findById(params.productId);
    if (!product) {
        return {
            success: false,
            message: 'Product not found',
            data: null,
        };
    }
    cart.data.items = cart.data.items.filter((item) => {
        const productId = typeof item.product === 'object' && item.product._id
            ? item.product._id.toString()
            : item.product.toString();
        return productId !== params.productId;
    });
    cart.data.totalPrice -= item.unitPrice * item.quantity;
    product.stock += item.quantity;
    await product.save();
    await cart.data.save();
    await cart.data.populate('items.product');
    return {
        success: true,
        message: 'Item deleted from cart',
        data: cart.data,
    };
}

interface ClearCartParams {
    userId: string;
}

export const clearCart = async (params: ClearCartParams) => {
    const cart = await getActiveCart({ userId: params.userId });
    if (!cart || !cart.data) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    const items = cart.data.items;
    for (const item of items) {
        const product = await productModel.findById(item.product);
        if (!product) {
            return {
                success: false,
                message: 'Product not found',
                data: null,
            };
        }
    }
    cart.data.items = [];
    cart.data.totalPrice = 0;
    await cart.data.save();
    return {
        success: true,
        message: 'Cart cleared',
        data: cart.data,
    };
}

interface CheckoutCartParams {
    userId: string;
    address: string;
}

export const checkoutCart = async (params: CheckoutCartParams) => {
    const cart = await getActiveCart({ userId: params.userId });
    if (!cart || !cart.data) {
        return {
            success: false,
            message: 'Cart not found',
            data: null,
        };
    }
    // Get items in cart and create orderItems
    const items = cart.data.items;
    const orderItems: IOrderItem[] = [];
    for (const item of items) {
        const product = await productModel.findById(item.product);
        if (!product) {
            return {
                success: false,
                message: 'Product not found',
                data: null,
            };
        }
        orderItems.push({
            productName: product.title,
            productImage: product.image,
            productPrice: item.unitPrice,
            productQuantity: item.quantity,
        });
    }

    const order = await orderModel.create({
        userId: params.userId,
        items: orderItems,
        totalPrice: cart.data.totalPrice,
        address: params.address,
        status: OrderStatus.PENDING,
    });
    if (!order) {
        return {
            success: false,
            message: 'Failed to create order',
            data: null,
        };
    }
    await order.save();
    cart.data.items = [];
    cart.data.totalPrice = 0;
    cart.data.status = CartStatus.COMPLETED;
    await cart.data.save();
    return {
        success: true,
        message: 'Order created',
        data: order,
    };
}