import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Function to check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Active link styles
  const activeLinkClass = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold px-3 py-1 rounded-lg";
  const inactiveLinkClass = "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50";
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span>👋</span>
          SIGNMATE</h1>
        
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className={`pb-1 ${isActiveLink('/') ? activeLinkClass : inactiveLinkClass}`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link 
                to="/detection" 
                className={`pb-1 ${isActiveLink('/detection') ? activeLinkClass : inactiveLinkClass}`}
              >
                Detection
              </Link>
            )}
            <Link 
              to="/about" 
              className={`pb-1 ${isActiveLink('/about') ? activeLinkClass : inactiveLinkClass}`}
            >
              About
            </Link>
            <Link 
              to="/profile" 
              className={`pb-1 ${isActiveLink('/profile') ? activeLinkClass : inactiveLinkClass}`}
            >
              {isAuthenticated ? user?.name : 'Login'}
            </Link>
          </nav>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors backdrop-blur-sm"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Logout button when authenticated */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500/80 hover:bg-red-600/80 text-white px-3 py-1 rounded transition-colors backdrop-blur-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;