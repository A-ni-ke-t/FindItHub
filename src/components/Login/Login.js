import React, { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { login, verifyOtp } from "../../helpers/fakebackend_helper";
import Swal from "sweetalert2";

const Login = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const navigate = useNavigate();

  // Step 1: Login API
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!emailAddress || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userData = { emailAddress, password };
      const response = await login(userData);

      console.log("Login API Response:", response.data);
      const resData = response?.data || response;

      if (resData.requiresOtp) {
        await Swal.fire({
          title: "OTP Required",
          text: "An OTP has been sent to your email for verification.",
          icon: "info",
          confirmButtonText: "Verify Now",
          confirmButtonColor: "#3085d6",
        });
        setOtpStep(true);
      } else if (resData.token) {
        localStorage.setItem("userToken", resData.token);
        localStorage.setItem("userInfo", JSON.stringify(resData.user));

        

        navigate("/dashboard");
      } else {
        Swal.fire({
          title: "Login Error",
          text: resData.message || "Unexpected response from server.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Login Error:", err);
      Swal.fire({
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const otpData = { emailAddress, otp };
      const response = await verifyOtp(otpData);
      const resData = response?.data || response;
      console.log("Verify OTP Response:", resData);

      if (resData.status === 200 && resData.success) {
        await Swal.fire({
          title: "OTP Verified 🎉",
          text: resData.message || "Verification successful. You are now logged in!",
          icon: "success",
          confirmButtonText: "Go to Dashboard",
          confirmButtonColor: "#3085d6",
        });

        // Save login details and redirect
        localStorage.setItem("userToken", resData.token || "");
        localStorage.setItem("userInfo", JSON.stringify(resData.user || {}));
        navigate("/dashboard");
      } else {
        Swal.fire({
          title: "Invalid OTP",
          text: resData.message || "Please check the OTP and try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("OTP Error:", err);
      Swal.fire({
        title: "OTP Verification Failed",
        text: err.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {!otpStep ? (
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="register-link">
            Don’t have an account? <a href="/register">Sign Up</a>
          </div>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleVerifyOtp}>
          <h2>Verify OTP</h2>
          {error && <p className="error">{error}</p>}

          <p className="info">
            Enter the OTP sent to <strong>{emailAddress}</strong>
          </p>

          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => setOtpStep(false)}
          >
            ← Back to Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
