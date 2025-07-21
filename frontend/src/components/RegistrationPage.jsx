import React, { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);
  const [showVerify, setShowVerify] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyMsg, setVerifyMsg] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1: request OTP, 2: enter OTP & new password
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess("Login successful!");
          setTimeout(() => navigate("/daily-entry"), 1000);
        } else {
          setError(data.message || "Login failed");
        }
      } else {
        // Register
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess("Signup successful! Please verify your email.");
          // Get userId for verification (fetch user data or ask backend to return it)
          // For now, ask user to check email for OTP
          setShowVerify(true);
        } else {
          setError(data.message || "Signup failed");
        }
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP (after signup)
  const handleSendOTP = async () => {
    setVerifyMsg("");
    setError("");
    setLoading(true);
    try {
      // Need userID, but since backend sets cookie, we can call /api/auth/send-verify-otp
      const res = await fetch("/api/auth/send-verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userID: null }), // userID is optional if backend uses cookie
      });
      const data = await res.json();
      if (data.success) {
        setVerifyMsg("OTP sent to your email.");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifyMsg("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userID: null, OTP: otp }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifyMsg("Email verified! You can now login.");
        setTimeout(() => {
          setShowVerify(false);
          setIsLogin(true);
        }, 1500);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Password Reset Handlers
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setResetMsg("OTP sent to your email.");
        setResetStep(2);
      } else {
        setResetMsg(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setResetMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          OTP: resetOtp,
          newPassword: resetNewPassword,
        }),
      });
      const data = await res.json();
      if (data.success === false && data.message && data.message.includes("Password hs been reset")) {
        setResetMsg("Password has been reset successfully! You can now login.");
        setTimeout(() => {
          setShowReset(false);
          setIsLogin(true);
        }, 1500);
      } else if (data.success) {
        setResetMsg("Password has been reset successfully! You can now login.");
        setTimeout(() => {
          setShowReset(false);
          setIsLogin(true);
        }, 1500);
      } else {
        setResetMsg(data.message || "Failed to reset password");
      }
    } catch (err) {
      setResetMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <img className="w-[150px] mb-10" src={logo} alt="MoneyTalk" />
      <div className="p-8 border border-blue-500 text-center shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {showReset ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
            {resetMsg && <div className="mb-2 text-blue-600">{resetMsg}</div>}
            {resetStep === 1 ? (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <input
                  type="email"
                  name="resetEmail"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="w-full p-2 mt-1 text-gray-900 rounded-md"
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="submit"
                  className="w-full border bg-blue-500 hover:border-blue-500 hover:bg-transparent text-white hover:text-black text-md font-medium py-2 px-4 rounded-md"
                  disabled={loading}
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  className="w-full border border-gray-400 text-gray-700 mt-2 py-2 px-4 rounded-md"
                  onClick={() => setShowReset(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="text"
                  name="resetOtp"
                  value={resetOtp}
                  onChange={e => setResetOtp(e.target.value)}
                  className="w-full p-2 mt-1 text-gray-900 rounded-md"
                  placeholder="Enter OTP"
                  required
                />
                <input
                  type="password"
                  name="resetNewPassword"
                  value={resetNewPassword}
                  onChange={e => setResetNewPassword(e.target.value)}
                  className="w-full p-2 mt-1 text-gray-900 rounded-md"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="submit"
                  className="w-full border bg-green-500 hover:border-green-500 hover:bg-transparent text-white hover:text-black text-md font-medium py-2 px-4 rounded-md"
                  disabled={loading}
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  className="w-full border border-gray-400 text-gray-700 mt-2 py-2 px-4 rounded-md"
                  onClick={() => setShowReset(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ) : showVerify ? (
          <div>
            <button
              onClick={handleSendOTP}
              className="mb-2 w-full border bg-blue-500 hover:border-blue-500 hover:bg-transparent text-white hover:text-black text-md font-medium py-2 px-4 rounded-md"
              disabled={loading}
            >
              Send OTP to Email
            </button>
            <form onSubmit={handleVerify} className="space-y-4 mt-2">
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full p-2 mt-1 text-gray-900 rounded-md"
                placeholder="Enter OTP"
              />
              <button
                type="submit"
                className="w-full border bg-green-500 hover:border-green-500 hover:bg-transparent text-white hover:text-black text-md font-medium py-2 px-4 rounded-md"
                disabled={loading}
              >
                Verify Email
              </button>
            </form>
            {verifyMsg && <div className="text-green-600 mt-2">{verifyMsg}</div>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 text-gray-900 rounded-md"
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 text-gray-900 rounded-md"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 text-gray-900 rounded-md"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="mt-5 w-full border bg-blue-500 hover:border-blue-500 hover:bg-transparent text-white hover:text-black text-md font-medium py-2 px-4 rounded-md"
              disabled={loading}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        )}
        <div className="mt-4 text-sm text-center flex justify-between">
          {isLogin ? (
            <button
              className="underline text-blue-600"
              onClick={() => {
                setShowReset(true);
                setResetStep(1);
                setResetMsg("");
                setResetEmail("");
                setResetOtp("");
                setResetNewPassword("");
              }}
            >
              Forgot Password?
            </button>
          ) : ""}
          <a
            href="#"
            className="underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
              setShowVerify(false);
              setShowReset(false);
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
