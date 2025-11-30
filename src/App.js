import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Home from "./components/Home/Home";
import AddItem from "./components/AddItem/AddItem";
import Logout from "./components/Logout/Logout";
import ItemDetails from "./components/Home/ItemDetails";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Profile from "./components/Profile/Profile";

function App() {
  // ProtectedRoute component defined inline
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected (Dashboard) pages — wrapped in layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/additem" element={<AddItem />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/items/:id" element={<ItemDetails />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
