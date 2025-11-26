// src/components/Auth/Register.jsx
import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Avatar,
  IconButton,
  Link,
  Stack,
} from "@mui/material";
import {
  Person,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Search as SearchIcon,
} from "@mui/icons-material";
import withHOC from "../../common/hoc/with-hoc";
import { registerProvider, useRegisterContext } from "./provider";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/ThemeProvider";

const Register = () => {
  const theme = useTheme();
  const { mode } = useColorMode();

  const {
    otpStep,
    handleRegister,
    error,
    formData,
    handleChange,
    loading,
    setOtp,
    setOtpStep,
    otp,
    showPassword,
    setShowPassword,
    confirmPassword,
    setConfirmPassword,
    confirmError,
    snackbar,
    onSubmitOtp,
    handleCloseSnackbar,
  } = useRegisterContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: (t) =>
          t.palette.mode === "light"
            ? `linear-gradient(135deg, ${t.palette.background.default} 0%, ${
                t.custom?.surfaceElevated ?? t.palette.background.paper
              } 100%)`
            : `linear-gradient(135deg, ${t.palette.background.default} 0%, ${t.palette.background.paper} 100%)`,
        color: theme.palette.text.primary,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 44,
            height: 44,
            mr: 1,
            color: theme.palette.primary.contrastText,
          }}
        >
          <SearchIcon />
        </Avatar>
        <Typography
          variant="h5"
          fontWeight="700"
          sx={{ color: theme.palette.text.primary }}
        >
          FindItHub
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create your account to get started
      </Typography>

      <Card
        sx={{
          width: { xs: "92%", sm: 420 },
          borderRadius: 3,
          boxShadow: 6,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          {!otpStep ? (
            <form onSubmit={handleRegister}>
              <Typography
                variant="h5"
                fontWeight="700"
                align="center"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Sign Up
              </Typography>

              {error && (
                <Typography color="error" align="center" mb={2}>
                  {error}
                </Typography>
              )}

              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="fullName"
                margin="normal"
                placeholder="Enter your full name"
                value={formData.fullName || ""}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ "aria-label": "full name" }}
              />

              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                name="emailAddress"
                type="email"
                margin="normal"
                placeholder="Enter your email"
                value={formData.emailAddress || ""}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ "aria-label": "email address" }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                placeholder="Enter your password"
                value={formData.password || ""}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        aria-label={
                          showPassword ? "hide password" : "show password"
                        }
                        size="large"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ "aria-label": "password" }}
                helperText="Minimum 6 characters"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                margin="normal"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        aria-label={
                          showPassword ? "hide password" : "show password"
                        }
                        size="large"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!confirmError}
                helperText={confirmError || ""}
                inputProps={{ "aria-label": "confirm password" }}
                sx={{ mb: 1 }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  mt: 2,
                  mb: 1,
                  borderRadius: 2,
                  py: 1.25,
                  fontSize: "1rem",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": { backgroundColor: theme.palette.action.selected },
                }}
              >
                Register
              </Button>

              <Typography
                align="center"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Login
                </Link>
              </Typography>
            </form>
          ) : (
            <form onSubmit={onSubmitOtp}>
              <Typography
                variant="h5"
                fontWeight="700"
                align="center"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Verify Your Email
              </Typography>

              <Typography align="center" color="text.secondary" mb={2}>
                Enter the OTP sent to <strong>{formData.emailAddress}</strong>
              </Typography>

              <TextField
                fullWidth
                label="OTP"
                variant="outlined"
                placeholder="Enter 6-digit OTP"
                value={otp || ""}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ "aria-label": "otp" }}
                sx={{ mb: 2 }}
              />

              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    textTransform: "none",
                  }}
                  type="submit"
                >
                  Verify OTP
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setOtpStep(false)}
                  sx={{
                    textTransform: "none",
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                  }}
                >
                  ← Back to Register
                </Button>
              </Stack>
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
        autoHideDuration={3500}
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

      {/* Loader Backdrop */}
      <Backdrop
        sx={(t) => ({
          color: t.palette.primary.contrastText,
          zIndex: t.zIndex.drawer + 1,
        })}
        open={loading}
        aria-live="polite"
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default withHOC(registerProvider, Register);
