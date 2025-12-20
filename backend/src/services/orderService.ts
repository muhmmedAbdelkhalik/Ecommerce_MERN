import orderModel from '../models/orderModel.js';

interface GetUserOrdersParams {
    userId: string;
}

export const getUserOrders = async (params: GetUserOrdersParams) => {
    try {
        const orders = await orderModel
            .find({ userId: params.userId })
            .sort({ createdAt: -1 })
            .exec();

        return {
            success: true,
            message: 'Orders fetched successfully',
            data: orders,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error fetching orders',
            data: null,
        };
    }
};

interface GetOrderByIdParams {
    orderId: string;
    userId: string;
}

export const getOrderById = async (params: GetOrderByIdParams) => {
    try {
        const order = await orderModel.findOne({
            _id: params.orderId,
            userId: params.userId,
        }).exec();

        if (!order) {
            return {
                success: false,
                message: 'Order not found',
                data: null,
            };
        }

        return {
            success: true,
            message: 'Order fetched successfully',
            data: order,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error fetching order',
            data: null,
        };
    }
};
