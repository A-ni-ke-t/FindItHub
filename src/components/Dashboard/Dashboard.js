import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopNav from "../Topnav/Topnav";
import Footer from "../Footer/Footer";
import "./Dashboard.scss";
import Profile from "../Profile/Profile";
import Home from "../Home/Home";
import AddItem from "../AddItem/AddItem";

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
           <Home/>
          </>
        );
      case "Add Item":
        return (
          <>
           <AddItem/>
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
