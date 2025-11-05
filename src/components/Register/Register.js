import React from "react";
import "./Register.scss";
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

  return (
    <div className="register-container">
      {!otpStep ? (
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Sign Up</h2>
          {handleRegister && <p className="error">{error}</p>}

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

export default withHOC(registerProvider, Register);
