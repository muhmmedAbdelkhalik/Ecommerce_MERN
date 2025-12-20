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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartPage = () => {
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your cart is empty
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Your Cart</Typography>
        <Button variant="outlined" color="error" onClick={() => clearCart()}>
          Clear Cart
        </Button>
      </Box>

      <Paper elevation={2}>
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
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateItem(
                              productId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{ minWidth: 30, textAlign: "center" }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateItem(productId, item.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeItem(productId)}
                        color="error"
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
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" fontWeight="bold">
            {totalPrice.toFixed(2)} EGP
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CartPage;
