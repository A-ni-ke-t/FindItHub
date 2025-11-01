import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all session data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");

    
      navigate("/");
    
  }, [navigate]);

  return null; // no UI, just logic
};

export default Logout;
