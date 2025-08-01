import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Settings,
  CreditCard
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors animate-pulse" />
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity animate-ping" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>

            {currentUser && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/records" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Records
                </Link>
                <Link to="/appointments" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Appointments
                </Link>
              </>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                    </div>
                    
                    <Link
                      to="/settings"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Site Settings
                    </Link>
                    <Link
                      to="/subscription"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <CreditCard className="w-4 h-4" />
                      Subscription Plans
                    </Link>

                  <Link
                    to="/feedback"
                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    
                   📝 Feedback
                  </Link>

{/* ✅ NEW FORUM LINK */}
                  <Link
                  to="/forum"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => setShowUserMenu(false)}
                  >
                   💬 Forum
                  </Link>


                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">About</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Contact</Link>

              {currentUser ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Dashboard</Link>
                  <Link to="/records" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Records</Link>
                  <Link to="/appointments" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Appointments</Link>
                  <Link to="/settings" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Site Settings</Link>
                  <Link to="/subscription" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Subscription Plans</Link>
                  <button
                    onClick={handleLogout}
                    className="text-left py-2 px-4 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setIsOpen(false)} className="py-2 text-gray-700 hover:text-blue-600">Sign In</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
