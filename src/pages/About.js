// import React from 'react';

// function About() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-24 pb-16">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
//             About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SignMate</span>
//           </h1>
//           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//             Revolutionizing communication through AI-powered Indian Sign Language recognition
//           </p>
//         </div>

//         {/* Mission Section */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Our Mission</h2>
//           <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
//             SignMate is an innovative web application designed to bridge the communication gap
//             between the hearing-impaired community and the rest of the world. Using real-time
//             webcam input and machine learning, SignMate recognizes <strong>Indian Sign Language (ISL) gestures</strong>
//             and instantly converts them into readable text on the screen.
//           </p>
//           <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
//             Our advanced technology also provides <strong>voice output</strong> through text-to-speech functionality,
//             making conversations more natural and accessible. Additionally, SignMate supports 
//             <strong> translation to multiple Indian languages</strong>, helping bridge communication gaps across
//             different linguistic communities in India.
//           </p>
//           <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
//             This project was built with the goal of making communication more inclusive,
//             accessible, and seamless — especially for those who rely on sign language as their
//             primary mode of expression.
//           </p>
//         </div>

//         {/* Gesture Recognition Capabilities */}
//         <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-2xl shadow-lg p-8 mb-12 border border-blue-200/30 dark:border-blue-500/20">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Gesture Recognition</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//             <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
//               <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">26</div>
//               <div className="text-lg font-semibold text-gray-800 dark:text-white">Alphabets</div>
//               <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">A-Z Letters (SVM)</div>
//             </div>
//             <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
//               <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">9</div>
//               <div className="text-lg font-semibold text-gray-800 dark:text-white">Digits</div>
//               <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">1-9 Numbers (SVM)</div>
//             </div>
//             <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
//               <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">5</div>
//               <div className="text-lg font-semibold text-gray-800 dark:text-white">Common Words</div>
//               <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">Essential Phrases (CNN-BiLSTM)</div>
//             </div>
//           </div>
//           <div className="mt-6 text-center">
//             <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Total: 40 Gestures</div>
//             <p className="text-gray-600 dark:text-gray-400">
//               Comprehensive coverage of essential ISL gestures using advanced machine learning models
//             </p>
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//           {/* Feature Card 1 */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="text-5xl mb-4 text-center">🇮🇳</div>
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Indian Sign Language</h3>
//             <p className="text-gray-600 dark:text-gray-300 text-center">
//               Specifically trained to recognize and interpret Indian Sign Language (ISL) gestures with high accuracy.
//             </p>
//           </div>

//           {/* Feature Card 2 */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="text-5xl mb-4 text-center">🔊</div>
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Voice Output</h3>
//             <p className="text-gray-600 dark:text-gray-300 text-center">
//               Converts recognized signs into clear audio speech using Web Speech API.
//             </p>
//           </div>

//           {/* Feature Card 3 */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="text-5xl mb-4 text-center">🌐</div>
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Multi-Language Translation</h3>
//             <p className="text-gray-600 dark:text-gray-300 text-center">
//               Translates ISL to multiple Indian languages using MyMemory Translation API.
//             </p>
//           </div>

//           {/* Feature Card 4 */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="text-5xl mb-4 text-center">🤖</div>
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Advanced AI Models</h3>
//             <p className="text-gray-600 dark:text-gray-300 text-center">
//               Uses SVM for letters/digits and CNN-BiLSTM for word recognition with high accuracy.
//             </p>
//           </div>

//           {/* Feature Card 5 */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="text-5xl mb-4 text-center">⚡</div>
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Real-Time Processing</h3>
//             <p className="text-gray-600 dark:text-gray-300 text-center">
//               Instant conversion of ISL signs to text and speech with minimal latency.
//             </p>
//           </div>

//           {/* Feature Card 6 */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//             <div className="text-5xl mb-4 text-center">🔄</div>
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Auto Mode</h3>
//             <p className="text-gray-600 dark:text-gray-300 text-center">
//               Automatically switches between letter and word detection based on hand distance.
//             </p>
//           </div>
//         </div>

//         {/* Technology Stack */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Technology Stack</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//             <div className="p-4">
//               <div className="text-4xl mb-2">⚛️</div>
//               <p className="font-semibold text-gray-800 dark:text-white">React</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Frontend</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🎨</div>
//               <p className="font-semibold text-gray-800 dark:text-white">Tailwind CSS</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Styling</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">📊</div>
//               <p className="font-semibold text-gray-800 dark:text-white">MediaPipe</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Hand Tracking</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🔌</div>
//               <p className="font-semibold text-gray-800 dark:text-white">Socket.io</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Communication</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🤖</div>
//               <p className="font-semibold text-gray-800 dark:text-white">SVM</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Letters & Digits</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🧠</div>
//               <p className="font-semibold text-gray-800 dark:text-white">CNN-BiLSTM</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Word Recognition</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🗣️</div>
//               <p className="font-semibold text-gray-800 dark:text-white">Web Speech API</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Text-to-Speech</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🌐</div>
//               <p className="font-semibold text-gray-800 dark:text-white">MyMemory API</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Translation</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🚀</div>
//               <p className="font-semibold text-gray-800 dark:text-white">Flask</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Backend</p>
//             </div>
//             <div className="p-4">
//               <div className="text-4xl mb-2">🐍</div>
//               <p className="font-semibold text-gray-800 dark:text-white">Python</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">ML Backend</p>
//             </div>
//           </div>
//         </div>

