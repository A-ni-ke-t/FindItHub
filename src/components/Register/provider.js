import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "./service";
import { verifyOtp } from "../../helpers/fakebackend_helper";
import generateContext from "../../common/context/generateContext";

/**
 * Register Provider (Refactored)
 * - Removed SweetAlert2
 * - Added Snackbar + Backdrop Loader system (controlled by Register.js)
 */

const useRegisterProvider = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  // 🔹 Helper function to show snackbars
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Step 1: Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, emailAddress, password } = formData;

    if (!fullName || !emailAddress || !password) {
      setError("Please fill in all fields");
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await register(formData);
      const resData = response?.data || response;
      console.log("Register API Response:", resData);

      if (resData.status === 200 || resData.success) {
        setOtpStep(true);
        showSnackbar(
          "OTP sent to your email. Please verify to complete registration.",
          "success"
        );
      } else {
        showSnackbar(
          resData?.message || "Something went wrong during registration.",
          "error"
        );
      }
    } catch (err) {
      console.error("Register error:", err);
      showSnackbar(
        err.response?.data?.message ||
          "Registration failed. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter OTP");
      showSnackbar("Please enter OTP", "error");
      return;
    }

    setLoading(true);

    try {
      const otpData = { emailAddress: formData.emailAddress, otp };
      const response = await verifyOtp(otpData);
      const resData = response?.data || response;

      console.log("Verify OTP Response:", resData);

      if (resData.status === 200 && resData.success) {
        showSnackbar(
          resData.message || "Your email has been verified successfully!",
          "success"
        );
        setTimeout(() => navigate("/"), 1000);
      } else {
        showSnackbar(resData.message || "Invalid OTP. Please try again.", "error");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      showSnackbar(
        err.response?.data?.message ||
          "Something went wrong. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Return everything for context
  return useMemo(
    () => ({
      otpStep,
      handleRegister,
      error,
      formData,
      handleChange,
      handleVerifyOtp,
      loading,
      setOtp,
      setOtpStep,
      otp,
      snackbar,
      showSnackbar,
      handleCloseSnackbar,
    }),
    [
      otpStep,
      handleRegister,
      error,
      formData,
      handleChange,
      handleVerifyOtp,
      loading,
      setOtp,
      setOtpStep,
      otp,
      snackbar,
    ]
  );
};

export const [registerProvider, useRegisterContext] =
  generateContext(useRegisterProvider);
