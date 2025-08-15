import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function ChairmanLogin() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div
              className="text-xl sm:text-2xl font-bold text-white tracking-wide hover:cursor-pointer"
              onClick={() => navigate('/')}
            >
              campX
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex space-x-2 xl:space-x-3">
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-white transition-colors duration-300"
                onClick={() => navigate('/')}
              >
                Home
              </button>
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-white transition-colors duration-300"
                onClick={() => navigate('/student-login')}
              >
                Student Login
              </button>
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-blue-600 transition-colors duration-500"
                onClick={() => navigate('/Club-login')}
              >
                Club Login
              </button>
              <button
                className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-blue-500 rounded-lg transition-colors duration-300"
                onClick={() => navigate('/Admin-login')}
              >
                Admin Login
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-white transition-colors p-2"
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
            className={`lg:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/20 transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="px-4 py-6 space-y-4">
              <div className="pt-4 border-t border-white/20 space-y-3">
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => navigate('/')}
                >
                  Home
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => navigate('/student-login')}
                >
                  Student Login
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => navigate('/Club-login')}
                >
                  Club Login
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-white/90 hover:bg-blue-500 rounded-lg transition-colors duration-300"
                  onClick={() => navigate('/Admin-login')}
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center mt-16 px-4">
        <div className="w-full sm:w-2/3 md:w-1/3 h-[500px] bg-gray-900 flex items-center justify-center rounded-lg text-white">
          <h1>Club Login</h1>
        </div>
      </div>
    </div>
  );
}

export default ChairmanLogin;
