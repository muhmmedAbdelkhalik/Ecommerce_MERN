import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { Product } from "../types/products";
import { useCart } from "../context/cart/cartContext";
import { useAuth } from "../context/auth/authContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItem(product._id, 1);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: isHovered
          ? "0 8px 24px rgba(0, 0, 0, 0.15)"
          : "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Stock Badge */}
      {isOutOfStock && (
        <Chip
          label="Out of Stock"
          color="error"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}

      {/* Image Container */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          aspectRatio: "4/3",
        }}
      >
        <CardMedia
          component="img"
          image={
            imageError
              ? "https://via.placeholder.com/400x300?text=No+Image"
              : product.image
          }
          alt={product.title}
          onError={() => setImageError(true)}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease-in-out",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        {/* Overlay on hover */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isHovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
            transition: "background-color 0.3s ease-in-out",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2.5,
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: "#333",
            lineHeight: 1.3,
            minHeight: "3.2em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            mt: "auto",
            pt: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#667eea",
              fontSize: "1.5rem",
            }}
          >
            {product.price.toFixed(2)} EGP
          </Typography>
          {product.stock > 0 && product.stock < 10 && (
            <Chip
              label={`Only ${product.stock} left`}
              size="small"
              color="warning"
              sx={{ fontSize: "0.7rem", height: 24 }}
            />
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          startIcon={<ShoppingCartIcon />}
          sx={{
            backgroundColor: "#667eea",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            py: 1.2,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              backgroundColor: "#5568d3",
              boxShadow: "0 6px 16px rgba(102, 126, 234, 0.5)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              color: "#999",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
}
