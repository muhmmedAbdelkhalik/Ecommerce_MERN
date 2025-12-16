import express from "express";
import { getAllProducts } from "../services/productService.js";
import { getActiveCart } from "../services/cartService.js";
import validateJWT from "../middleware/validateJWT.js";

const router = express.Router();

router.get('/', validateJWT, async (req, res) => {
    try {
        const userId = (req as any).user._id;
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


export default router;