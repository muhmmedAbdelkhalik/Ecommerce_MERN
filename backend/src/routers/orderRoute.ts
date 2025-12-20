import express from 'express';
import { getUserOrders, getOrderById } from '../services/orderService.js';
import validateJWT from '../middleware/validateJWT.js';
import type { ExtendedRequest } from '../types/extendedRequest.js';

const router = express.Router();

router.get('/', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }

        const result = await getUserOrders({ userId: userId.toString() });
        res.status(result.success ? 200 : 400).json({
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

router.get('/:id', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }

        const orderId = req.params.id;
        const result = await getOrderById({
            orderId,
            userId: userId.toString(),
        });

        res.status(result.success ? 200 : 404).json({
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;
