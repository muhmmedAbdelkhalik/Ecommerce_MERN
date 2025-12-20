import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Grid,
} from "@mui/material";
import { useAuth } from "../context/auth/authContext";
import { BASE_URL } from "../constants/baseUrl";
import type { Order, OrderStatus } from "../types/order";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await response.json()) as {
          message: string;
          data: Order[];
        };

        if (response.ok && data.data) {
          setOrders(data.data);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

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
    });
  };

  if (loading) {
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={10} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: "#667eea", mb: 4 }}
          >
            My Orders
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!loading && orders.length === 0 && !error && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                No orders yet
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  },
                }}
              >
                Start Shopping
              </Button>
            </Box>
          )}

          <Grid container spacing={3}>
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <Grid item xs={12} key={order._id}>
                  <Card
                    elevation={3}
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Order #{order._id.slice(-8)}
                        </Typography>
                        <Chip
                          label={order.status.toUpperCase()}
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Placed on: {formatDate(order.createdAt)}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Items: {order.items.length}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#667eea" }}>
                          {order.totalPrice.toFixed(2)} EGP
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/orders/${order._id}`)}
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          fontWeight: 600,
                          py: 1,
                          "&:hover": {
                            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrdersPage;
