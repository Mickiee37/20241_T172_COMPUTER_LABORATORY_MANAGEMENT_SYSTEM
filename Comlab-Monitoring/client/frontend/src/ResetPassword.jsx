import React, { useState } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.4:8000",
});

const ResetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateAndFormatPhoneNumber = (number) => {
    if (/^09\d{9}$/.test(number)) {
      return "+63" + number.substring(1);
    }
    if (/^\+639\d{9}$/.test(number)) {
      return number;
    }
    return null;
  };

  const handleApiCall = async (apiFunc) => {
    setIsLoading(true);
    setError("");
    try {
      await apiFunc();
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendResetOtp = () => {
    const formattedPhoneNumber = validateAndFormatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      setError("Invalid phone number format.");
      return;
    }
    handleApiCall(async () => {
      const response = await axiosInstance.post(
        "/api/reset-password/send-reset-otp",
        { phoneNumber: formattedPhoneNumber }
      );
      if (response.data.success) {
        setStep(2);
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    });
  };

  const verifyResetOtp = () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    const formattedPhoneNumber = validateAndFormatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      setError("Invalid phone number format.");
      return;
    }
    handleApiCall(async () => {
      const response = await axiosInstance.post(
        "/api/reset-password/verify-reset-otp",
        { phoneNumber: formattedPhoneNumber, otp }
      );
      if (response.data.success) {
        setStep(3);
      } else {
        setError(response.data.message || "Invalid OTP.");
      }
    });
  };

  const resetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const formattedPhoneNumber = validateAndFormatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      setError("Invalid phone number format.");
      return;
    }
    handleApiCall(async () => {
      const response = await axiosInstance.post(
        "/api/reset-password/reset-password",
        { phoneNumber: formattedPhoneNumber, newPassword }
      );
      if (response.data.success) {
        alert("Password reset successfully!");
        setStep(1);
        setPhoneNumber("");
        setOtp("");
        setNewPassword("");
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    });
  };

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      {step === 1 && (
        <div>
          <input
            type="text"
            aria-label="Phone number"
            placeholder="Enter your phone number (090XXXXXXXX or +639XXXXXXXXX)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={sendResetOtp} disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type="text"
            aria-label="OTP"
            placeholder="Enter the OTP sent to your phone"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyResetOtp} disabled={isLoading}>
            {isLoading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}
      {step === 3 && (
        <div>
          <input
            type="password"
            aria-label="New password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={resetPassword} disabled={isLoading}>
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPassword;
