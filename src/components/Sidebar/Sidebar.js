import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Home,
  Add,
  Logout,
  Search,
  Menu as MenuIcon,
  
} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const name = user.fullName || "User";

  const menuItems = [
    { name: "Home", path: "/home", icon: <Home /> },
    { name: "Add Item", path: "/additem", icon: <Add /> },
    { name: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          boxSizing: "border-box",
          backgroundColor: "#141824",
          color: "#fff",
          borderRight: "1px solid #1f2233",
          transition: "width 0.3s",
        },
      }}
    >
      {/* Header */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
          py: 3,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "#00bcd4",
                width: 32,
                height: 32,
              }}
            >
              <Search fontSize="small" />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              Find It Hub
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: "#fff" }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Menu Items */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              color: "#d1d5db",
              "&.Mui-selected": {
                backgroundColor: "#1f2937",
                color: "#00bcd4",
              },
              "&:hover": {
                backgroundColor: "#1f2937",
              },
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? "#00bcd4" : "#9ca3af",
                minWidth: collapsed ? "auto" : 40,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontSize: 15 }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ backgroundColor: "#2d2f3e" }} />

      {/* User Section */}
      <Box sx={{ p: 2 }}>
        {!collapsed && (
          <Box
            sx={{
              backgroundColor: "#1f2937",
              borderRadius: 2,
              p: 1.5,
              mb: 1.5,
            }}
          >
            <Typography variant="body2" color="#9ca3af">
              Welcome,
            </Typography>
            <Typography variant="body2" fontWeight="bold" noWrap>
              {name}
            </Typography>
          </Box>
        )}

        <ListItemButton
          onClick={() => navigate("/logout")}
          sx={{
            borderRadius: 2,
            color: "#9ca3af",
            "&:hover": {
              backgroundColor: "#1f2937",
              color: "#ef4444",
            },
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <ListItemIcon
            sx={{
              color: "#9ca3af",
              minWidth: collapsed ? "auto" : 40,
              justifyContent: "center",
            }}
          >
            <Logout />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" />}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
