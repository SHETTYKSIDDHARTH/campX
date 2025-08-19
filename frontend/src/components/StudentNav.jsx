import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
function StudentNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handlelogout = ()=>{
  logout();
    navigate("/");
  }
  return (
    <div className="w-full flex items-center justify-between bg-gray-600 px-6 py-3">
      <NavLink
        to="/student-dashboard"
        className={({ isActive }) =>
          `text-white text-sm font-medium px-3 py-2 rounded-md transition ${
            isActive ? "bg-green-500" : "hover:bg-green-700"
          }`
        }
      >
        Events
      </NavLink>
      <NavLink
        to="/lost-found"
        className={({ isActive }) =>
          `text-white text-sm font-medium px-3 py-2 rounded-md transition ${
            isActive ? "bg-green-500" : "hover:bg-green-700"
          }`
        }
      >
        Lost/Found
      </NavLink>
      <NavLink
        to="/rides"
        className={({ isActive }) =>
          `text-white text-sm font-medium px-3 py-2 rounded-md transition ${
            isActive ? "bg-green-500" : "hover:bg-green-700"
          }`
        }
      >
        Rides
      </NavLink>

       <NavLink
        onClick={handlelogout}
        className={({ isActive }) =>
          `text-white text-sm font-medium px-3 py-2 rounded-md transition ${
            isActive ? "bg-red-500" : "hover:bg-red-700"
          }`
        }
      >
        Logout
      </NavLink>
    </div>
  );
}

export default StudentNav;
