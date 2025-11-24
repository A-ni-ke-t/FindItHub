// src/components/Auth/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login, verifyOtp } from "../../helpers/fakebackend_helper";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";

const Login = () => {
  const theme = useTheme();
  const { mode } = useColorMode(); // for any mode-specific tweaks (optional)
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();

  // Snackbar helper
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!emailAddress || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await login({ emailAddress, password });
      const resData = response?.data || response;

      if (resData.requiresOtp) {
        showSnackbar("OTP has been sent to your email.", "info");
        setOtpStep(true);
      } else if (resData.token) {
        localStorage.setItem("userToken", resData.token);
        localStorage.setItem("userInfo", JSON.stringify(resData.user));
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

  // OTP verification handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await verifyOtp({ emailAddress, otp });
      const resData = response?.data || response;

      if (resData.success) {
        localStorage.setItem("userToken", resData.token || "");
        localStorage.setItem("userInfo", JSON.stringify(resData.user || {}));
        showSnackbar("OTP verified successfully!", "success");
        navigate("/home");
      } else {
        showSnackbar(resData.message || "Invalid OTP. Try again.", "error");
      }
    } catch (err) {
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={(t) => ({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        // subtle gradient using theme colors for nicer depth
        background: `linear-gradient(135deg, ${t.palette.background.default} 0%, ${t.custom?.surfaceElevated ?? t.palette.background.elevated} 100%)`,
        color: t.palette.text.primary,
      })}
    >
      {/* Logo Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
            mr: 1,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Search />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
          FindItHub
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Welcome back! Login to continue
      </Typography>

      {/* Login Card */}
      <Card
        sx={{
          width: { xs: "92%", sm: 420 },
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          {!otpStep ? (
            <form onSubmit={handleLoginSubmit}>
              <Typography
                variant="h5"
                fontWeight="bold"
                align="center"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Login
              </Typography>

              {error && (
                <Typography color="error" align="center" mb={2}>
                  {error}
                </Typography>
              )}

              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                margin="normal"
                placeholder="Enter your email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ "aria-label": "email address" }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                margin="normal"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={showPassword ? "hide password" : "show password"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ "aria-label": "password" }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />
                <Link href="#" underline="hover" sx={{ color: theme.palette.primary.main }}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                color="primary"
                sx={{
                  mt: 2,
                  mb: 1,
                  borderRadius: 2,
                  py: 1.2,
                  fontSize: "1rem",
                }}
              >
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
              <Typography
                variant="h5"
                fontWeight="bold"
                align="center"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Verify OTP
              </Typography>

              <Typography align="center" color="text.secondary" mb={2}>
                Enter the OTP sent to <strong>{emailAddress}</strong>
              </Typography>

              <TextField
                fullWidth
                label="OTP"
                variant="outlined"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ "aria-label": "otp" }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                }}
                type="submit"
              >
                Verify OTP
              </Button>

              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1, color: theme.palette.primary.main }}
                onClick={() => {
                  setOtpStep(false);
                  setOtp("");
                }}
              >
                ← Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" mt={3}>
        Help reunite lost items with their owners
      </Typography>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loader Backdrop */}
      <Backdrop
        sx={(t) => ({ color: t.palette.primary.contrastText, zIndex: t.zIndex.drawer + 1 })}
        open={loading}
        aria-live="polite"
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Login;
