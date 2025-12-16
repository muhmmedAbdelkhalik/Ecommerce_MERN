import express from "express";
import { register, login } from "../services/userService.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const { success, message, data } = await register({ firstName, lastName, email, password });
    res.status(success ? 200 : 400).json({ message, data });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { success, message, data, token } = await login({ email, password });
    res.status(success ? 200 : 400).json({ message, data, token });
});

export default router;