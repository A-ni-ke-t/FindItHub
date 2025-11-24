// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopNav from "../Topnav/Topnav";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import "./Dashboard.scss";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";

const DashboardLayout = () => {
  const theme = useTheme();
  const { mode } = useColorMode(); // read current mode if you need it
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="dashboard-container"
      style={{
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh"
      
      }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileOpen={() => setMobileOpen(true)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className="main-content"
        style={{ background: theme.palette.background.default }}
      >
        {/* TopNav now reads/toggles theme itself (see TopNav example below) */}
        <TopNav onMenuClick={() => setMobileOpen(true)} />

        <div
          className="content"
          style={{ background: theme.palette.background.default }}
        >
          <Outlet /> {/* This renders whatever child route matches */}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
