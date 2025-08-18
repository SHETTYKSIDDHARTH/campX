import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Menu, X } from "lucide-react";

function ChairmanNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { name: "Create Event", path: "/chairman-dashboard" },
    { name: "All Events", path: "/all-events" },
    { name: "My Events", path: "/my-event" },
  ];

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer text-blue-400"
          onClick={() => navigate("/chairman-dashboard")}
        >
          CampX
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`transition-colors duration-200 ${
                location.pathname === link.path ? "text-blue-500" : "text-white"
              } hover:text-blue-400`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-800 px-3 py-1 rounded-sm transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/95 flex flex-col items-center justify-center space-y-6 transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        {links.map((link) => (
          <button
            key={link.name}
            onClick={() => {
              navigate(link.path);
              setIsOpen(false);
            }}
            className={`text-2xl font-semibold transition-colors duration-200 ${
              location.pathname === link.path ? "text-blue-500" : "text-white"
            } hover:text-blue-400`}
          >
            {link.name}
          </button>
        ))}
        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="bg-red-800 px-6 py-2 rounded-md text-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default ChairmanNav;
