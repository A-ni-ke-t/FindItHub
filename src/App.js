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
import EditItem from "./components/AddItem/EditItem";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* Protected (Dashboard) pages — all wrapped in layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/additem" element={<AddItem />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
      {/* Other individual pages */}
      <Route path="/items/:id" element={<ItemDetails />} />
      <Route path="/edit/:id" element={<EditItem />} />
      </Route>


      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
