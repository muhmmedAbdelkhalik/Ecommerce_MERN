import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ProductCard from "../components/productCard";
import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import type { IResponse } from "../types/response";
import { BASE_URL } from "../constants/baseUrl";
import { Box, CircularProgress, Typography, Paper, Alert } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";

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
        <CircularProgress sx={{ color: "white" }} size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={10} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
            <Alert severity="error" sx={{ fontSize: "1.1rem" }}>
              Error fetching products. Please try again later.
            </Alert>
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
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <StorefrontIcon sx={{ fontSize: 48 }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Our Products
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            Discover amazing products at great prices
          </Typography>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={4}>
          {products.map((product: Product, index: number) => (
            <Grid 
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
              key={product._id}
              sx={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {products.length === 0 && (
          <Paper
            elevation={10}
            sx={{
              p: 8,
              borderRadius: 3,
              textAlign: "center",
              mt: 4,
            }}
          >
            <StorefrontIcon sx={{ fontSize: 80, color: "#667eea", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              No Products Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back soon for new products!
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
