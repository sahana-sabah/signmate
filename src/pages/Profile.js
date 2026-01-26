import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Captcha from '../components/Captcha';

function Profile() {
  const { isAuthenticated, user, login, logout, register } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // CAPTCHA states
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Generate CAPTCHA
  const generateCaptcha = () => {
    // Mix of similar-looking characters to make it harder for bots
    const similarChars = {
      'o': '0',
      'O': '0', 
      'i': '1',
      'I': '1',
      'l': '1',
      'z': '2',
      'Z': '2',
      's': '5',
      'S': '5',
      'b': '6',
      'B': '8'
    };
  
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    
    for (let i = 0; i < 6; i++) {
      let char = characters.charAt(Math.floor(Math.random() * characters.length));
      
      // Occasionally replace with similar-looking character
      if (Math.random() < 0.3 && similarChars[char]) {
        char = similarChars[char];
      }
      
      result += char;
    }
    
    setCaptchaText(result);
    setUserCaptcha('');
    setCaptchaError('');
  };

  // Initialize CAPTCHA on component mount
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const validateForm = () => {
    setError('');
    setCaptchaError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Confirm password validation for registration
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Name validation for registration
    if (!isLogin && name.trim().length < 2) {
      setError('Please enter your full name');
      return false;
    }

    // CAPTCHA validation
    if (userCaptcha !== captchaText) {
      setCaptchaError('CAPTCHA code is incorrect');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (login(email, password, name)) {
        setSuccess('Login successful!');
        setTimeout(() => navigate('/detection'), 1000);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Mock registration - in real app, you'd call an API
      if (login(email, password)) { // Using login for demo
        setSuccess('Registration successful! Please login.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        generateCaptcha();
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    generateCaptcha();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-24 pb-16"> {/* Changed pb-20 to pb-16 */}
        <div className="max-w-md mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
              {isLogin ? 'Login to SignMate' : 'Create Account'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {isLogin ? 'Welcome back! Please sign in to continue.' : 'Join SignMate today!'}
            </p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Full Name:</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email:</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Password:</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Confirm Password:</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              )}

              {/* CAPTCHA Section */}
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  CAPTCHA Verification:
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                    (Type the text you see below)
                  </span>
                </label>
  
              <div className="mb-3">
                <Captcha 
                  text={captchaText} 
                  onRefresh={generateCaptcha} 
                />
              </div>
  
              <input 
                type="text" 
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                placeholder="Enter the CAPTCHA code exactly as shown"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                required
              />
              {captchaError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {captchaError}
                </p>
              )}
            </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors mb-4"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={switchMode}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                <strong>Demo Instructions:</strong><br />
                • Use any valid email format<br />
                • Password must be 6+ characters<br />
                • Enter the CAPTCHA code <em>exactly</em> as shown (case-sensitive)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated view - User profile (keep existing code)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Profile</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name:</label>
            <input 
              type="text" 
              defaultValue={user?.name || ''}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email ID:</label>
            <input 
              type="email" 
              defaultValue={user?.email || ''}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Mobile Number:</label>
            <input 
              type="tel" 
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
            Update Profile
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <button 
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white"
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/detection')}
            className="w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white"
          >
            Detection
          </button>
          <button 
            onClick={() => navigate('/about')}
            className="w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white"
          >
            About
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;