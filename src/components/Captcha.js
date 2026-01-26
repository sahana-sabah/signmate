import React from 'react';

const Captcha = ({ text, onRefresh }) => {
  // Function to generate random color
  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to generate random rotation
  const getRandomRotation = () => {
    return Math.floor(Math.random() * 30) - 15; // -15 to +15 degrees
  };

  // Function to generate random position offset
  const getRandomOffset = () => {
    return Math.floor(Math.random() * 10) - 5; // -5 to +5 pixels
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600">
      {/* Background noise - dots */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Background noise - lines */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-0.5 bg-gray-400 opacity-20"
            style={{
              top: `${20 + i * 10}%`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
            }}
          />
        ))}
      </div>

      {/* CAPTCHA Text */}
      <div className="relative flex justify-center items-center h-16">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block mx-0.5 text-2xl font-bold select-none"
            style={{
              color: getRandomColor(),
              transform: `rotate(${getRandomRotation()}deg) translate(${getRandomOffset()}px, ${getRandomOffset()}px)`,
              fontFamily: 'Arial, sans-serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Type the text you see
        </span>
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        >
          <span>🔄</span>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Captcha;