import express from "express";
import { getAllProducts } from "../services/productService.js";
import { addItemToCart, checkoutCart, clearCart, deleteItemFromCart, getActiveCart, updateItemInCart } from "../services/cartService.js";
import validateJWT from "../middleware/validateJWT.js";
import type { ExtendedRequest } from "../types/extendedRequest.ts";

const router = express.Router();

router.get('/', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const cart = await getActiveCart({ userId: userId.toString() });
        res.status(cart.success ? 200 : 400).json({ message: cart.message, data: cart.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.post('/items', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }
        const item = await addItemToCart({ userId: userId.toString(), productId, quantity });
        res.status(item.success ? 200 : 400).json({ message: item.message, data: item.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding item to cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.put('/items', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const { productId, quantity } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        if (!quantity) {
            return res.status(400).json({ message: 'Quantity is required' });
        }
        const item = await updateItemInCart({ userId: userId.toString(), productId, quantity });
        res.status(item.success ? 200 : 400).json({ message: item.message, data: item.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating item in cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.delete('/items/:id', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const result = await deleteItemFromCart({ userId: userId.toString(), productId });
        res.status(result.success ? 200 : 400).json({ message: result.message, data: result.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting item from cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.delete('/', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const result = await clearCart({ userId: userId.toString() });
        res.status(result.success ? 200 : 400).json({ message: result.message, data: result.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error clearing cart',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});


router.post('/checkout', validateJWT, async (req: ExtendedRequest, res) => {
    try {
        const userId = req.user?._id;
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const result = await checkoutCart({ userId: userId.toString(), address });
        res.status(result.success ? 200 : 400).json({ message: result.message, data: result.data });
    } catch (error) {
        res.status(500).json({
            message: 'Error checking out',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;