import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopNav from "../Topnav/Topnav";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import "./Dashboard.scss";

const DashboardLayout = () => {
    const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
      <TopNav darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="content">
          <Outlet /> {/* This renders whatever child route matches */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
