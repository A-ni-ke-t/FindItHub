// src/components/Sidebar/Sidebar.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  useMediaQuery,
} from "@mui/material";
import {
  Home,
  Add,
  Logout,
  Search,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";
import logoDark from "../../assets/Logo/Findithub_Dark.png"
import logoLight from "../../assets/Logo/Findithub_Light.png"
const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

const Sidebar = ({ mobileOpen: mobileOpenProp, onMobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [user, setUser] = useState(() => safeParse(localStorage.getItem("userInfo") || "{}"));

  const { mode } = useColorMode();

  // effective open state (controlled by parent if mobileOpenProp provided)
  const mobileOpen = typeof mobileOpenProp === "boolean" ? mobileOpenProp : internalMobileOpen;

  // helpers to open/close in either controlled or internal mode
  const handleOpenMobile = () => {
    if (typeof mobileOpenProp === "boolean") {
      if (typeof onMobileOpen === "function") onMobileOpen();
    } else {
      setInternalMobileOpen(true);
    }
  };

  const handleCloseMobile = () => {
    if (typeof mobileOpenProp === "boolean") {
      if (typeof onMobileClose === "function") onMobileClose();
    } else {
      setInternalMobileOpen(false);
    }
  };

  // close temporary drawer when switching to desktop
  useEffect(() => {
    if (isMdUp) setInternalMobileOpen(false);
  }, [isMdUp]);

  

   const refreshUserFromStorage = useCallback(() => {
    const updated = safeParse(localStorage.getItem("userInfo") || "{}");
    setUser(updated);
  }, []);

  useEffect(() => {
    // listen for our custom event (fired in same window)
    const onCustom = () => refreshUserFromStorage();
    window.addEventListener("userInfoChanged", onCustom);

    // also listen for 'storage' so other tabs/windows can update the UI
    const onStorage = (ev) => {
      if (!ev) return;
      if (ev.key === "userInfo" || ev.key === "userInfo_updatedAt") {
        refreshUserFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("userInfoChanged", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshUserFromStorage]);

  const name = user.fullName || "User";

  const menuItems = [
    { name: "Home", path: "/home", icon: <Home /> },
    { name: "Add Item", path: "/additem", icon: <Add /> },
    { name: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
     <Toolbar
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-between",
    px: 2,
    py: 2,
  }}
>
  {!collapsed && (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        component="img"
        src={mode === "light" ? logoLight : logoDark}
        alt="Find It Hub"
        sx={{
          height: { xs: 26, sm: 30 },
          width: "auto",
          display: "block",
        }}
      />

      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: theme.palette.text.primary, lineHeight: 1.2 }}
        noWrap
      >
        Find It Hub
      </Typography>
    </Box>
  )}

  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {isMdUp && (
      <IconButton
        onClick={() => setCollapsed((s) => !s)}
        sx={{
          color: theme.palette.text.primary,
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
        size="small"
        aria-label={collapsed ? "expand sidebar" : "collapse sidebar"}
      >
        <MenuIcon />
      </IconButton>
    )}

    {!isMdUp && (
      <IconButton
        onClick={handleCloseMobile}
        sx={{
          color: theme.palette.text.primary,
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
        size="small"
        aria-label="close sidebar"
      >
        <CloseIcon />
      </IconButton>
    )}
  </Box>
</Toolbar>


      <Divider sx={{ backgroundColor: theme.palette.divider }} />

      {/* Menu Items */}
      <List sx={{ px: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.name}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                // close mobile drawer after navigation
                if (!isMdUp) handleCloseMobile();
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: theme.palette.text.primary,
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "background-color 0.15s",
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                  color: theme.palette.primary.main,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                  minWidth: collapsed ? "auto" : 40,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: 15,
                    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ backgroundColor: theme.palette.divider }} />

      {/* User Section */}
      <Box sx={{ p: 2 }}>
        {!collapsed && (
          <Box
            sx={{
              backgroundColor: theme.palette.action.selected,
              borderRadius: 2,
              p: 1.25,
              mb: 1.5,
            }}
          >
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Welcome
            </Typography>
            <Typography variant="body2" fontWeight="bold" noWrap color={theme.palette.text.primary}>
              {name}
            </Typography>
          </Box>
        )}

        <ListItemButton
          onClick={() => {
            navigate("/logout");
            if (!isMdUp) handleCloseMobile();
          }}
          sx={{
            borderRadius: 2,
            color: theme.palette.text.secondary,
            justifyContent: collapsed ? "center" : "flex-start",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.error.main,
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: theme.palette.text.secondary,
              minWidth: collapsed ? "auto" : 40,
              justifyContent: "center",
            }}
          >
            <Logout />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Logout" primaryTypographyProps={{ color: theme.palette.text.secondary }} />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile floating menu button */}
      {!isMdUp && (
        <Box
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: (t) => t.zIndex.drawer + 10,
            borderRadius: 1,
            backgroundColor: "transparent",
          }}
        >
          <IconButton
            onClick={handleOpenMobile}
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: 2,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
            aria-label="open menu"
            size="large"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Permanent drawer for md+ */}
      {isMdUp ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRight: "1px solid",
              borderColor: theme.palette.divider,
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Temporary drawer for small screens
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleCloseMobile}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: drawerWidthExpanded,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          }}
          sx={{
            zIndex: (t) => t.zIndex.drawer + 30,
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
