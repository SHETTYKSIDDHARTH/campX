import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import axios from "axios";
import { BackendURL } from "../../config.js";

function Signup() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    usn: "",
    password: "",
    role: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // "signup" | "otp"
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getOtp = async () => {
    const { name, email, usn, password, role } = formData;
    if (!name || !email || !usn || !password || !role) {
      setStatus("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setStatus("");
      const res = await axios.post(`${BackendURL}/auth/send-otp`, formData);
      setStatus(res.data.message || "OTP sent successfully");
      setStep("otp");
    } catch (error) {
      setStatus(error.response?.data?.message || "Error while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setStatus("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setStatus("");
      const res = await axios.post(`${BackendURL}/auth/verify-otp`, {
        email: formData.email,
        otp,
      });

      setStatus(res.data.message || "Signup completed");

      if (res.status === 201 || res.data.success) {
        setStep("done");
        // redirect after 2s
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setStatus(error.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div
              className="text-xl sm:text-2xl font-bold text-white tracking-wide cursor-pointer"
              onClick={() => navigate("/")}
            >
              campX
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-2 xl:space-x-3">
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-white"
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-white"
                onClick={() => navigate("/student-login")}
              >
                Student Login
              </button>
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-blue-600"
                onClick={() => navigate("/Club-login")}
              >
                Club Login
              </button>
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-blue-500 rounded-lg"
                onClick={() => navigate("/Admin-login")}
              >
                Admin Login
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-white p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/20 transition-all duration-300 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="px-4 py-6 space-y-4">
              <div className="pt-4 border-t border-white/20 space-y-3">
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg"
                  onClick={() => navigate("/student-login")}
                >
                  Student Login
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg"
                  onClick={() => navigate("/Club-login")}
                >
                  Club Login
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-blue-500 rounded-lg"
                  onClick={() => navigate("/Admin-login")}
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 pt-24">
        <div className="w-full sm:w-2/3 md:w-1/3 bg-gray-900 p-8 rounded-lg text-white space-y-4">
          <h1 className="text-xl font-bold text-center">Signup</h1>

          {step === "signup" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">USN</label>
                <input
                  type="text"
                  name="usn"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Role</label>
                <select
                  name="role"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="club_chairman">Chairman</option>
                </select>
              </div>

              <button
                onClick={getOtp}
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Get OTP"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {status && (
            <div
              className={`text-center text-sm mt-4 ${
                status.toLowerCase().includes("error") ||
                status.toLowerCase().includes("required")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {status}
              {status.toLowerCase().includes("signup") && (
                <p className="text-xs mt-1 text-white/70">
                  Redirecting to home...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
