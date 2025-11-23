import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Switch,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../theme/ThemeProvider"; // 👈 global context

const TopNav = () => {
  const { mode, toggleColorMode } = useColorMode(); // 👈 this controls MUI theme
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section */}
        <Stack direction="row" alignItems="center" spacing={4}>
          <Tooltip title="Gallery View">
            <Button
              startIcon={<ViewModuleIcon />}
              onClick={() => navigate("/home")}
              sx={{ color: "text.primary", textTransform: "none", fontWeight: 500 }}
            >
              Gallery View
            </Button>
          </Tooltip>

          <Tooltip title="Give Feedback">
            <Button
              startIcon={<FeedbackOutlinedIcon />}
              onClick={() => navigate("/feedback")}
              sx={{ color: "text.primary", textTransform: "none", fontWeight: 500 }}
            >
              Feedback
            </Button>
          </Tooltip>

          <Tooltip title="View My Reports">
            <Button
              startIcon={<DescriptionOutlinedIcon />}
              onClick={() => navigate("/my-reports")}
              sx={{ color: "text.primary", textTransform: "none", fontWeight: 500 }}
            >
              My Reports
            </Button>
          </Tooltip>
        </Stack>

        {/* Dark / Light Mode Toggle */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Brightness7Icon color={mode === "light" ? "primary" : "disabled"} />
          <Switch
            checked={mode === "dark"}
            onChange={toggleColorMode} // ✅ calls context toggle
            color="default"
          />
          <Brightness4Icon color={mode === "dark" ? "primary" : "disabled"} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
