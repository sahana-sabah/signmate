import React from 'react';
import { useNavigate } from 'react-router-dom';
import signLanguageHands from '../assets/images/sign-language-hands.png';

function Home() {
  const navigate = useNavigate();

  // Supported languages data
  const supportedLanguages = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              SIGN
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                MATE
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Bridging communication gaps through AI-powered sign language detection
            </p>

            {/* Quick Language Preview */}
            <div className="mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                Supporting <span className="font-semibold text-blue-600 dark:text-blue-400">10+ Indian languages</span> including:
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {supportedLanguages.slice(0, 5).map((lang) => (
                  <span 
                    key={lang.code}
                    className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
                  >
                    {lang.nativeName}
                  </span>
                ))}
                <span className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                  +5 more
                </span>
              </div>
            </div>
            
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
              onClick={() => navigate('/detection')}
            >
              Start Detecting Signs
            </button>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-30 dark:from-blue-500/30 dark:to-purple-500/30 animate-pulse"></div>
              <img 
                src={signLanguageHands} 
                alt="Sign language hands" 
                className="relative w-full max-w-md rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Our comprehensive solution for Indian Sign Language recognition and translation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Real-time Detection */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
              <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">🎥</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Real-time Detection</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Use your webcam to detect Indian Sign Language gestures in real-time with advanced AI
              </p>
            </div>
            
            {/* Card 2: Text Conversion */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
              <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Text Conversion</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Convert ISL signs instantly into readable text displayed on your screen
              </p>
            </div>
            
            {/* Card 3: Multi-language Translation */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
              <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">🌐</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Multi-language Translation</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Translate ISL to multiple Indian languages including Hindi, Tamil, Telugu, Bengali, and more
              </p>
            </div>
            
            {/* Card 4: Text-to-Speech */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
              <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">🔊</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Text-to-Speech</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Hear the translated text with our built-in speech functionality in multiple languages
              </p>
            </div>
          </div>

          {/* Supported Languages Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Supported Indian Languages
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our platform supports translation across 10+ major Indian languages, making communication accessible to everyone
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {supportedLanguages.map((language) => (
                <div 
                  key={language.code}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group"
                >
                  <div className="text-3xl mb-3 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {language.nativeName}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {language.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {language.nativeName}
                  </div>
                </div>
              ))}
            </div>

            {/* Language Stats */}
            <div className="mt-12 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-2xl p-8 border border-blue-200/30 dark:border-blue-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {supportedLanguages.length}+
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    Indian Languages
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    40+
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    Signs & Gestures
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                    Real-time
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    Translation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are making communication more accessible and inclusive for everyone across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
              onClick={() => navigate('/detection')}
            >
              Try It Now - Free
            </button>
            <button 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
            No registration required • Optimized for desktop and laptop cameras
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;