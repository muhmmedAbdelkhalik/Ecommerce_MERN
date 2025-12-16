import express from "express";
import { getAllProducts } from "../services/productService.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await getAllProducts();
    res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: products,
    });
});

export default router;