// ### With minor help from ChatGPT

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const NavbarMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = (
    <>
      <IconButton color="inherit" component={Link} to="/movies" title="Browse">
        <AutoAwesomeMotionIcon />
      </IconButton>
      <IconButton
        color="inherit"
        component={Link}
        to="/profile"
        title="Profile"
      >
        <AccountCircleIcon />
      </IconButton>
      <IconButton color="inherit" onClick={handleSignOut} title="Sign Out">
        <LogoutIcon />
      </IconButton>
    </>
  );

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          boxShadow:
            "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar sx={{ padding: { xs: 0, md: "12px" } }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              component={Link}
              to="/home"
              title="Home"
            >
              <HomeIcon fontSize="large" />
            </IconButton>
          </Typography>
          {isMobile ? (
            <IconButton color="inherit" onClick={toggleMenu}>
              <MenuIcon />
            </IconButton>
          ) : (
            menuItems
          )}
        </Toolbar>
        {isMobile && isMenuOpen && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              boxShadow:
                "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            {menuItems}
          </Box>
        )}
      </AppBar>
    </Box>
  );
};

export default NavbarMenu;
