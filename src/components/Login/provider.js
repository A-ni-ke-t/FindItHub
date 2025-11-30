// src/components/Auth/provider.js
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import generateContext from "../../common/context/generateContext";
import {
  login as apiLogin,
  verifyOtp as apiVerifyOtp,
  resendOtp as apiResendOtp,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
} from "../../helpers/fakebackend_helper";

/**
 * Login provider — centralizes all logic for Login.jsx
 */
const useLoginProvider = () => {
  const navigate = useNavigate();

  // login / otp states
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // loading & snackbar
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // resend OTP timer
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // forgot / reset flows
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetNew, setShowResetNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // to carry email from forgot -> reset
  const [resetEmailFromForgot, setResetEmailFromForgot] = useState("");

  // helpers for snackbar
  const showSnackbar = (message, severity = "info") => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  // persist resend-otp timer across refresh
  useEffect(() => {
    const expiryStr = localStorage.getItem("resendOtpExpiry");
    if (!expiryStr) return;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry)) return;
    const remaining = Math.ceil((expiry - Date.now()) / 1000);
    if (remaining <= 0) {
      localStorage.removeItem("resendOtpExpiry");
      return;
    }

    setIsResendDisabled(true);
    setResendTimer(remaining);

    const interval = setInterval(() => {
      const timeLeft = Math.ceil((expiry - Date.now()) / 1000);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsResendDisabled(false);
        setResendTimer(30);
        localStorage.removeItem("resendOtpExpiry");
      } else {
        setResendTimer(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /** LOGIN */
  const handleLoginSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!emailAddress || !password) {
      setError("Please fill in all fields");
      showSnackbar("Please fill in all fields", "warning");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const resData = await apiLogin({ emailAddress, password });

      if (resData?.status === 403 && resData?.message === "Please verify your email first") {
        showSnackbar("OTP has been sent to your email.", "info");
        setOtpStep(true);
      } else if (resData?.data?.token) {
        localStorage.setItem("userToken", resData.data.token);
        localStorage.setItem("userInfo", JSON.stringify(resData.data.user));
        showSnackbar("Login successful!", "success");
        navigate("/home");
      } else {
        showSnackbar(resData?.message || "Unexpected response from server.", "error");
      }
    } catch (err) {
      console.error("login error:", err);
      showSnackbar("Invalid credentials. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** VERIFY OTP after login */
  const handleVerifyOtp = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!otp) {
      setError("Please enter OTP");
      showSnackbar("Please enter OTP", "warning");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const resData = await apiVerifyOtp({ emailAddress, otp });
      if (resData?.data?.token) {
        localStorage.setItem("userToken", resData.data.token);
        localStorage.setItem("userInfo", JSON.stringify(resData.data.user));
        showSnackbar("Login successful!", "success");
        navigate("/home");
      } else {
        showSnackbar(resData?.message || "Unexpected response from server.", "error");
      }
    } catch (err) {
      console.error("verifyOtp error:", err);
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** RESEND OTP */
  const handleResendOtp = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isResendDisabled) return;
    setLoading(true);
    try {
      const resData = await apiResendOtp({ emailAddress });
      if (resData?.status === 200) {
        showSnackbar(resData?.message || "OTP resent.", "success");
        const expiry = Date.now() + 30 * 1000;
        localStorage.setItem("resendOtpExpiry", expiry.toString());
        setIsResendDisabled(true);
        setResendTimer(30);
        const interval = setInterval(() => {
          const timeLeft = Math.ceil((expiry - Date.now()) / 1000);
          if (timeLeft <= 0) {
            clearInterval(interval);
            setIsResendDisabled(false);
            setResendTimer(30);
            localStorage.removeItem("resendOtpExpiry");
          } else {
            setResendTimer(timeLeft);
          }
        }, 1000);
      } else {
        showSnackbar(resData?.message || "Unexpected response from server.", "error");
      }
    } catch (err) {
      console.error("resendOtp error:", err);
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** FORGOT PASSWORD (request OTP) */
  const openForgotDialog = () => {
    setForgotEmail(emailAddress || "");
    setForgotOpen(true);
  };
  const closeForgotDialog = () => setForgotOpen(false);

  const handleForgotSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!forgotEmail) {
      showSnackbar("Please enter your email address.", "warning");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await apiForgotPassword({ emailAddress: forgotEmail });
      const ok = res?.ok ?? res?.status === 200;
      if (ok) {
        showSnackbar(res?.message || "If your email exists, a reset OTP has been sent.", "success");
        setForgotOpen(false);
        // open reset dialog
        setResetOpen(true);
        setResetOtp("");
        setResetNewPassword("");
        setResetConfirmPassword("");
        setShowResetNew(false);
        setShowResetConfirm(false);
        setResetEmailFromForgot(forgotEmail);
      } else {
        showSnackbar(res?.message || "Failed to send reset OTP.", "error");
      }
    } catch (err) {
      console.error("forgotPassword error:", err);
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  /** RESET PASSWORD (use OTP + new password) */
  const closeResetDialog = () => setResetOpen(false);

  const handleResetSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    // pick email
    const emailForReset = resetEmailFromForgot || forgotEmail || emailAddress;
    if (!emailForReset) {
      showSnackbar("No email found. Please enter the email you used.", "warning");
      return;
    }
    if (!resetOtp) {
      showSnackbar("Please enter the OTP sent to your email.", "warning");
      return;
    }
    if (!resetNewPassword || !resetConfirmPassword) {
      showSnackbar("Please enter the new password and confirm it.", "warning");
      return;
    }
    if (resetNewPassword.length < 6) {
      showSnackbar("Password must be at least 6 characters.", "warning");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    setResetLoading(true);
    try {
      const res = await apiResetPassword({ emailAddress: emailForReset, otp: resetOtp, newPassword: resetNewPassword });
      const ok = res?.ok ?? res?.status === 200;
      if (ok) {
        showSnackbar(res?.message || "Password reset successful. Please login with your new password.", "success");
        setResetOpen(false);
        setEmailAddress(emailForReset);
        setPassword("");
      } else {
        showSnackbar(res?.message || "Failed to reset password.", "error");
      }
    } catch (err) {
      console.error("resetPassword error:", err);
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setResetLoading(false);
    }
  };

  return useMemo(
    () => ({
      // login fields
      emailAddress,
      setEmailAddress,
      password,
      setPassword,
      otp,
      setOtp,
      otpStep,
      setOtpStep,
      showPassword,
      setShowPassword,
      error,
      setError,

      // loading / snackbar
      loading,
      snackbar,
      showSnackbar,
      handleCloseSnackbar,

      // resend / timer
      isResendDisabled,
      resendTimer,
      handleResendOtp,

      // actions
      handleLoginSubmit,
      handleVerifyOtp,

      // forgot/reset
      forgotOpen,
      setForgotOpen,
      forgotEmail,
      setForgotEmail,
      forgotLoading,
      openForgotDialog,
      closeForgotDialog,
      handleForgotSubmit,

      resetOpen,
      setResetOpen,
      resetOtp,
      setResetOtp,
      resetNewPassword,
      setResetNewPassword,
      resetConfirmPassword,
      setResetConfirmPassword,
      resetLoading,
      closeResetDialog,
      handleResetSubmit,
      showResetNew,
      setShowResetNew,
      showResetConfirm,
      setShowResetConfirm,
      resetEmailFromForgot,
      setResetEmailFromForgot,
    }),
    [
      emailAddress,
      password,
      otp,
      otpStep,
      showPassword,
      error,
      loading,
      snackbar,
      isResendDisabled,
      resendTimer,
      forgotOpen,
      forgotEmail,
      forgotLoading,
      resetOpen,
      resetOtp,
      resetNewPassword,
      resetConfirmPassword,
      resetLoading,
      showResetNew,
      showResetConfirm,
      resetEmailFromForgot,
    ]
  );
};

export const [loginProvider, useLoginContext] = generateContext(useLoginProvider);
