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

  // Switch's onChange passes (event, checked) — wrap to call toggleColorMode directly
  const handleToggle = () => toggleColorMode();

  // icon colors derived from theme so they adapt to light/dark
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
          <Tooltip title="Light mode">
            <IconButton
              size="small"
              aria-hidden
              sx={{
                p: 0.5,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <Brightness7Icon sx={{ color: sunColor }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <Switch
              checked={mode === "dark"}
              onChange={handleToggle}
              inputProps={{ "aria-label": "toggle dark mode" }}
              color="default"
              sx={{
                // subtle theming for the switch thumb/track
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: theme.palette.action.selected,
                },
                "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
          </Tooltip>

          <Tooltip title="Dark mode">
            <IconButton
              size="small"
              aria-hidden
              sx={{
                p: 0.5,
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
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
