// src/components/Auth/Login.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "../../helpers/fakebackend_helper";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";

const Login = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();

  // login states
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // resend OTP
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // snackbars
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // forgot / reset states
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [resetOpen, setResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetNew, setShowResetNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetOtp, setShowResetOtp] = useState(false);

  // helpers
  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  /** Resend OTP timer persisted across refresh */
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

  /** LOGIN */
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
      if (
        resData.status === 403 &&
        resData.message === "Please verify your email first"
      ) {
        showSnackbar("OTP has been sent to your email.", "info");
        setOtpStep(true);
      } else if (resData?.data?.token) {
        localStorage.setItem("userToken", resData.data.token);
        localStorage.setItem("userInfo", JSON.stringify(resData.data.user));
        showSnackbar("Login successful!", "success");
        navigate("/home");
      } else {
        showSnackbar(
          resData.message || "Unexpected response from server.",
          "error"
        );
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
        showSnackbar(
          resData.message || "Unexpected response from server.",
          "error"
        );
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
    e?.preventDefault();
    if (isResendDisabled) return;
    setLoading(true);
    try {
      const resData = await resendOtp({ emailAddress });
      if (resData?.status === 200) {
        showSnackbar(resData.message || "OTP resent.", "success");
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
        showSnackbar(
          resData.message || "Unexpected response from server.",
          "error"
        );
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
    e?.preventDefault();
    if (!forgotEmail) {
      showSnackbar("Please enter your email address.", "warning");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await forgotPassword({ emailAddress: forgotEmail });
      const ok = res?.ok ?? res?.status === 200;
      if (ok) {
        showSnackbar(
          res.message || "If your email exists, a reset OTP has been sent.",
          "success"
        );
        setForgotOpen(false);
        // automatically open reset dialog and prefill email
        setResetOpen(true);
        setResetOtp("");
        setResetNewPassword("");
        setResetConfirmPassword("");
        setShowResetNew(false);
        setShowResetConfirm(false);
        setResetOtp("");
        setResetEmailFromForgot(forgotEmail);
      } else {
        showSnackbar(res.message || "Failed to send reset OTP.", "error");
      }
    } catch (err) {
      console.error("forgotPassword error:", err);
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  // internal state to carry email from forgot -> reset flow
  const [resetEmailFromForgot, setResetEmailFromForgot] = useState("");

  /** RESET PASSWORD (use OTP + new password) */
  const closeResetDialog = () => setResetOpen(false);

  const handleResetSubmit = async (e) => {
    e?.preventDefault();
    // basic validation
    if (!resetEmailFromForgot && !forgotEmail && !emailAddress) {
      showSnackbar(
        "No email found. Please enter the email you used.",
        "warning"
      );
      return;
    }
    const emailForReset = resetEmailFromForgot || forgotEmail || emailAddress;
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
      const res = await resetPassword({
        emailAddress: emailForReset,
        otp: resetOtp,
        newPassword: resetNewPassword,
      });
      const ok = res?.ok ?? res?.status === 200;
      if (ok) {
        showSnackbar(
          res.message ||
            "Password reset successful. Please login with your new password.",
          "success"
        );
        setResetOpen(false);
        // optionally prefill login email
        setEmailAddress(emailForReset);
        setPassword("");
      } else {
        showSnackbar(res.message || "Failed to reset password.", "error");
      }
    } catch (err) {
      console.error("resetPassword error:", err);
      showSnackbar("Something went wrong. Please try again.", "error");
    } finally {
      setResetLoading(false);
    }
  };

  /* Render UI */
  return (
    <Box
      sx={(t) => ({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: `linear-gradient(135deg, ${
          t.palette.background.default
        } 0%, ${
          t.custom?.surfaceElevated ?? t.palette.background.elevated
        } 100%)`,
        color: t.palette.text.primary,
      })}
    >
      {/* Logo */}
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
        <Typography variant="h5" fontWeight="bold">
          FindItHub
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Welcome back! Login to continue
      </Typography>

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
                sx={{ mb: 2 }}
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
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                value={password}
                placeholder="Enter your password"
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
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Button
                  onClick={openForgotDialog}
                  variant="text"
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                >
                  Forgot password?
                </Button>
              </Box>

              <Button
                fullWidth
                variant="contained"
                type="submit"
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

              <Typography
                align="center"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Don’t have an account?{" "}
                <Button
                  href="/register"
                  variant="text"
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <Typography
                variant="h5"
                fontWeight="bold"
                align="center"
                sx={{ mb: 2 }}
              >
                Verify OTP
              </Typography>

              <Typography align="center" color="text.secondary" mb={2}>
                Enter the OTP sent to <strong>{emailAddress}</strong>
              </Typography>

              <TextField
                fullWidth
                label="OTP"
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Button
                  type="button"
                  disabled={isResendDisabled}
                  onClick={handleResendOtp}
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                >
                  {isResendDisabled
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </Button>

                <Button
                  type="button"
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: "none",
                  }}
                  onClick={() => {
                    setOtpStep(false);
                    setOtp("");
                  }}
                >
                  ← Back to Login
                </Button>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                type="submit"
              >
                Verify OTP
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary" mt={3}>
        Help reunite lost items with their owners
      </Typography>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotOpen}
        onClose={closeForgotDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleForgotSubmit} sx={{ pt: 1 }}>
            <TextField
              label="Email Address"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              fullWidth
              required
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              We'll send a reset OTP to your email if it's registered.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={closeForgotDialog}
            variant="text"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotSubmit}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { backgroundColor: theme.palette.action.selected },
            }}
            disabled={forgotLoading}
          >
            {forgotLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Send OTP"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog (appears after OTP sent) */}
      <Dialog
        open={resetOpen}
        onClose={closeResetDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Email"
              value={resetEmailFromForgot || forgotEmail || emailAddress}
              fullWidth
              disabled
            />
            <TextField
              label="OTP"
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value)}
              fullWidth
            />
            <TextField
              label="New Password"
              type={showResetNew ? "text" : "password"}
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              fullWidth
              helperText="Minimum 6 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowResetNew((s) => !s)}
                      edge="end"
                      size="small"
                    >
                      {showResetNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showResetConfirm ? "text" : "password"}
              value={resetConfirmPassword}
              onChange={(e) => setResetConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowResetConfirm((s) => !s)}
                      edge="end"
                      size="small"
                    >
                      {showResetConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={closeResetDialog}
            variant="text"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetSubmit}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { backgroundColor: theme.palette.action.selected },
            }}
            disabled={resetLoading}
          >
            {resetLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loader */}
      <Backdrop
        sx={{
          color: theme.palette.primary.contrastText,
          zIndex: theme.zIndex.drawer + 1,
        }}
        open={loading || forgotLoading || resetLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Login;
