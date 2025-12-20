import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routers/userRoute.js";
import { seedInitialProduct } from "./services/productService.js";
import productRoute from "./routers/productRoute.js";
import cartRoute from "./routers/cartRoute.js";
import orderRoute from "./routers/orderRoute.js";

const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL || '')
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

seedInitialProduct();

app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);

app.listen(port, () => {
  console.log(`Express server is running on port: http://localhost:${port}`);
});