//         {/* Model Architecture Section */}
//         <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-2xl shadow-lg p-8 mt-12 border border-purple-200/30 dark:border-purple-500/20">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">AI Model Architecture</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">SVM for Letters & Digits</h3>
//               <ul className="space-y-2 text-gray-700 dark:text-gray-300">
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Support Vector Machine classifier
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Hand landmark features from MediaPipe
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   High accuracy for static gestures
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Fast real-time inference
//                 </li>
//               </ul>
//             </div>
//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">CNN-BiLSTM for Words</h3>
//               <ul className="space-y-2 text-gray-700 dark:text-gray-300">
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Convolutional Neural Network features
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Bidirectional LSTM for sequence modeling
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Temporal pattern recognition
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Dynamic gesture sequence handling
//                 </li>
//               </ul>
//             </div>
//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Auto Mode Intelligence</h3>
//               <ul className="space-y-2 text-gray-700 dark:text-gray-300">
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Distance-based mode switching
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Hand size analysis for proximity
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Automatic letter/word detection
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2">✓</span>
//                   Seamless mode transitions
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* System Architecture */}
//         <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 dark:from-blue-500/5 dark:to-green-500/5 rounded-2xl shadow-lg p-8 mt-12 border border-blue-200/30 dark:border-blue-500/20">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">System Architecture</h2>
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
//               <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
//                 <div className="text-2xl mb-2">📱</div>
//                 <p className="font-semibold text-gray-800 dark:text-white">React Frontend</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">User Interface</p>
//               </div>
//               <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
//                 <div className="text-2xl mb-2">🔌</div>
//                 <p className="font-semibold text-gray-800 dark:text-white">Socket.io</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Data</p>
//               </div>
//               <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
//                 <div className="text-2xl mb-2">🐍</div>
//                 <p className="font-semibold text-gray-800 dark:text-white">Flask Backend</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">ML Processing</p>
//               </div>
//               <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
//                 <div className="text-2xl mb-2">🤖</div>
//                 <p className="font-semibold text-gray-800 dark:text-white">AI Models</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">SVM + CNN-BiLSTM</p>
//               </div>
//             </div>
//             <div className="text-center text-gray-600 dark:text-gray-400">
//               Real-time communication between frontend and ML backend via WebSockets
//             </div>
//           </div>
//         </div>

//         {/* Usage Instructions */}
//         <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/5 dark:to-teal-500/5 rounded-2xl shadow-lg p-8 mt-12 border border-green-200/30 dark:border-green-500/20">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">How to Use</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">1</div>
//                 <p className="text-gray-700 dark:text-gray-300">Allow camera access when prompted</p>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">2</div>
//                 <p className="text-gray-700 dark:text-gray-300">Choose detection mode (Auto, Letters, or Words)</p>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">3</div>
//                 <p className="text-gray-700 dark:text-gray-300">Show your hands clearly to the camera</p>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">4</div>
//                 <p className="text-gray-700 dark:text-gray-300">Add detected signs to build sentences</p>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">5</div>
//                 <p className="text-gray-700 dark:text-gray-300">Translate to your preferred Indian language</p>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">6</div>
//                 <p className="text-gray-700 dark:text-gray-300">Use text-to-speech to hear the output</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default About;








import React, { useState } from 'react';
import SignMateTutorial from '../components/SignMateTutorial'; // Adjust the import path as needed

