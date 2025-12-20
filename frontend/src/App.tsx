import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Navbar from "./components/navbar";
import AuthProvider from "./context/auth/authProvider";
import { CssBaseline, GlobalStyles } from "@mui/material";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import OrderSuccessPage from "./pages/orderSuccess";
import OrdersPage from "./pages/orders";
import OrderDetailsPage from "./pages/orderDetails";
import ProtectedRoute from "./components/protectedRoute";
import CartProvider from "./context/cart/cartProvider";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: {
              height: "100%",
              margin: 0,
              padding: 0,
            },
            body: {
              height: "100%",
              margin: 0,
              padding: 0,
            },
            "#root": {
              minHeight: "100vh",
            },
          }}
        />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
