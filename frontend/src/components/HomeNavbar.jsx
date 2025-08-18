import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Student Login", path: "/student-login" },
    { name: "Admin Login", path: "/Admin-login" },
    { name: "Club Login", path: "/Club-login" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-white/30 text-bl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
         
          <Link to="/" className="text-2xl font-bold text-white tracking-wide">
            MyApp
          </Link>

          
          <div className="hidden lg:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white hover:text-green-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-md focus:outline-none z-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

   
      {isOpen && (
  <div className="absolute top-16 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-t border-white/30 px-4 py-4">
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        className="block text-white py-2 hover:text-green-300 transition-colors"
        onClick={() => setIsOpen(false)}
      >
        {link.name}
      </Link>
    ))}
  </div>
)}
    </nav>
  );
}
