import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detection from './pages/Detection';
import About from './pages/About';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import SignMateTutorial from './components/SignMateTutorial';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="pt-16 pb-16"> {/* pb-16 matches the h-16 footer height */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/tutorial" element={<SignMateTutorial />} />
                <Route path="/profile" element={<Profile />} />
                <Route 
                  path="/detection" 
                  element={
                    <ProtectedRoute>
                      <Detection />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;