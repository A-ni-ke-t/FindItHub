import React, { useState } from "react";
import "./Register.scss";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOtp } from "../../helpers/fakebackend_helper";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleRegister = async (e) => {
  e.preventDefault();
  const { fullName, emailAddress, password } = formData;

  if (!fullName || !emailAddress || !password) {
    setError("Please fill in all fields");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await registerUser(formData);
    console.log("Register response:", response);

    const resData = response?.data || response; // works for both raw or processed responses

    if (resData.status === 200) {
      await Swal.fire({
        title: "OTP Sent!",
        text: "An OTP has been sent to your registered email. Please verify to complete registration.",
        icon: "success",
        confirmButtonText: "Verify Now",
        confirmButtonColor: "#3085d6",
      });

      setOtpStep(true); // Move to OTP verification step
    } else {
      Swal.fire({
        title: "Error",
        text: resData?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  } catch (err) {
    console.error("Register error:", err);
    Swal.fire({
      title: "Registration Failed",
      text: err.response?.data?.message || "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false);
  }
};


  const handleVerifyOtp = async (e) => {
  e.preventDefault();

  if (!otp) {
    setError("Please enter OTP");
    return;
  }

  setLoading(true);
  try {
    const otpData = { emailAddress: formData.emailAddress, otp };
    const response = await verifyOtp(otpData);
    console.log("Verify OTP Response:", response);

    const resData = response?.data || response; // supports both raw & helper responses

    if (resData.status === 200 && resData.success) {
      await Swal.fire({
        title: "Email Verified 🎉",
        text: resData.message || "Your email has been successfully verified!",
        icon: "success",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#3085d6",
      });

      navigate("/");
    } else {
      Swal.fire({
        title: "Invalid OTP",
        text: resData.message || "Please try again with the correct OTP.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  } catch (err) {
    console.error("Verify OTP error:", err);
    Swal.fire({
      title: "Verification Failed",
      text: err.response?.data?.message || "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="register-container">
      {!otpStep ? (
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="login-link">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>
      ) : (
        <form className="register-form" onSubmit={handleVerifyOtp}>
          <h2>Verify Your Email</h2>
          {error && <p className="error">{error}</p>}
          <p className="info">
            Enter the OTP sent to <strong>{formData.emailAddress}</strong>
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
            ← Back to Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
