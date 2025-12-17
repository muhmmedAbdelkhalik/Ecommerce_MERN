import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../context/auth/authContext";
import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const settings = ["Logout"];

function Navbar() {
  const { userName, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1.5, px: { xs: 2, sm: 0 } }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              mr: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            <ShoppingBagIcon
              sx={{
                fontSize: { xs: 28, md: 32 },
                mr: 1,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: { xs: "none", sm: "block" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                fontSize: { md: "1.25rem" },
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Ecommerce
            </Typography>
          </Box>

          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              flexGrow: 1,
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                fontSize: "1rem",
              }}
            >
              Ecommerce
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && (
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {userName}
                </Typography>
              </Box>
              <Tooltip title="Account settings" arrow>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <Avatar
                    alt={userName || ""}
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userName || "User"
                    )}&background=ffffff&color=667eea&bold=true&size=128`}
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "50px",
                  "& .MuiPaper-root": {
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    minWidth: 180,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    overflow: "hidden",
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Logout") {
                        logout();
                        navigate("/login");
                        handleCloseUserMenu();
                      }
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(102, 126, 234, 0.1)",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: "text.secondary" }} />
                    <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          {!isAuthenticated && (
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                alignItems: "center",
              }}
            >
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.6)",
                  textTransform: "none",
                  fontWeight: 600,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  borderRadius: 2,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#667eea",
                  textTransform: "none",
                  fontWeight: 600,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  borderRadius: 2,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
