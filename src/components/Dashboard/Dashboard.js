import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import TopNav from "../Topnav/Topnav";
import Footer from "../Footer/Footer";
import "./Dashboard.scss";
import Profile from "../Profile/Profile";
import Home from "../Home/Home";
import AddItem from "../AddItem/AddItem";
import Logout from "../Logout/Logout";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Home");

  const handleMenuClick = async (menu) => {
    if (menu === "Logout") {
      // Use SweetAlert for confirmation before logging out
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        setActiveMenu("Logout"); // triggers Logout component
      }
    } else {
      setActiveMenu(menu);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Home":
        return <Home />;
      case "Add Item":
        return <AddItem />;
      case "Profile":
        return <Profile />;
      case "Logout":
        return <Logout />; // now actually renders Logout component
      default:
        return <Home />;
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
