import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Order } from "../types/order";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = (location.state as { order?: Order })?.order;

  // Redirect to home if no order data
  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

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
          {/* Success Header */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
              pb: 3,
              borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: "#4caf50",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 700, color: "#4caf50" }}
            >
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Thank you for your order
            </Typography>
            <Typography variant="h6" sx={{ color: "#667eea", fontWeight: 600 }}>
              Order ID: #{order._id}
            </Typography>
          </Box>

          {/* Order Details */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Order Details
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

          {/* Order Status */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: "rgba(76, 175, 80, 0.05)" }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Order Status
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#4caf50",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {order.status}
            </Typography>
          </Paper>

          {/* Continue Shopping Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/")}
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
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderSuccessPage;
