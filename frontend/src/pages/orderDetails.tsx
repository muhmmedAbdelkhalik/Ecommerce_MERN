import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
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
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../context/auth/authContext";
import { BASE_URL } from "../constants/baseUrl";
import type { Order, OrderStatus } from "../types/order";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        navigate("/orders");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await response.json()) as {
          message: string;
          data: Order | null;
        };

        if (response.ok && data.data) {
          setOrder(data.data);
        } else {
          setError(data.message || "Order not found");
          setTimeout(() => navigate("/orders"), 2000);
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Fetch order error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token, navigate]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { bg: "rgba(255, 152, 0, 0.1)", color: "#ff9800" };
      case "completed":
        return { bg: "rgba(76, 175, 80, 0.1)", color: "#4caf50" };
      case "cancelled":
        return { bg: "rgba(244, 67, 54, 0.1)", color: "#f44336" };
      default:
        return { bg: "rgba(0, 0, 0, 0.1)", color: "#000" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={10} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate("/orders")}
              startIcon={<ArrowBackIcon />}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                },
              }}
            >
              Back to Orders
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const statusStyle = getStatusColor(order.status);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={10} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#667eea" }}
            >
              Order #{order._id.slice(-8)}
            </Typography>
            <Chip
              label={order.status.toUpperCase()}
              sx={{
                bgcolor: statusStyle.bg,
                color: statusStyle.color,
                fontWeight: 600,
                fontSize: "0.9rem",
                px: 2,
                py: 2.5,
              }}
            />
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Placed on: {formatDate(order.createdAt)}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Order Items */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Order Items
          </Typography>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <List>
              {order.items.map((item, index) => (
                <div key={index}>
                  <ListItem>
                    {item.productImage && (
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={item.productImage}
                          alt={item.productName}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={item.productName}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ display: "block" }}
                          >
                            Quantity: {item.productQuantity} × {item.productPrice} EGP
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ display: "block", fontWeight: 600 }}
                          >
                            Subtotal: {item.productPrice * item.productQuantity} EGP
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < order.items.length - 1 && <Divider />}
                </div>
              ))}
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
                {order.totalPrice.toFixed(2)} EGP
              </Typography>
            </Box>
          </Paper>

          {/* Delivery Address */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: "rgba(102, 126, 234, 0.02)" }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Delivery Address
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {order.address}
            </Typography>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/orders")}
              startIcon={<ArrowBackIcon />}
              sx={{
                flex: 1,
                minWidth: "200px",
                borderColor: "#667eea",
                color: "#667eea",
                fontWeight: 600,
                py: 1.5,
                "&:hover": {
                  borderColor: "#764ba2",
                  bgcolor: "rgba(102, 126, 234, 0.05)",
                },
              }}
            >
              Back to Orders
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                flex: 1,
                minWidth: "200px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                py: 1.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderDetailsPage;
