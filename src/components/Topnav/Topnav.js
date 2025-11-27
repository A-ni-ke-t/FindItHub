// src/components/Topnav/Topnav.jsx
import React from "react";
import { AppBar, Toolbar, Stack, Switch, Tooltip, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // moon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // sun
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";

const TopNav = ({ onMenuClick }) => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();

  const handleToggle = () => toggleColorMode();

  const sunColor = mode === "light" ? theme.palette.primary.main : theme.palette.text.secondary;
  const moonColor = mode === "dark" ? theme.palette.primary.main : theme.palette.text.secondary;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 3,
        py: 1,
        bgcolor: "background.paper",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          
          {/* ☀ Sun icon → Always sets mode to LIGHT */}
          <Tooltip title="Switch to light mode">
            <IconButton
              size="small"
              sx={{
                p: 0.5,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
              onClick={() => mode !== "light" && toggleColorMode()}
            >
              <Brightness7Icon sx={{ color: sunColor }} />
            </IconButton>
          </Tooltip>

          {/* Switch (works the same) */}
          <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <Switch
              checked={mode === "dark"}
              onChange={handleToggle}
              color="default"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: theme.palette.action.selected,
                },
                "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
          </Tooltip>

          {/* 🌙 Moon icon → Always sets mode to DARK */}
          <Tooltip title="Switch to dark mode">
            <IconButton
              size="small"
              sx={{
                p: 0.5,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
              onClick={() => mode !== "dark" && toggleColorMode()}
            >
              <Brightness4Icon sx={{ color: moonColor }} />
            </IconButton>
          </Tooltip>

        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
