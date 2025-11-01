import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all session data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");

    Swal.fire({
      title: "Logged Out",
      text: "You have been successfully logged out.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      navigate("/");
    });
  }, [navigate]);

  return null; // no UI, just logic
};

export default Logout;
