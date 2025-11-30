import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp,registerUser } from "../../helpers/fakebackend_helper";
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
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

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

  useEffect(() => {
    if (confirmPassword && formData.password) {
      setConfirmError(
        confirmPassword === formData.password ? "" : "Passwords do not match"
      );
    }
  }, [confirmPassword, formData.password]);

  // 🔹 Step 1: Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault(); // ⬅️ STOP PAGE RELOAD

    const { fullName, emailAddress, password } = formData;

    // 🔹 Required field validation
    if (!fullName || !emailAddress || !password) {
      setError("Please fill in all fields");
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    // 🔹 Password validation
    if (password.length < 6) {
      showSnackbar("Password must be at least 6 characters.", "warning");
      return;
    }

    // 🔹 Confirm password validation
    if (confirmPassword !== password) {
      setConfirmError("Passwords do not match");
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 🔹 Call register API
      const response = await registerUser(formData);
      const resData = response?.data || response;


      if (resData.status === 200 || resData.success) {
        // 🔹 Move to OTP step
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
        err?.response?.data?.message ||
          "Registration failed. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e?.preventDefault) e.preventDefault();   // safe guard
  
    if (!otp || otp.toString().trim().length === 0) {
      setError("Please enter OTP");
      showSnackbar("Please enter OTP", "error");
      return;
    }
  
    setLoading(true);
  
    try {
      const otpData = { emailAddress: formData.emailAddress, otp };
      const response = await verifyOtp(otpData);
      const resData = response || response;
  
  
      if (resData.status === 200 && resData.success) {
        showSnackbar(
          resData.message || "Your email has been verified successfully!",
          "success"
        );
        if (resData.data.token) {
          localStorage.setItem("userToken", resData?.data?.token);
          localStorage.setItem("userInfo", JSON.stringify(resData?.data?.user));
          showSnackbar("Login successful!", "success");
          navigate("/home");
        }
      } else {
        showSnackbar(
          resData.message || "Invalid OTP. Please try again.",
          "error"
        );
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      showSnackbar(
        err?.response?.data?.message ||
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
      showPassword,
      setShowPassword,
      confirmPassword,
      setConfirmPassword,
      confirmError,
      setConfirmError,
      snackbar,
      setSnackbar,
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
      showPassword,
      setShowPassword,
      confirmPassword,
      setConfirmPassword,
      confirmError,
      setConfirmError,
      snackbar,
      setSnackbar,
    handleCloseSnackbar,
    ]
  );
};

export const [registerProvider, useRegisterContext] =
  generateContext(useRegisterProvider);
