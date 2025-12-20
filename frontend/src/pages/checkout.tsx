import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useCart } from "../context/cart/cartContext";
import { useAuth } from "../context/auth/authContext";
import { BASE_URL } from "../constants/baseUrl";
import type { Order } from "../types/order";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, isLoading: cartLoading, refreshCart } = useCart();
  const { token } = useAuth();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to cart if empty on initial load
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartLoading]);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address.trim()) {
      setError("Please enter a delivery address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: address.trim() }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message: string;
        data: Order;
      };

      if (response.ok && data.data) {
        // Navigate to order success with order data
        navigate("/order-success", { state: { order: data.data } });
        // Refresh cart in the background to update badge
        refreshCart();
      } else {
        setError(data.message || "Failed to place order");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={10} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: "#667eea", mb: 3 }}
          >
            Checkout
          </Typography>

          {/* Order Summary */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Order Summary
          </Typography>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <List>
              {cartItems.map((item, index) => {
                const product =
                  typeof item.product === "string" ? null : item.product;
                const productName = product?.title || `Product`;
                const productImage = product?.image || "";

                return (
                  <div key={item._id}>
                    <ListItem>
                      {productImage && (
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={productImage}
                            alt={productName}
                            sx={{ width: 60, height: 60, mr: 2 }}
                          />
                        </ListItemAvatar>
                      )}
                      <ListItemText
                        primary={productName}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ display: "block" }}
                            >
                              {item.unitPrice} EGP × {item.quantity} ={" "}
                              {item.unitPrice * item.quantity} EGP
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < cartItems.length - 1 && <Divider />}
                  </div>
                );
              })}
            </List>
            <Divider />
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                bgcolor: "rgba(102, 126, 234, 0.05)",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {totalPrice.toFixed(2)} EGP
              </Typography>
            </Box>
          </Paper>

          {/* Address Form */}
          <form onSubmit={handlePlaceOrder}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Delivery Address
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
              placeholder="Street address, city, postal code, etc."
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !address.trim()}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                py: 1.5,
                fontSize: "1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                },
                "&:disabled": {
                  background: "rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Place Order"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
