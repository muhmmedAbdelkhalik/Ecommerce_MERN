import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Navbar from "./components/navbar";
import AuthProvider from "./context/auth/authProvider";
import { CssBaseline } from "@mui/material";
import CartPage from "./pages/cart";
import ProtectedRoute from "./components/protectedRoute";
import CartProvider from "./context/cart/cartProvider";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
