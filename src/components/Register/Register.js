import React, { useState } from "react";
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
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Search,
} from "@mui/icons-material";
import withHOC from "../../common/hoc/with-hoc";
import { registerProvider, useRegisterContext } from "./provider";

const Register = () => {
  const {
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
  } = useRegisterContext();

  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #e0f7fa, #ffffff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "#00bcd4", width: 40, height: 40, mr: 1 }}>
          <Search sx={{ color: "#fff" }} />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color="#007c91">
          FindItHub
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create your account to get started
      </Typography>

      {/* Registration Card */}
      <Card sx={{ width: 380, borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {!otpStep ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister(e);
                showSnackbar("Processing your registration...", "info");
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                align="center"
                color="#374151"
                mb={2}
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
                value={formData.fullName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                name="emailAddress"
                type="email"
                margin="normal"
                placeholder="Enter your email"
                value={formData.emailAddress}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
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

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#00bcd4",
                  "&:hover": { backgroundColor: "#0097a7" },
                  borderRadius: 2,
                  py: 1.2,
                  fontSize: "1rem",
                  textTransform: "none",
                }}
              >
                Register
              </Button>

              <Typography align="center" sx={{ mt: 1, color: "text.secondary" }}>
                Already have an account?{" "}
                <Link href="/login" underline="hover" color="#00bcd4">
                  Login
                </Link>
              </Typography>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyOtp(e);
                showSnackbar("Verifying OTP...", "info");
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                align="center"
                color="#374151"
                mb={2}
              >
                Verify Your Email
              </Typography>

              <Typography align="center" color="text.secondary" mb={2}>
                Enter the OTP sent to{" "}
                <strong>{formData.emailAddress}</strong>
              </Typography>

              <TextField
                fullWidth
                label="OTP"
                variant="outlined"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#00bcd4",
                  "&:hover": { backgroundColor: "#0097a7" },
                }}
                type="submit"
              >
                Verify OTP
              </Button>

              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1, color: "#00bcd4" }}
                onClick={() => setOtpStep(false)}
              >
                ← Back to Register
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
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default withHOC(registerProvider, Register);
