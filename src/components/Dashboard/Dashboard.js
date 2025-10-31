import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopNav from "../Topnav/Topnav";
import Footer from "../Footer/Footer";
import "./Dashboard.scss";
import Profile from "../Profile/Profile";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Home");

  const handleMenuClick = (menu) => {
    if (menu === "Logout") {
      alert("Logged out successfully!");
      // Optionally, you can reset the active menu or redirect to login page
      setActiveMenu("Home");
    } else {
      setActiveMenu(menu);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Home":
        return (
          <>
            <h1>Home</h1>
            <p>Welcome to your Home! Here is your overview.</p>
          </>
        );
      case "Add Item":
        return (
          <>
            <h1>Profile</h1>
            <p>Manage your profile information here.</p>
          </>
        );
      case "Profile":
        return (
          <>
           <Profile/>
          </>
        );
        case "Logout":
          return (
            <>
            </>
          );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeMenu={activeMenu} setActiveMenu={handleMenuClick} />
      <div className="main-content">
        <TopNav />
        <div className="content">{renderContent()}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
