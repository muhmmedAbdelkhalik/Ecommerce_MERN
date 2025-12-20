import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Product } from "../types/products";
import { useCart } from "../context/cart/cartContext";
import { useAuth } from "../context/auth/authContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItem(product._id, 1);
  };

  return (
    <Card>
      <CardMedia
        sx={{ height: 140 }}
        image={product.image}
        title={product.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {product.price} EGP
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}
