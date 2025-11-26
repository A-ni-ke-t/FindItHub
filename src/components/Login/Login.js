// src/components/Auth/Login.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Link,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login, verifyOtp, resendOtp } from "../../helpers/fakebackend_helper";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";

const Login = () => {
  const theme = useTheme();
  const { mode } = useColorMode();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  /** Show snackbar helper */
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /** -------------------------------
   *  Handle Resend OTP Timer
   * ------------------------------- */
  useEffect(() => {
    const expiryStr = localStorage.getItem("resendOtpExpiry");
    if (!expiryStr) return;

    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry)) return;

    const remaining = Math.ceil((expiry - Date.now()) / 1000);
    if (remaining <= 0) return;

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

  /** -------------------------------
   *  Login Handler
   * ------------------------------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailAddress || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const resData = await login({ emailAddress, password });

      if (resData.status === 403 && resData.message === "Please verify your email first") {
        showSnackbar("OTP has been sent to your email.", "info");
        setOtpStep(true);
      } else if (resData?.data?.token) {
        localStorage.setItem("userToken", resData.data.token);
        localStorage.setItem("userInfo", JSON.stringify(resData.data.user));
        showSnackbar("Login successful!", "success");
        navigate("/home");
      } else {
        showSnackbar(resData.message || "Unexpected response from server.", "error");
      }
    } catch (err) {
      showSnackbar("Invalid credentials. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------------
   *  OTP Verification Handler
   * ------------------------------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const resData = await verifyOtp({ emailAddress, otp });
      if (resData?.data?.token) {
        localStorage.setItem("userToken", resData.data.token);
        localStorage.setItem("userInfo", JSON.stringify(resData.data.user));
        showSnackbar("Login successful!", "success");
        navigate("/home");
      } else {
        showSnackbar(resData.message || "Unexpected response from server.", "error");
      }
    } catch (err) {
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------------
   *  Resend OTP Handler
   * ------------------------------- */
  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (isResendDisabled) return;

    setLoading(true);
    try {
      const resData = await resendOtp({ emailAddress });
      if (resData?.status === 200) {
        showSnackbar(resData.message, "success");

        // Start 30s timer
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
        showSnackbar(resData.message || "Unexpected response from server.", "error");
      }
    } catch (err) {
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------------
   *  Render
   * ------------------------------- */
  return (
    <Box
      sx={(t) => ({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: `linear-gradient(135deg, ${t.palette.background.default} 0%, ${t.custom?.surfaceElevated ?? t.palette.background.elevated} 100%)`,
        color: t.palette.text.primary,
      })}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40, mr: 1, color: theme.palette.primary.contrastText }}>
          <Search />
        </Avatar>
        <Typography variant="h5" fontWeight="bold">
          FindItHub
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Welcome back! Login to continue
      </Typography>

      <Card sx={{ width: { xs: "92%", sm: 420 }, borderRadius: 4, boxShadow: 3, backgroundColor: theme.palette.background.paper }}>
        <CardContent>
          {!otpStep ? (
            <form onSubmit={handleLoginSubmit}>
              <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
                Login
              </Typography>

              {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mt: 1 }}>
                <Link href="/forgot-password" underline="hover" sx={{ color: theme.palette.primary.main }}>
                  Forgot password?
                </Link>
              </Box>

              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, mb: 1, borderRadius: 2, py: 1.2, fontSize: "1rem" }}>
                Login
              </Button>

              <Typography align="center" sx={{ mt: 2, color: "text.secondary" }}>
                Don’t have an account?{" "}
                <Link href="/register" underline="hover" sx={{ color: theme.palette.primary.main }}>
                  Sign Up
                </Link>
              </Typography>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
                Verify OTP
              </Typography>

              <Typography align="center" color="text.secondary" mb={2}>
                Enter the OTP sent to <strong>{emailAddress}</strong>
              </Typography>

              <TextField fullWidth label="OTP" margin="normal" value={otp} onChange={(e) => setOtp(e.target.value)} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                <Button
                  type="button"
                  disabled={isResendDisabled}
                  onClick={handleResendOtp}
                  sx={{ color: theme.palette.primary.main }}
                >
                  {isResendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </Button>

                <Button
                  type="button"
                  sx={{ color: theme.palette.primary.main }}
                  onClick={() => {
                    setOtpStep(false);
                    setOtp("");
                  }}
                >
                  ← Back to Login
                </Button>
              </Box>

              <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} type="submit">
                Verify OTP
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" mt={3}>
        Help reunite lost items with their owners
      </Typography>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loader */}
      <Backdrop sx={{ color: theme.palette.primary.contrastText, zIndex: theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Login;