function About() {
  const [showTutorial, setShowTutorial] = useState(false);

  // If tutorial is shown, return the tutorial component
  if (showTutorial) {
    return <SignMateTutorial />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 pt-24 pb-16">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SignMate</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing communication through AI-powered Indian Sign Language recognition
          </p>
        </div>

        {/* Interactive Tutorial Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Learn How to Use SignMate</h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            New to SignMate? Our interactive tutorial will guide you through using the platform step by step. 
            Perfect for deaf users and anyone learning Indian Sign Language.
          </p>
          <button
            onClick={() => setShowTutorial(true)}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-3 mx-auto"
          >
            <span className="text-2xl">🎓</span>
            Launch Interactive Tutorial
          </button>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            SignMate is an innovative web application designed to bridge the communication gap
            between the hearing-impaired community and the rest of the world. Using real-time
            webcam input and machine learning, SignMate recognizes <strong>Indian Sign Language (ISL) gestures</strong>
            and instantly converts them into readable text on the screen.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Our advanced technology also provides <strong>voice output</strong> through text-to-speech functionality,
            making conversations more natural and accessible. Additionally, SignMate supports 
            <strong> translation to multiple Indian languages</strong>, helping bridge communication gaps across
            different linguistic communities in India.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            This project was built with the goal of making communication more inclusive,
            accessible, and seamless — especially for those who rely on sign language as their
            primary mode of expression.
          </p>
        </div>

        {/* Gesture Recognition Capabilities */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-2xl shadow-lg p-8 mb-12 border border-blue-200/30 dark:border-blue-500/20">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Gesture Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">26</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Alphabets</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">A-Z Letters (SVM)</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">9</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Digits</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">1-9 Numbers (SVM)</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">5</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">Common Words</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">Essential Phrases (CNN-BiLSTM)</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Total: 40 Gestures</div>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive coverage of essential ISL gestures using advanced machine learning models
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Feature Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 text-center">🇮🇳</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Indian Sign Language</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Specifically trained to recognize and interpret Indian Sign Language (ISL) gestures with high accuracy.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 text-center">🔊</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Voice Output</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Converts recognized signs into clear audio speech using Web Speech API.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 text-center">🌐</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Multi-Language Translation</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Translates ISL to multiple Indian languages using MyMemory Translation API.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 text-center">🤖</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Advanced AI Models</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Uses SVM for letters/digits and CNN-BiLSTM for word recognition with high accuracy.
            </p>
          </div>

          {/* Feature Card 5 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 text-center">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Real-Time Processing</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Instant conversion of ISL signs to text and speech with minimal latency.
            </p>
          </div>

          {/* Feature Card 6 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 text-center">🔄</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Auto Mode</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Automatically switches between letter and word detection based on hand distance.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl mb-2">⚛️</div>
              <p className="font-semibold text-gray-800 dark:text-white">React</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Frontend</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🎨</div>
              <p className="font-semibold text-gray-800 dark:text-white">Tailwind CSS</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Styling</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-semibold text-gray-800 dark:text-white">MediaPipe</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Hand Tracking</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🔌</div>
              <p className="font-semibold text-gray-800 dark:text-white">Socket.io</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Communication</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🤖</div>
              <p className="font-semibold text-gray-800 dark:text-white">SVM</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Letters & Digits</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🧠</div>
              <p className="font-semibold text-gray-800 dark:text-white">CNN-BiLSTM</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Word Recognition</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🗣️</div>
              <p className="font-semibold text-gray-800 dark:text-white">Web Speech API</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Text-to-Speech</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🌐</div>
              <p className="font-semibold text-gray-800 dark:text-white">MyMemory API</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Translation</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🚀</div>
              <p className="font-semibold text-gray-800 dark:text-white">Flask</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Backend</p>
            </div>
            <div className="p-4">
              <div className="text-4xl mb-2">🐍</div>
              <p className="font-semibold text-gray-800 dark:text-white">Python</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">ML Backend</p>
            </div>
          </div>
        </div>

        {/* Model Architecture Section */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-2xl shadow-lg p-8 mt-12 border border-purple-200/30 dark:border-purple-500/20">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">AI Model Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">SVM for Letters & Digits</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Support Vector Machine classifier
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Hand landmark features from MediaPipe
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  High accuracy for static gestures
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Fast real-time inference
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">CNN-BiLSTM for Words</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Convolutional Neural Network features
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Bidirectional LSTM for sequence modeling
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Temporal pattern recognition
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Dynamic gesture sequence handling
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Auto Mode Intelligence</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Distance-based mode switching
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Hand size analysis for proximity
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Automatic letter/word detection
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Seamless mode transitions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 dark:from-blue-500/5 dark:to-green-500/5 rounded-2xl shadow-lg p-8 mt-12 border border-blue-200/30 dark:border-blue-500/20">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">System Architecture</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl mb-2">📱</div>
                <p className="font-semibold text-gray-800 dark:text-white">React Frontend</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">User Interface</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl mb-2">🔌</div>
                <p className="font-semibold text-gray-800 dark:text-white">Socket.io</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Data</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl mb-2">🐍</div>
                <p className="font-semibold text-gray-800 dark:text-white">Flask Backend</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">ML Processing</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-2xl mb-2">🤖</div>
                <p className="font-semibold text-gray-800 dark:text-white">AI Models</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">SVM + CNN-BiLSTM</p>
              </div>
            </div>
            <div className="text-center text-gray-600 dark:text-gray-400">
              Real-time communication between frontend and ML backend via WebSockets
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/5 dark:to-teal-500/5 rounded-2xl shadow-lg p-8 mt-12 border border-green-200/30 dark:border-green-500/20">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">1</div>
                <p className="text-gray-700 dark:text-gray-300">Allow camera access when prompted</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">2</div>
                <p className="text-gray-700 dark:text-gray-300">Choose detection mode (Auto, Letters, or Words)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">3</div>
                <p className="text-gray-700 dark:text-gray-300">Show your hands clearly to the camera</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">4</div>
                <p className="text-gray-700 dark:text-gray-300">Add detected signs to build sentences</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">5</div>
                <p className="text-gray-700 dark:text-gray-300">Translate to your preferred Indian language</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">6</div>
                <p className="text-gray-700 dark:text-gray-300">Use text-to-speech to hear the output</p>
              </div>
            </div>
          </div>
          
          {/* Tutorial CTA at the bottom */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need visual guidance? Try our interactive tutorial!
            </p>
            <button
              onClick={() => setShowTutorial(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              🎓 Launch Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;