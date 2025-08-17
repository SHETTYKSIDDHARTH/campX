import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BackendURL } from "../../config.js";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const role = "Admin";

  const loginreq = async () => {
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }
    try {
      const res = await axios.post(`${BackendURL}/auth/login`, {
        email,
        password,
        role,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/Admin-dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error connecting to server");
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
              <button className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-white" onClick={() => navigate("/")}>
                Home
              </button>
              <button className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-white" onClick={() => navigate("/student-login")}>
                Student Login
              </button>
              <button className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-blue-600" onClick={() => navigate("/Club-login")}>
                Club Login
              </button>
              <button className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-blue-500 rounded-lg" onClick={() => navigate("/Admin-login")}>
                Admin Login
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                <button className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg" onClick={() => navigate("/")}>
                  Home
                </button>
                <button className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg" onClick={() => navigate("/student-login")}>
                  Student Login
                </button>
                <button className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg" onClick={() => navigate("/Club-login")}>
                  Club Login
                </button>
                <button className="block w-full text-left px-4 py-3 text-white/90 hover:bg-blue-500 rounded-lg" onClick={() => navigate("/Admin-login")}>
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Card */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full sm:w-2/3 md:w-1/3 bg-gray-900 p-8 rounded-lg text-white space-y-4">
          <h1 className="text-xl font-bold text-center">Admin Login</h1>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            onClick={loginreq}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Login
          </button>

          {/* Signup Link Inside Card */}
          <div className="text-center text-sm mt-4">
            Not signed up yet?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-violet-400 hover:underline"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
