import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ProductCard from "../components/productCard";
import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import type { IResponse } from "../types/response";
import { BASE_URL } from "../constants/baseUrl";
import { Box, CircularProgress, Typography } from "@mui/material";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product`);
        const data: IResponse<Product> =
          (await response.json()) as IResponse<Product>;
        setProducts(data.data || []);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Error fetching products</Typography>
      </Box>
    );
  }
  return loading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {products.map((product: Product) => (
          <Grid size={{ xs: 12, md: 4 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
