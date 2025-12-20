import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart/cartContext";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalPrice,
    isLoading,
    updateItem,
    removeItem,
    clearCart,
  } = useCart();

  if (isLoading) {
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
        <CircularProgress sx={{ color: "white" }} size={60} />
      </Box>
    );
  }

  if (cartItems.length === 0) {
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
          <Paper
            elevation={10}
            sx={{
              p: { xs: 4, sm: 8 },
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <RemoveShoppingCartIcon
              sx={{
                fontSize: 100,
                color: "#667eea",
                mb: 3,
                opacity: 0.8,
              }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 700, color: "#667eea", mb: 2 }}
            >
              Your Cart is Empty
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: "1.1rem" }}
            >
              Looks like you haven't added anything to your cart yet.
              <br />
              Start shopping to fill it up!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              startIcon={<ShoppingCartIcon />}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                px: 4,
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
              Start Shopping
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={10} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
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
              Your Cart
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => clearCart()}
              startIcon={<DeleteIcon />}
              sx={{
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  backgroundColor: "rgba(244, 67, 54, 0.05)",
                },
              }}
            >
              Clear Cart
            </Button>
          </Box>

          <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <List>
          {cartItems.map((item, index) => {
            const product =
              typeof item.product === "string" ? null : item.product;
            const productId =
              typeof item.product === "string"
                ? item.product
                : item.product._id;

            return (
              <div key={item._id}>
                <ListItem
                  sx={{
                    py: 2,
                    "&:hover": {
                      bgcolor: "rgba(102, 126, 234, 0.02)",
                    },
                  }}
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          bgcolor: "rgba(102, 126, 234, 0.05)",
                          borderRadius: 2,
                          p: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateItem(
                              productId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          sx={{
                            bgcolor: "white",
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{
                            minWidth: 40,
                            textAlign: "center",
                            fontWeight: 600,
                            color: "#667eea",
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateItem(productId, item.quantity + 1)
                          }
                          sx={{
                            bgcolor: "white",
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeItem(productId)}
                        color="error"
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  {product && (
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={product.image}
                        alt={product.title}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                    </ListItemAvatar>
                  )}
                  <ListItemText
                    primary={product?.title || `Product ID: ${productId}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: "block" }}
                        >
                          Price: {item.unitPrice} EGP × {item.quantity} ={" "}
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
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            bgcolor: "rgba(102, 126, 234, 0.02)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Total:
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#667eea" }}
            >
              {totalPrice.toFixed(2)} EGP
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate("/checkout")}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: 600,
              py: 1.5,
              fontSize: "1.05rem",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              },
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
};

export default CartPage;
