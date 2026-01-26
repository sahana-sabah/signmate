import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 h-16"> {/* Added h-16 to match header height */}
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center"> {/* Added h-full and flex items-center */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full space-y-2 md:space-y-0">
          {/* Copyright */}
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            © {currentYear} SignMate. All rights reserved.
          </p>
          
          {/* Links */}
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;