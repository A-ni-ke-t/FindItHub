// src/components/Auth/Login.jsx
import React from "react";
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
  InputAdornment as MInputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Search,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";
import withHOC from "../../common/hoc/with-hoc";
import { loginProvider, useLoginContext } from "./provider";

const Login = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  // consume all state/actions from provider
  const {
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
    loading,
    snackbar,
    handleCloseSnackbar,
    handleLoginSubmit,
    handleVerifyOtp,
    isResendDisabled,
    resendTimer,
    handleResendOtp,
    // forgot/reset
    forgotOpen,
    openForgotDialog,
    closeForgotDialog,
    forgotEmail,
    setForgotEmail,
    forgotLoading,
    handleForgotSubmit,
    resetOpen,
    closeResetDialog,
    resetOtp,
    setResetOtp,
    resetNewPassword,
    setResetNewPassword,
    resetConfirmPassword,
    setResetConfirmPassword,
    resetLoading,
    handleResetSubmit,
    showResetNew,
    setShowResetNew,
    showResetConfirm,
    setShowResetConfirm,
    resetEmailFromForgot,
    setResetEmailFromForgot,
  } = useLoginContext();

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
              <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
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
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mt: 1 }}>
                <Button onClick={openForgotDialog} variant="text" sx={{ color: theme.palette.primary.main, textTransform: "none" }}>
                  Forgot password?
                </Button>
              </Box>

              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, mb: 1, borderRadius: 2, py: 1.2, fontSize: "1rem" }}>
                Login
              </Button>

              <Typography align="center" sx={{ mt: 2, color: "text.secondary" }}>
                Don’t have an account?{" "}
                <Button href="/register" variant="text" sx={{ color: theme.palette.primary.main, textTransform: "none" }}>
                  Sign Up
                </Button>
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
                <Button type="button" disabled={isResendDisabled} onClick={handleResendOtp} sx={{ color: theme.palette.primary.main, textTransform: "none" }}>
                  {isResendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </Button>

                <Button type="button" sx={{ color: theme.palette.primary.main, textTransform: "none" }} onClick={() => { setOtpStep(false); setOtp(""); }}>
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

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={closeForgotDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleForgotSubmit} sx={{ pt: 1 }}>
            <TextField label="Email Address" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} fullWidth required />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              We'll send a reset OTP to your email if it's registered.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeForgotDialog} variant="text" sx={{ textTransform: "none" }}>Cancel</Button>
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
            {forgotLoading ? <CircularProgress size={18} color="inherit" /> : "Send OTP"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onClose={closeResetDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Email" value={resetEmailFromForgot || forgotEmail || emailAddress} fullWidth disabled />
            <TextField label="OTP" value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} fullWidth />
            <TextField
              label="New Password"
              type={showResetNew ? "text" : "password"}
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              fullWidth
              helperText="Minimum 6 characters"
              InputProps={{
                endAdornment: (
                  <MInputAdornment position="end">
                    <IconButton onClick={() => setShowResetNew((s) => !s)} edge="end" size="small">
                      {showResetNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </MInputAdornment>
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
                  <MInputAdornment position="end">
                    <IconButton onClick={() => setShowResetConfirm((s) => !s)} edge="end" size="small">
                      {showResetConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </MInputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeResetDialog} variant="text" sx={{ textTransform: "none" }}>Cancel</Button>
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
            {resetLoading ? <CircularProgress size={18} color="inherit" /> : "Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loader */}
      <Backdrop sx={{ color: theme.palette.primary.contrastText, zIndex: theme.zIndex.drawer + 1 }} open={loading || forgotLoading || resetLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default withHOC(loginProvider, Login);
