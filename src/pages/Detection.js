// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// function DetectionInterface() {
//   const [detectionMode, setDetectionMode] = useState('auto');
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [currentPrediction, setCurrentPrediction] = useState('');
//   const [confidence, setConfidence] = useState(0);
//   const [sentence, setSentence] = useState([]);
//   const [handsDetected, setHandsDetected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [landmarksImage, setLandmarksImage] = useState(null);
  
//   // Statistics states
//   const [statistics, setStatistics] = useState({
//     totalDetections: 0,
//     lettersDetected: 0,
//     wordsDetected: 0,
//     avgConfidence: 0,
//     sessionStartTime: null,
//     detectionHistory: []
//   });
  
//   const socketRef = useRef(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     // Connect to WebSocket
//     socketRef.current = io('http://localhost:5000');
    
//     socketRef.current.on('connect', () => {
//       setConnectionStatus('connected');
//       console.log('Connected to server');
//     });

//     socketRef.current.on('disconnect', () => {
//       setConnectionStatus('disconnected');
//       console.log('Disconnected from server');
//     });

//     socketRef.current.on('detection_update', (data) => {
//       setCurrentPrediction(data.prediction);
//       setConfidence(data.confidence);
//       setHandsDetected(data.hands_detected);
      
//       // Update statistics
//       if (data.prediction && data.confidence > 0.5) {
//         updateStatistics(data.prediction, data.confidence);
//       }
      
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//     });

//     socketRef.current.on('frame_update', (data) => {
//       setHandsDetected(data.hands_detected);
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//     });

//     socketRef.current.on('sentence_update', (data) => {
//       setSentence(data.sentence);
//     });

//     socketRef.current.on('detection_started', () => {
//       setIsDetecting(true);
//       // Reset statistics when new detection starts
//       setStatistics(prev => ({
//         ...prev,
//         sessionStartTime: new Date(),
//         detectionHistory: []
//       }));
//     });

//     socketRef.current.on('detection_stopped', () => {
//       setIsDetecting(false);
//       setCurrentPrediction('');
//       setConfidence(0);
//       setLandmarksImage(null);
//     });

//     socketRef.current.on('error', (data) => {
//       console.error('Server error:', data.message);
//       alert(`Error: ${data.message}`);
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   const updateStatistics = (prediction, confidence) => {
//     setStatistics(prev => {
//       const isLetter = prediction.length === 1;
//       const isWord = prediction.length > 1;
      
//       const newDetectionHistory = [
//         ...prev.detectionHistory.slice(-49), // Keep last 50 detections
//         {
//           prediction,
//           confidence,
//           timestamp: new Date(),
//           type: isLetter ? 'letter' : 'word'
//         }
//       ];
      
//       const totalDetections = prev.totalDetections + 1;
//       const lettersDetected = prev.lettersDetected + (isLetter ? 1 : 0);
//       const wordsDetected = prev.wordsDetected + (isWord ? 1 : 0);
      
//       // Calculate average confidence
//       const totalConfidence = newDetectionHistory.reduce((sum, item) => sum + item.confidence, 0);
//       const avgConfidence = totalConfidence / newDetectionHistory.length;
      
//       return {
//         ...prev,
//         totalDetections,
//         lettersDetected,
//         wordsDetected,
//         avgConfidence,
//         detectionHistory: newDetectionHistory
//       };
//     });
//   };

//   const startDetection = (mode) => {
//     if (socketRef.current) {
//       socketRef.current.emit('start_detection', { mode });
//       setDetectionMode(mode);
//     }
//   };

//   const stopDetection = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('stop_detection');
//     }
//   };

//   const addToSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('add_to_sentence');
//     }
//   };

//   const clearSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('clear_sentence');
//     }
//   };

//   const speakSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('speak_sentence');
//     }
    
//     // Client-side TTS as fallback
//     if (sentence.length > 0 && 'speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(sentence.join(' '));
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const getSessionDuration = () => {
//     if (!statistics.sessionStartTime) return '0m 0s';
//     const duration = Math.floor((new Date() - new Date(statistics.sessionStartTime)) / 1000);
//     const minutes = Math.floor(duration / 60);
//     const seconds = duration % 60;
//     return `${minutes}m ${seconds}s`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 pb-16">
//       {/* Fixed Height Container - No Scrolling Needed */}
//       <div className="h-screen flex flex-col max-w-7xl mx-auto p-6">
        
//         {/* Header Section - Fixed Height */}
//         <div className="flex-shrink-0 mb-6">
//           <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
//             Sign Language Detection
//           </h3>
//           <div className="flex items-center gap-4 mt-2">
//             <div className={`flex items-center gap-2 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
//               <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
//               <span className="text-sm">{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
//             </div>
//             {isDetecting && (
//               <div className="flex items-center gap-2 text-blue-600">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Live Detection</span>
//               </div>
//             )}
//             {handsDetected && isDetecting && (
//               <div className="flex items-center gap-2 text-green-600">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Hands Detected</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Content Grid - Takes remaining space */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
          
//           {/* Left Column - Controls & Statistics */}
//           <div className="space-y-6 overflow-y-auto">
//             {/* Mode Selection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Detection Mode
//               </h4>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => !isDetecting && startDetection('auto')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'auto' && isDetecting
//                       ? 'bg-blue-500 text-white shadow-lg'
//                       : detectionMode === 'auto'
//                       ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'auto'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Auto (Distance-based)</span>
//                     {detectionMode === 'auto' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Automatically switches between letters and words</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('letter')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'letter' && isDetecting
//                       ? 'bg-green-500 text-white shadow-lg'
//                       : detectionMode === 'letter'
//                       ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'letter' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'letter'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Letters Only</span>
//                     {detectionMode === 'letter' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Close to camera for letters</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('word')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'word' && isDetecting
//                       ? 'bg-purple-500 text-white shadow-lg'
//                       : detectionMode === 'word'
//                       ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'word' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'word'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Words Only</span>
//                     {detectionMode === 'word' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Away from camera for words</div>
//                 </button>
//               </div>
//             </div>

//             {/* Statistics Card */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Detection Statistics
//               </h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                     {statistics.totalDetections}
//                   </div>
//                   <div className="text-sm text-blue-700 dark:text-blue-300">Total Detections</div>
//                 </div>
//                 <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
//                   <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                     {statistics.lettersDetected}
//                   </div>
//                   <div className="text-sm text-green-700 dark:text-green-300">Letters</div>
//                 </div>
//                 <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
//                   <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//                     {statistics.wordsDetected}
//                   </div>
//                   <div className="text-sm text-purple-700 dark:text-purple-300">Words</div>
//                 </div>
//                 <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
//                   <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
//                     {(statistics.avgConfidence * 100).toFixed(1)}%
//                   </div>
//                   <div className="text-sm text-orange-700 dark:text-orange-300">Avg Confidence</div>
//                 </div>
//               </div>
              
//               {isDetecting && (
//                 <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600 dark:text-gray-300">Session Duration:</span>
//                     <span className="font-medium text-gray-800 dark:text-gray-200">{getSessionDuration()}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm mt-2">
//                     <span className="text-gray-600 dark:text-gray-300">Current Mode:</span>
//                     <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{detectionMode}</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons - Fixed height with proper spacing */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Actions
//               </h4>
//               <div className="grid grid-cols-2 gap-3">
//                 {!isDetecting ? (
//                   <button
//                     onClick={() => startDetection(detectionMode)}
//                     className="col-span-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Start Detection
//                   </button>
//                 ) : (
//                   <button
//                     onClick={stopDetection}
//                     className="col-span-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Stop Detection
//                   </button>
//                 )}
                
//                 <button
//                   onClick={addToSentence}
//                   disabled={!currentPrediction || !isDetecting}
//                   className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Add to Sentence
//                 </button>
                
//                 <button
//                   onClick={clearSentence}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                 >
//                   Clear
//                 </button>
                
//                 <button
//                   onClick={speakSentence}
//                   disabled={sentence.length === 0}
//                   className="col-span-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Speak Sentence
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Middle Column - Camera Feed with Landmarks */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//               Live Camera Feed
//             </h4>
            
//             <div className="flex-grow flex flex-col justify-center items-center bg-black rounded-lg overflow-hidden relative">
//               {!isDetecting ? (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-6xl mb-4">📷</div>
//                   <p>Camera feed will appear here</p>
//                   <p className="text-sm mt-2">Start detection to see live video with hand landmarks</p>
//                 </div>
//               ) : landmarksImage ? (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img 
//                     src={landmarksImage} 
//                     alt="Live camera feed with hand landmarks"
//                     className="w-full h-full object-contain"
//                     style={{ maxHeight: '400px' }}
//                   />
//                 </div>
//               ) : (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-4xl mb-4">⏳</div>
//                   <p>Starting camera...</p>
//                 </div>
//               )}
              
//               {isDetecting && (
//                 <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
//                   {handsDetected ? '🟢 Hands Detected' : '🟡 Waiting for hands...'}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Detection Results & Sentence Builder */}
//           <div className="space-y-6">
//             {/* Current Detection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Current Detection
//               </h4>
              
//               <div className="flex-grow flex flex-col justify-center items-center">
//                 {!isDetecting ? (
//                   <div className="text-center text-gray-500 dark:text-gray-400">
//                     <div className="text-6xl mb-4">👋</div>
//                     <p>Start detection to see results</p>
//                   </div>
//                 ) : !handsDetected ? (
//                   <div className="text-center text-orange-500">
//                     <div className="text-6xl mb-4">✋</div>
//                     <p>Show your hands to the camera</p>
//                   </div>
//                 ) : (
//                   <div className="text-center w-full">
//                     <div className={`text-5xl font-bold mb-4 ${
//                       confidence > 0.8 ? 'text-green-600' : 
//                       confidence > 0.6 ? 'text-blue-600' : 'text-orange-600'
//                     }`}>
//                       {currentPrediction}
//                     </div>
//                     <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
//                       Confidence: {(confidence * 100).toFixed(1)}%
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                       <div 
//                         className={`h-3 rounded-full ${
//                           confidence > 0.8 ? 'bg-green-500' : 
//                           confidence > 0.6 ? 'bg-blue-500' : 'bg-orange-500'
//                         }`}
//                         style={{ width: `${confidence * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Sentence Builder */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Sentence Builder
//               </h4>
              
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 h-32 overflow-y-auto">
//                 {sentence.length > 0 ? (
//                   <div className="space-y-2">
//                     {sentence.map((word, index) => (
//                       <div 
//                         key={index}
//                         className="bg-white dark:bg-gray-600 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 flex justify-between items-center"
//                       >
//                         <span>{word}</span>
//                         <span className="text-xs text-gray-500">#{index + 1}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-center">
//                     <div>
//                       <div className="text-2xl mb-1">📝</div>
//                       <p className="text-sm">Your sentence will appear here</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {sentence.length > 0 && (
//                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <p className="text-blue-800 dark:text-blue-300 text-sm">
//                     <strong>Current Sentence:</strong> {sentence.join(' ')}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DetectionInterface;












// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// function DetectionInterface() {
//   const [detectionMode, setDetectionMode] = useState('auto');
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [currentPrediction, setCurrentPrediction] = useState('');
//   const [confidence, setConfidence] = useState(0);
//   const [sentence, setSentence] = useState([]);
//   const [handsDetected, setHandsDetected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [landmarksImage, setLandmarksImage] = useState(null);
//   const [activeMode, setActiveMode] = useState(null);
//   const [distance, setDistance] = useState('unknown');
  
//   // Translation states
//   const [selectedLanguage, setSelectedLanguage] = useState('hi');
//   const [translatedText, setTranslatedText] = useState('');
//   const [isTranslating, setIsTranslating] = useState(false);
//   const [showTranslation, setShowTranslation] = useState(false);
  
//   const socketRef = useRef(null);

//   // Indian language options
//   const languages = [
//     { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
//     { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
//     { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
//     { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
//     { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
//     { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
//     { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
//     { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
//   ];

//   // Socket connection
//   useEffect(() => {
//     socketRef.current = io('http://localhost:5000');
    
//     socketRef.current.on('connect', () => {
//       setConnectionStatus('connected');
//       console.log('Connected to server');
//     });

//     socketRef.current.on('disconnect', () => {
//       setConnectionStatus('disconnected');
//       console.log('Disconnected from server');
//     });

//     socketRef.current.on('detection_update', (data) => {
//       setCurrentPrediction(data.prediction);
//       setConfidence(data.confidence);
//       setHandsDetected(data.hands_detected);
      
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//       if (data.active_mode) {
//         setActiveMode(data.active_mode);
//       }
//       if (data.distance) {
//         setDistance(data.distance);
//       }
//     });

//     socketRef.current.on('frame_update', (data) => {
//       setHandsDetected(data.hands_detected);
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//       if (data.active_mode) {
//         setActiveMode(data.active_mode);
//       }
//       if (data.distance) {
//         setDistance(data.distance);
//       }
//     });

//     socketRef.current.on('sentence_update', (data) => {
//       setSentence(data.sentence);
//     });

//     socketRef.current.on('detection_started', () => {
//       setIsDetecting(true);
//     });

//     socketRef.current.on('detection_stopped', () => {
//       setIsDetecting(false);
//       setCurrentPrediction('');
//       setConfidence(0);
//       setLandmarksImage(null);
//       setActiveMode(null);
//       setDistance('unknown');
//     });

//     socketRef.current.on('error', (data) => {
//       console.error('Server error:', data.message);
//       alert(`Error: ${data.message}`);
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   // Auto-translate when sentence changes
//   useEffect(() => {
//     if (sentence.length > 0 && showTranslation) {
//       translateSentence();
//     }
//   }, [sentence, selectedLanguage]);

//   const translateSentence = async () => {
//     const textToTranslate = sentence.join(' ');
//     if (!textToTranslate.trim()) return;

//     setIsTranslating(true);
//     try {
//       // Using MyMemory Translation API (Free, no API key needed)
//       const response = await fetch(
//         `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${selectedLanguage}`
//       );
//       const data = await response.json();
      
//       if (data.responseStatus === 200) {
//         setTranslatedText(data.responseData.translatedText);
//       } else {
//         setTranslatedText('Translation unavailable');
//       }
//     } catch (error) {
//       console.error('Translation error:', error);
//       setTranslatedText('Translation failed');
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   const startDetection = (mode) => {
//     if (socketRef.current) {
//       socketRef.current.emit('start_detection', { mode });
//       setDetectionMode(mode);
//     }
//   };

//   const stopDetection = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('stop_detection');
//     }
//   };

//   const addToSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('add_to_sentence');
//     }
//   };

//   const clearSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('clear_sentence');
//     }
//     setTranslatedText('');
//   };

//   const speakSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('speak_sentence');
//     }
    
//     if (sentence.length > 0 && 'speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(sentence.join(' '));
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const getModeColor = (mode) => {
//     switch(mode) {
//       case 'letter': return 'text-cyan-600';
//       case 'word': return 'text-orange-600';
//       default: return 'text-gray-600';
//     }
//   };

//   const getModeBgColor = (mode) => {
//     switch(mode) {
//       case 'letter': return 'bg-cyan-50 border-cyan-200';
//       case 'word': return 'bg-orange-50 border-orange-200';
//       default: return 'bg-gray-50 border-gray-200';
//     }
//   };

//   const getDistanceColor = (dist) => {
//     switch(dist) {
//       case 'close': return 'text-red-600 bg-red-50';
//       case 'far': return 'text-blue-600 bg-blue-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 pb-16">
//       {/* Fixed Height Container - No Scrolling Needed */}
//       <div className="h-screen flex flex-col max-w-7xl mx-auto p-6">
        
//         {/* Header Section - Fixed Height */}
//         <div className="flex-shrink-0 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
//               Sign Language Detection
//             </h3>
//             <div className="flex items-center gap-4">
//               <span className="text-gray-700 dark:text-gray-300 text-sm">
//                 Welcome, {localStorage.getItem('username') || 'User'}
//               </span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-4 mt-2">
//             <div className={`flex items-center gap-2 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
//               <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
//               <span className="text-sm">{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
//             </div>
//             {isDetecting && (
//               <div className="flex items-center gap-2 text-blue-600">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Live Detection</span>
//               </div>
//             )}
//             {handsDetected && isDetecting && (
//               <div className="flex items-center gap-2 text-green-600">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Hands Detected</span>
//               </div>
//             )}
//             {detectionMode === 'auto' && activeMode && isDetecting && (
//               <div className={`flex items-center gap-2 ${getModeColor(activeMode)} px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600`}>
//                 <span className="text-sm font-medium">
//                   {activeMode === 'letter' ? 'Letter Mode' : 'Word Mode'} 
//                   {distance !== 'unknown' && ` (${distance})`}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Content Grid - Takes remaining space */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
          
//           {/* Left Column - Controls */}
//           <div className="space-y-6 overflow-y-auto">
//             {/* Mode Selection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Detection Mode
//               </h4>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => !isDetecting && startDetection('auto')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'auto' && isDetecting
//                       ? 'bg-blue-500 text-white shadow-lg'
//                       : detectionMode === 'auto'
//                       ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'auto'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Auto (Distance-based)</span>
//                     {detectionMode === 'auto' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Automatically switches between letters and words</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('letter')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'letter' && isDetecting
//                       ? 'bg-green-500 text-white shadow-lg'
//                       : detectionMode === 'letter'
//                       ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'letter' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'letter'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Letters Only</span>
//                     {detectionMode === 'letter' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Close to camera for letters</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('word')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'word' && isDetecting
//                       ? 'bg-purple-500 text-white shadow-lg'
//                       : detectionMode === 'word'
//                       ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'word' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'word'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Words Only</span>
//                     {detectionMode === 'word' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Away from camera for words</div>
//                 </button>
//               </div>
//             </div>

//             {/* Distance Info - For Auto Mode */}
//             {detectionMode === 'auto' && isDetecting && (
//               <div className={`rounded-2xl shadow-lg p-6 border ${getModeBgColor(activeMode)} dark:bg-gray-800 dark:border-gray-700`}>
//                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Distance Detection</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span>
//                     <span className={`font-bold px-3 py-1 rounded-lg ${getDistanceColor(distance)} dark:bg-gray-700`}>
//                       {distance === 'close' ? 'CLOSE' : distance === 'far' ? 'FAR' : 'Unknown'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">Active Mode:</span>
//                     <span className={`font-bold px-3 py-1 rounded-lg ${getModeColor(activeMode)} bg-white dark:bg-gray-700`}>
//                       {activeMode === 'letter' ? 'Letters' : activeMode === 'word' ? 'Words' : '-'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Actions
//               </h4>
//               <div className="grid grid-cols-2 gap-3">
//                 {!isDetecting ? (
//                   <button
//                     onClick={() => startDetection(detectionMode)}
//                     className="col-span-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Start Detection
//                   </button>
//                 ) : (
//                   <button
//                     onClick={stopDetection}
//                     className="col-span-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Stop Detection
//                   </button>
//                 )}
                
//                 <button
//                   onClick={addToSentence}
//                   disabled={!currentPrediction || !isDetecting}
//                   className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Add to Sentence
//                 </button>
                
//                 <button
//                   onClick={clearSentence}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                 >
//                   Clear
//                 </button>
                
//                 <button
//                   onClick={speakSentence}
//                   disabled={sentence.length === 0}
//                   className="col-span-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Speak Sentence
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Middle Column - Camera Feed with Landmarks */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//               Live Camera Feed
//             </h4>
            
//             <div className="flex-grow flex flex-col justify-center items-center bg-black rounded-lg overflow-hidden relative">
//               {!isDetecting ? (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-6xl mb-4">📷</div>
//                   <p>Camera feed will appear here</p>
//                   <p className="text-sm mt-2">Start detection to see live video with hand landmarks</p>
//                 </div>
//               ) : landmarksImage ? (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img 
//                     src={landmarksImage} 
//                     alt="Live camera feed with hand landmarks"
//                     className="w-full h-full object-contain"
//                     style={{ maxHeight: '400px' }}
//                   />
//                 </div>
//               ) : (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-4xl mb-4">⏳</div>
//                   <p>Starting camera...</p>
//                 </div>
//               )}
              
//               {isDetecting && (
//                 <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
//                   {handsDetected ? '🟢 Hands Detected' : '🟡 Waiting for hands...'}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Detection Results & Sentence Builder */}
//           <div className="space-y-6 overflow-y-auto">
//             {/* Current Detection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Current Detection
//               </h4>
              
//               <div className="flex-grow flex flex-col justify-center items-center">
//                 {!isDetecting ? (
//                   <div className="text-center text-gray-500 dark:text-gray-400">
//                     <div className="text-6xl mb-4">👋</div>
//                     <p>Start detection to see results</p>
//                   </div>
//                 ) : !handsDetected ? (
//                   <div className="text-center text-orange-500">
//                     <div className="text-6xl mb-4">✋</div>
//                     <p>Show your hands to the camera</p>
//                   </div>
//                 ) : (
//                   <div className="text-center w-full">
//                     <div className={`text-5xl font-bold mb-4 ${
//                       confidence > 0.8 ? 'text-green-600' : 
//                       confidence > 0.6 ? 'text-blue-600' : 'text-orange-600'
//                     }`}>
//                       {currentPrediction}
//                     </div>
//                     <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
//                       Confidence: {(confidence * 100).toFixed(1)}%
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                       <div 
//                         className={`h-3 rounded-full ${
//                           confidence > 0.8 ? 'bg-green-500' : 
//                           confidence > 0.6 ? 'bg-blue-500' : 'bg-orange-500'
//                         }`}
//                         style={{ width: `${confidence * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Sentence Builder */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Sentence Builder
//               </h4>
              
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 h-32 overflow-y-auto">
//                 {sentence.length > 0 ? (
//                   <div className="space-y-2">
//                     {sentence.map((word, index) => (
//                       <div 
//                         key={index}
//                         className="bg-white dark:bg-gray-600 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 flex justify-between items-center"
//                       >
//                         <span>{word}</span>
//                         <span className="text-xs text-gray-500">#{index + 1}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-center">
//                     <div>
//                       <div className="text-2xl mb-1">📝</div>
//                       <p className="text-sm">Your sentence will appear here</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {sentence.length > 0 && (
//                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <p className="text-blue-800 dark:text-blue-300 text-sm">
//                     <strong>Current Sentence:</strong> {sentence.join(' ')}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Translation Panel */}
//             {sentence.length > 0 && (
//               <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800">
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
//                     <span>🌐</span> Translation
//                   </h4>
//                   <button
//                     onClick={() => setShowTranslation(!showTranslation)}
//                     className="text-sm px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium transition-colors"
//                   >
//                     {showTranslation ? 'Hide' : 'Show'}
//                   </button>
//                 </div>

//                 {showTranslation && (
//                   <div className="space-y-4">
//                     {/* Language Selector */}
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                         Select Language:
//                       </label>
//                       <select
//                         value={selectedLanguage}
//                         onChange={(e) => setSelectedLanguage(e.target.value)}
//                         className="w-full px-4 py-2 rounded-lg border border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 focus:outline-none bg-white dark:bg-gray-700 font-medium text-gray-800 dark:text-white"
//                       >
//                         {languages.map((lang) => (
//                           <option key={lang.code} value={lang.code}>
//                             {lang.name} ({lang.nativeName})
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Translate Button */}
//                     <button
//                       onClick={translateSentence}
//                       disabled={isTranslating}
//                       className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
//                     >
//                       {isTranslating ? 'Translating...' : 'Translate Now'}
//                     </button>

//                     {/* Translated Output */}
//                     {translatedText && (
//                       <div className="bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 p-4">
//                         <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
//                           Translated Text:
//                         </div>
//                         <div className="text-lg font-medium text-gray-800 dark:text-white" style={{ lineHeight: '1.6' }}>
//                           {translatedText}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DetectionInterface;











// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// function DetectionInterface() {
//   const [detectionMode, setDetectionMode] = useState('auto');
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [currentPrediction, setCurrentPrediction] = useState('');
//   const [confidence, setConfidence] = useState(0);
//   const [sentence, setSentence] = useState([]);
//   const [handsDetected, setHandsDetected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [landmarksImage, setLandmarksImage] = useState(null);
//   const [activeMode, setActiveMode] = useState(null);
//   const [distance, setDistance] = useState('unknown');
  
//   // Translation states
//   const [selectedLanguage, setSelectedLanguage] = useState('hi');
//   const [translatedText, setTranslatedText] = useState('');
//   const [isTranslating, setIsTranslating] = useState(false);
//   const [showTranslation, setShowTranslation] = useState(false);
//   const [isSpeakingTranslated, setIsSpeakingTranslated] = useState(false);
  
//   const socketRef = useRef(null);

//   // Indian language options
//   const languages = [
//     { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
//     { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
//     { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
//     { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
//     { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
//     { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
//     { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
//     { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
//   ];

//   // Socket connection
//   useEffect(() => {
//     socketRef.current = io('http://localhost:5000');
    
//     socketRef.current.on('connect', () => {
//       setConnectionStatus('connected');
//       console.log('Connected to server');
//     });

//     socketRef.current.on('disconnect', () => {
//       setConnectionStatus('disconnected');
//       console.log('Disconnected from server');
//     });

//     socketRef.current.on('detection_update', (data) => {
//       setCurrentPrediction(data.prediction);
//       setConfidence(data.confidence);
//       setHandsDetected(data.hands_detected);
      
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//       if (data.active_mode) {
//         setActiveMode(data.active_mode);
//       }
//       if (data.distance) {
//         setDistance(data.distance);
//       }
//     });

//     socketRef.current.on('frame_update', (data) => {
//       setHandsDetected(data.hands_detected);
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//       if (data.active_mode) {
//         setActiveMode(data.active_mode);
//       }
//       if (data.distance) {
//         setDistance(data.distance);
//       }
//     });

//     socketRef.current.on('sentence_update', (data) => {
//       setSentence(data.sentence);
//     });

//     socketRef.current.on('detection_started', () => {
//       setIsDetecting(true);
//     });

//     socketRef.current.on('detection_stopped', () => {
//       setIsDetecting(false);
//       setCurrentPrediction('');
//       setConfidence(0);
//       setLandmarksImage(null);
//       setActiveMode(null);
//       setDistance('unknown');
//     });

//     socketRef.current.on('error', (data) => {
//       console.error('Server error:', data.message);
//       alert(`Error: ${data.message}`);
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   // Auto-translate when sentence changes
//   useEffect(() => {
//     if (sentence.length > 0 && showTranslation) {
//       translateSentence();
//     }
//   }, [sentence, selectedLanguage]);

//   const translateSentence = async () => {
//     const textToTranslate = sentence.join(' ');
//     if (!textToTranslate.trim()) return;

//     setIsTranslating(true);
//     try {
//       // Using MyMemory Translation API (Free, no API key needed)
//       const response = await fetch(
//         `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${selectedLanguage}`
//       );
//       const data = await response.json();
      
//       if (data.responseStatus === 200) {
//         setTranslatedText(data.responseData.translatedText);
//       } else {
//         setTranslatedText('Translation unavailable');
//       }
//     } catch (error) {
//       console.error('Translation error:', error);
//       setTranslatedText('Translation failed');
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   // Function to speak translated text
//   const speakTranslatedText = () => {
//     if (!translatedText.trim()) return;
    
//     setIsSpeakingTranslated(true);
    
//     // Client-side TTS for translated text
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(translatedText);
      
//       // Set language based on selected language
//       const languageMap = {
//         'hi': 'hi-IN', // Hindi
//         'bn': 'bn-IN', // Bengali
//         'te': 'te-IN', // Telugu
//         'ta': 'ta-IN', // Tamil
//         'mr': 'mr-IN', // Marathi
//         'gu': 'gu-IN', // Gujarati
//         'kn': 'kn-IN', // Kannada
//         'ml': 'ml-IN'  // Malayalam
//       };
      
//       utterance.lang = languageMap[selectedLanguage] || 'en-US';
      
//       utterance.onend = () => {
//         setIsSpeakingTranslated(false);
//       };
      
//       utterance.onerror = () => {
//         setIsSpeakingTranslated(false);
//         console.error('Speech synthesis failed');
//       };
      
//       window.speechSynthesis.speak(utterance);
//     } else {
//       setIsSpeakingTranslated(false);
//       alert('Text-to-speech is not supported in your browser');
//     }
//   };

//   const startDetection = (mode) => {
//     if (socketRef.current) {
//       socketRef.current.emit('start_detection', { mode });
//       setDetectionMode(mode);
//     }
//   };

//   const stopDetection = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('stop_detection');
//     }
//   };

//   const addToSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('add_to_sentence');
//     }
//   };

//   const clearSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('clear_sentence');
//     }
//     setTranslatedText('');
//   };

//   const speakSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('speak_sentence');
//     }
    
//     // Client-side TTS for English as fallback
//     if (sentence.length > 0 && 'speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(sentence.join(' '));
//       utterance.lang = 'en-US';
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const getModeColor = (mode) => {
//     switch(mode) {
//       case 'letter': return 'text-cyan-600';
//       case 'word': return 'text-orange-600';
//       default: return 'text-gray-600';
//     }
//   };

//   const getModeBgColor = (mode) => {
//     switch(mode) {
//       case 'letter': return 'bg-cyan-50 border-cyan-200';
//       case 'word': return 'bg-orange-50 border-orange-200';
//       default: return 'bg-gray-50 border-gray-200';
//     }
//   };

//   const getDistanceColor = (dist) => {
//     switch(dist) {
//       case 'close': return 'text-red-600 bg-red-50';
//       case 'far': return 'text-blue-600 bg-blue-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 pb-16">
//       {/* Fixed Height Container - No Scrolling Needed */}
//       <div className="h-screen flex flex-col max-w-7xl mx-auto p-6">
        
//         {/* Header Section - Fixed Height */}
//         <div className="flex-shrink-0 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
//               Sign Language Detection
//             </h3>
//             <div className="flex items-center gap-4">
//               <span className="text-gray-700 dark:text-gray-300 text-sm">
//                 Welcome, {localStorage.getItem('username') || 'User'}
//               </span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-4 mt-2">
//             <div className={`flex items-center gap-2 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
//               <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
//               <span className="text-sm">{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
//             </div>
//             {isDetecting && (
//               <div className="flex items-center gap-2 text-blue-600">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Live Detection</span>
//               </div>
//             )}
//             {handsDetected && isDetecting && (
//               <div className="flex items-center gap-2 text-green-600">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Hands Detected</span>
//               </div>
//             )}
//             {detectionMode === 'auto' && activeMode && isDetecting && (
//               <div className={`flex items-center gap-2 ${getModeColor(activeMode)} px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600`}>
//                 <span className="text-sm font-medium">
//                   {activeMode === 'letter' ? 'Letter Mode' : 'Word Mode'} 
//                   {distance !== 'unknown' && ` (${distance})`}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Content Grid - Takes remaining space */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
          
//           {/* Left Column - Controls */}
//           <div className="space-y-6 overflow-y-auto">
//             {/* Mode Selection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Detection Mode
//               </h4>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => !isDetecting && startDetection('auto')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'auto' && isDetecting
//                       ? 'bg-blue-500 text-white shadow-lg'
//                       : detectionMode === 'auto'
//                       ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'auto'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Auto (Distance-based)</span>
//                     {detectionMode === 'auto' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Automatically switches between letters and words</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('letter')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'letter' && isDetecting
//                       ? 'bg-green-500 text-white shadow-lg'
//                       : detectionMode === 'letter'
//                       ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'letter' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'letter'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Letters Only</span>
//                     {detectionMode === 'letter' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Close to camera for letters</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('word')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'word' && isDetecting
//                       ? 'bg-purple-500 text-white shadow-lg'
//                       : detectionMode === 'word'
//                       ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'word' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'word'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Words Only</span>
//                     {detectionMode === 'word' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Away from camera for words</div>
//                 </button>
//               </div>
//             </div>

//             {/* Distance Info - For Auto Mode */}
//             {detectionMode === 'auto' && isDetecting && (
//               <div className={`rounded-2xl shadow-lg p-6 border ${getModeBgColor(activeMode)} dark:bg-gray-800 dark:border-gray-700`}>
//                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Distance Detection</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span>
//                     <span className={`font-bold px-3 py-1 rounded-lg ${getDistanceColor(distance)} dark:bg-gray-700`}>
//                       {distance === 'close' ? 'CLOSE' : distance === 'far' ? 'FAR' : 'Unknown'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">Active Mode:</span>
//                     <span className={`font-bold px-3 py-1 rounded-lg ${getModeColor(activeMode)} bg-white dark:bg-gray-700`}>
//                       {activeMode === 'letter' ? 'Letters' : activeMode === 'word' ? 'Words' : '-'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Actions
//               </h4>
//               <div className="grid grid-cols-2 gap-3">
//                 {!isDetecting ? (
//                   <button
//                     onClick={() => startDetection(detectionMode)}
//                     className="col-span-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Start Detection
//                   </button>
//                 ) : (
//                   <button
//                     onClick={stopDetection}
//                     className="col-span-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Stop Detection
//                   </button>
//                 )}
                
//                 <button
//                   onClick={addToSentence}
//                   disabled={!currentPrediction || !isDetecting}
//                   className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Add to Sentence
//                 </button>
                
//                 <button
//                   onClick={clearSentence}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                 >
//                   Clear
//                 </button>
                
//                 <button
//                   onClick={speakSentence}
//                   disabled={sentence.length === 0}
//                   className="col-span-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Speak Sentence
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Middle Column - Camera Feed with Landmarks */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//               Live Camera Feed
//             </h4>
            
//             <div className="flex-grow flex flex-col justify-center items-center bg-black rounded-lg overflow-hidden relative">
//               {!isDetecting ? (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-6xl mb-4">📷</div>
//                   <p>Camera feed will appear here</p>
//                   <p className="text-sm mt-2">Start detection to see live video with hand landmarks</p>
//                 </div>
//               ) : landmarksImage ? (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img 
//                     src={landmarksImage} 
//                     alt="Live camera feed with hand landmarks"
//                     className="w-full h-full object-contain"
//                     style={{ maxHeight: '400px' }}
//                   />
//                 </div>
//               ) : (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-4xl mb-4">⏳</div>
//                   <p>Starting camera...</p>
//                 </div>
//               )}
              
//               {isDetecting && (
//                 <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
//                   {handsDetected ? '🟢 Hands Detected' : '🟡 Waiting for hands...'}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Detection Results & Sentence Builder */}
//           <div className="space-y-6 overflow-y-auto">
//             {/* Current Detection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Current Detection
//               </h4>
              
//               <div className="flex-grow flex flex-col justify-center items-center">
//                 {!isDetecting ? (
//                   <div className="text-center text-gray-500 dark:text-gray-400">
//                     <div className="text-6xl mb-4">👋</div>
//                     <p>Start detection to see results</p>
//                   </div>
//                 ) : !handsDetected ? (
//                   <div className="text-center text-orange-500">
//                     <div className="text-6xl mb-4">✋</div>
//                     <p>Show your hands to the camera</p>
//                   </div>
//                 ) : (
//                   <div className="text-center w-full">
//                     <div className={`text-5xl font-bold mb-4 ${
//                       confidence > 0.8 ? 'text-green-600' : 
//                       confidence > 0.6 ? 'text-blue-600' : 'text-orange-600'
//                     }`}>
//                       {currentPrediction}
//                     </div>
//                     <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
//                       Confidence: {(confidence * 100).toFixed(1)}%
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                       <div 
//                         className={`h-3 rounded-full ${
//                           confidence > 0.8 ? 'bg-green-500' : 
//                           confidence > 0.6 ? 'bg-blue-500' : 'bg-orange-500'
//                         }`}
//                         style={{ width: `${confidence * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Sentence Builder */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Sentence Builder
//               </h4>
              
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 h-32 overflow-y-auto">
//                 {sentence.length > 0 ? (
//                   <div className="space-y-2">
//                     {sentence.map((word, index) => (
//                       <div 
//                         key={index}
//                         className="bg-white dark:bg-gray-600 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500 flex justify-between items-center"
//                       >
//                         <span>{word}</span>
//                         <span className="text-xs text-gray-500">#{index + 1}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-center">
//                     <div>
//                       <div className="text-2xl mb-1">📝</div>
//                       <p className="text-sm">Your sentence will appear here</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {sentence.length > 0 && (
//                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <p className="text-blue-800 dark:text-blue-300 text-sm">
//                     <strong>Current Sentence:</strong> {sentence.join(' ')}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Translation Panel */}
//             {sentence.length > 0 && (
//               <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800">
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
//                     <span>🌐</span> Translation
//                   </h4>
//                   <button
//                     onClick={() => setShowTranslation(!showTranslation)}
//                     className="text-sm px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium transition-colors"
//                   >
//                     {showTranslation ? 'Hide' : 'Show'}
//                   </button>
//                 </div>

//                 {showTranslation && (
//                   <div className="space-y-4">
//                     {/* Language Selector */}
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                         Select Language:
//                       </label>
//                       <select
//                         value={selectedLanguage}
//                         onChange={(e) => setSelectedLanguage(e.target.value)}
//                         className="w-full px-4 py-2 rounded-lg border border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 focus:outline-none bg-white dark:bg-gray-700 font-medium text-gray-800 dark:text-white"
//                       >
//                         {languages.map((lang) => (
//                           <option key={lang.code} value={lang.code}>
//                             {lang.name} ({lang.nativeName})
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={translateSentence}
//                         disabled={isTranslating}
//                         className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
//                       >
//                         {isTranslating ? 'Translating...' : 'Translate'}
//                       </button>
                      
//                       <button
//                         onClick={speakTranslatedText}
//                         disabled={!translatedText || isSpeakingTranslated}
//                         className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
//                       >
//                         {isSpeakingTranslated ? 'Speaking...' : '🔊 Speak'}
//                       </button>
//                     </div>

//                     {/* Translated Output */}
//                     {translatedText && (
//                       <div className="bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 p-4">
//                         <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
//                           Translated Text:
//                         </div>
//                         <div className="text-lg font-medium text-gray-800 dark:text-white" style={{ lineHeight: '1.6' }}>
//                           {translatedText}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DetectionInterface;













// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// function DetectionInterface() {
//   const [detectionMode, setDetectionMode] = useState('auto');
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [currentPrediction, setCurrentPrediction] = useState('');
//   const [confidence, setConfidence] = useState(0);
//   const [sentence, setSentence] = useState([]);
//   const [handsDetected, setHandsDetected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [landmarksImage, setLandmarksImage] = useState(null);
//   const [activeMode, setActiveMode] = useState(null);
//   const [distance, setDistance] = useState('unknown');
  
//   // Translation states
//   const [selectedLanguage, setSelectedLanguage] = useState('hi');
//   const [translatedText, setTranslatedText] = useState('');
//   const [isTranslating, setIsTranslating] = useState(false);
//   const [showTranslation, setShowTranslation] = useState(false);
//   const [isSpeakingTranslated, setIsSpeakingTranslated] = useState(false);
  
//   const socketRef = useRef(null);

//   // Indian language options
//   const languages = [
//     { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
//     { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
//     { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
//     { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
//     { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
//     { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
//     { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
//     { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
//   ];

//   // Socket connection
//   useEffect(() => {
//     socketRef.current = io('http://localhost:5000');
    
//     socketRef.current.on('connect', () => {
//       setConnectionStatus('connected');
//       console.log('Connected to server');
//     });

//     socketRef.current.on('disconnect', () => {
//       setConnectionStatus('disconnected');
//       console.log('Disconnected from server');
//     });

//     socketRef.current.on('detection_update', (data) => {
//       setCurrentPrediction(data.prediction);
//       setConfidence(data.confidence);
//       setHandsDetected(data.hands_detected);
      
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//       if (data.active_mode) {
//         setActiveMode(data.active_mode);
//       }
//       if (data.distance) {
//         setDistance(data.distance);
//       }
//     });

//     socketRef.current.on('frame_update', (data) => {
//       setHandsDetected(data.hands_detected);
//       if (data.landmarks_image) {
//         setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
//       }
//       if (data.active_mode) {
//         setActiveMode(data.active_mode);
//       }
//       if (data.distance) {
//         setDistance(data.distance);
//       }
//     });

//     socketRef.current.on('sentence_update', (data) => {
//       setSentence(data.sentence);
//     });

//     socketRef.current.on('detection_started', () => {
//       setIsDetecting(true);
//     });

//     socketRef.current.on('detection_stopped', () => {
//       setIsDetecting(false);
//       setCurrentPrediction('');
//       setConfidence(0);
//       setLandmarksImage(null);
//       setActiveMode(null);
//       setDistance('unknown');
//     });

//     socketRef.current.on('error', (data) => {
//       console.error('Server error:', data.message);
//       alert(`Error: ${data.message}`);
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   // Auto-translate when sentence changes
//   useEffect(() => {
//     if (sentence.length > 0 && showTranslation) {
//       translateSentence();
//     }
//   }, [sentence, selectedLanguage]);

//   const translateSentence = async () => {
//     const textToTranslate = sentence.join(''); // Join without spaces for translation
//     if (!textToTranslate.trim()) return;

//     setIsTranslating(true);
//     try {
//       // Using MyMemory Translation API (Free, no API key needed)
//       const response = await fetch(
//         `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${selectedLanguage}`
//       );
//       const data = await response.json();
      
//       if (data.responseStatus === 200) {
//         setTranslatedText(data.responseData.translatedText);
//       } else {
//         setTranslatedText('Translation unavailable');
//       }
//     } catch (error) {
//       console.error('Translation error:', error);
//       setTranslatedText('Translation failed');
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   // Function to speak translated text
//   const speakTranslatedText = () => {
//     if (!translatedText.trim()) return;
    
//     setIsSpeakingTranslated(true);
    
//     // Client-side TTS for translated text
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(translatedText);
      
//       // Set language based on selected language
//       const languageMap = {
//         'hi': 'hi-IN', // Hindi
//         'bn': 'bn-IN', // Bengali
//         'te': 'te-IN', // Telugu
//         'ta': 'ta-IN', // Tamil
//         'mr': 'mr-IN', // Marathi
//         'gu': 'gu-IN', // Gujarati
//         'kn': 'kn-IN', // Kannada
//         'ml': 'ml-IN'  // Malayalam
//       };
      
//       utterance.lang = languageMap[selectedLanguage] || 'en-US';
      
//       utterance.onend = () => {
//         setIsSpeakingTranslated(false);
//       };
      
//       utterance.onerror = () => {
//         setIsSpeakingTranslated(false);
//         console.error('Speech synthesis failed');
//       };
      
//       window.speechSynthesis.speak(utterance);
//     } else {
//       setIsSpeakingTranslated(false);
//       alert('Text-to-speech is not supported in your browser');
//     }
//   };

//   // New functions for sentence management
//   const addSpace = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('add_space');
//     }
//   };

//   const removeLastCharacter = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('remove_last_character');
//     }
//   };

//   const startDetection = (mode) => {
//     if (socketRef.current) {
//       socketRef.current.emit('start_detection', { mode });
//       setDetectionMode(mode);
//     }
//   };

//   const stopDetection = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('stop_detection');
//     }
//   };

//   const addToSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('add_to_sentence');
//     }
//   };

//   const clearSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('clear_sentence');
//     }
//     setTranslatedText('');
//   };

//   const speakSentence = () => {
//     if (socketRef.current) {
//       socketRef.current.emit('speak_sentence');
//     }
    
//     // Client-side TTS for English as fallback
//     if (sentence.length > 0 && 'speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(sentence.join(''));
//       utterance.lang = 'en-US';
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const getModeColor = (mode) => {
//     switch(mode) {
//       case 'letter': return 'text-cyan-600';
//       case 'word': return 'text-orange-600';
//       default: return 'text-gray-600';
//     }
//   };

//   const getModeBgColor = (mode) => {
//     switch(mode) {
//       case 'letter': return 'bg-cyan-50 border-cyan-200';
//       case 'word': return 'bg-orange-50 border-orange-200';
//       default: return 'bg-gray-50 border-gray-200';
//     }
//   };

//   const getDistanceColor = (dist) => {
//     switch(dist) {
//       case 'close': return 'text-red-600 bg-red-50';
//       case 'far': return 'text-blue-600 bg-blue-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   // Helper function to display sentence with proper formatting
//   const getDisplaySentence = () => {
//     return sentence.join('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 pb-16">
//       {/* Fixed Height Container - No Scrolling Needed */}
//       <div className="h-screen flex flex-col max-w-7xl mx-auto p-6">
        
//         {/* Header Section - Fixed Height */}
//         <div className="flex-shrink-0 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
//               Sign Language Detection
//             </h3>
//             <div className="flex items-center gap-4">
//               <span className="text-gray-700 dark:text-gray-300 text-sm">
//                 Welcome, {localStorage.getItem('username') || 'User'}
//               </span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-4 mt-2">
//             <div className={`flex items-center gap-2 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
//               <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
//               <span className="text-sm">{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
//             </div>
//             {isDetecting && (
//               <div className="flex items-center gap-2 text-blue-600">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Live Detection</span>
//               </div>
//             )}
//             {handsDetected && isDetecting && (
//               <div className="flex items-center gap-2 text-green-600">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm">Hands Detected</span>
//               </div>
//             )}
//             {detectionMode === 'auto' && activeMode && isDetecting && (
//               <div className={`flex items-center gap-2 ${getModeColor(activeMode)} px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600`}>
//                 <span className="text-sm font-medium">
//                   {activeMode === 'letter' ? 'Letter Mode' : 'Word Mode'} 
//                   {distance !== 'unknown' && ` (${distance})`}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Content Grid - Takes remaining space */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
          
//           {/* Left Column - Controls */}
//           <div className="space-y-6 overflow-y-auto">
//             {/* Mode Selection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Detection Mode
//               </h4>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => !isDetecting && startDetection('auto')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'auto' && isDetecting
//                       ? 'bg-blue-500 text-white shadow-lg'
//                       : detectionMode === 'auto'
//                       ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'auto'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Auto (Distance-based)</span>
//                     {detectionMode === 'auto' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Automatically switches between letters and words</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('letter')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'letter' && isDetecting
//                       ? 'bg-green-500 text-white shadow-lg'
//                       : detectionMode === 'letter'
//                       ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'letter' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'letter'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Letters Only</span>
//                     {detectionMode === 'letter' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Close to camera for letters</div>
//                 </button>

//                 <button
//                   onClick={() => !isDetecting && startDetection('word')}
//                   className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
//                     detectionMode === 'word' && isDetecting
//                       ? 'bg-purple-500 text-white shadow-lg'
//                       : detectionMode === 'word'
//                       ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   } ${isDetecting && detectionMode !== 'word' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDetecting && detectionMode !== 'word'}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>Words Only</span>
//                     {detectionMode === 'word' && isDetecting && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                   <div className="text-xs mt-1 opacity-75">Away from camera for words</div>
//                 </button>
//               </div>
//             </div>

//             {/* Distance Info - For Auto Mode */}
//             {detectionMode === 'auto' && isDetecting && (
//               <div className={`rounded-2xl shadow-lg p-6 border ${getModeBgColor(activeMode)} dark:bg-gray-800 dark:border-gray-700`}>
//                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Distance Detection</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span>
//                     <span className={`font-bold px-3 py-1 rounded-lg ${getDistanceColor(distance)} dark:bg-gray-700`}>
//                       {distance === 'close' ? 'CLOSE' : distance === 'far' ? 'FAR' : 'Unknown'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">Active Mode:</span>
//                     <span className={`font-bold px-3 py-1 rounded-lg ${getModeColor(activeMode)} bg-white dark:bg-gray-700`}>
//                       {activeMode === 'letter' ? 'Letters' : activeMode === 'word' ? 'Words' : '-'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Actions
//               </h4>
//               <div className="grid grid-cols-2 gap-3">
//                 {!isDetecting ? (
//                   <button
//                     onClick={() => startDetection(detectionMode)}
//                     className="col-span-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Start Detection
//                   </button>
//                 ) : (
//                   <button
//                     onClick={stopDetection}
//                     className="col-span-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                   >
//                     Stop Detection
//                   </button>
//                 )}
                
//                 <button
//                   onClick={addToSentence}
//                   disabled={!currentPrediction || !isDetecting}
//                   className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Add to Sentence
//                 </button>
                
//                 <button
//                   onClick={clearSentence}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                 >
//                   Clear
//                 </button>

//                 {/* NEW BUTTONS FOR SPACE AND REMOVAL */}
//                 <button
//                   onClick={addSpace}
//                   disabled={!isDetecting}
//                   className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Add Space
//                 </button>
                
//                 <button
//                   onClick={removeLastCharacter}
//                   disabled={sentence.length === 0}
//                   className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Remove Last
//                 </button>
                
//                 <button
//                   onClick={speakSentence}
//                   disabled={sentence.length === 0}
//                   className="col-span-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
//                 >
//                   Speak Sentence
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Middle Column - Camera Feed with Landmarks */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//               Live Camera Feed
//             </h4>
            
//             <div className="flex-grow flex flex-col justify-center items-center bg-black rounded-lg overflow-hidden relative">
//               {!isDetecting ? (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-6xl mb-4">📷</div>
//                   <p>Camera feed will appear here</p>
//                   <p className="text-sm mt-2">Start detection to see live video with hand landmarks</p>
//                 </div>
//               ) : landmarksImage ? (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img 
//                     src={landmarksImage} 
//                     alt="Live camera feed with hand landmarks"
//                     className="w-full h-full object-contain"
//                     style={{ maxHeight: '400px' }}
//                   />
//                 </div>
//               ) : (
//                 <div className="text-center text-gray-400 p-8">
//                   <div className="text-4xl mb-4">⏳</div>
//                   <p>Starting camera...</p>
//                 </div>
//               )}
              
//               {isDetecting && (
//                 <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
//                   {handsDetected ? '🟢 Hands Detected' : '🟡 Waiting for hands...'}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Detection Results & Sentence Builder */}
//           <div className="space-y-6 overflow-y-auto">
//             {/* Current Detection */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Current Detection
//               </h4>
              
//               <div className="flex-grow flex flex-col justify-center items-center">
//                 {!isDetecting ? (
//                   <div className="text-center text-gray-500 dark:text-gray-400">
//                     <div className="text-6xl mb-4">👋</div>
//                     <p>Start detection to see results</p>
//                   </div>
//                 ) : !handsDetected ? (
//                   <div className="text-center text-orange-500">
//                     <div className="text-6xl mb-4">✋</div>
//                     <p>Show your hands to the camera</p>
//                   </div>
//                 ) : (
//                   <div className="text-center w-full">
//                     <div className={`text-5xl font-bold mb-4 ${
//                       confidence > 0.8 ? 'text-green-600' : 
//                       confidence > 0.6 ? 'text-blue-600' : 'text-orange-600'
//                     }`}>
//                       {currentPrediction}
//                     </div>
//                     <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
//                       Confidence: {(confidence * 100).toFixed(1)}%
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                       <div 
//                         className={`h-3 rounded-full ${
//                           confidence > 0.8 ? 'bg-green-500' : 
//                           confidence > 0.6 ? 'bg-blue-500' : 'bg-orange-500'
//                         }`}
//                         style={{ width: `${confidence * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Sentence Builder */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
//               <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                 Sentence Builder
//               </h4>
              
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 h-32 overflow-y-auto">
//                 {sentence.length > 0 ? (
//                   <div className="flex flex-wrap gap-1">
//                     {sentence.map((word, index) => (
//                       <div 
//                         key={index}
//                         className={`px-3 py-2 rounded-lg border flex items-center ${
//                           word === ' ' 
//                             ? 'bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500' 
//                             : 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500'
//                         }`}
//                       >
//                         <span>{word === ' ' ? '␣' : word}</span>
//                         <span className="text-xs text-gray-500 ml-2">#{index + 1}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-center">
//                     <div>
//                       <div className="text-2xl mb-1">📝</div>
//                       <p className="text-sm">Your sentence will appear here</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {sentence.length > 0 && (
//                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <p className="text-blue-800 dark:text-blue-300 text-sm">
//                     <strong>Current Sentence:</strong> {getDisplaySentence()}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Translation Panel */}
//             {sentence.length > 0 && (
//               <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800">
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
//                     <span>🌐</span> Translation
//                   </h4>
//                   <button
//                     onClick={() => setShowTranslation(!showTranslation)}
//                     className="text-sm px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium transition-colors"
//                   >
//                     {showTranslation ? 'Hide' : 'Show'}
//                   </button>
//                 </div>

//                 {showTranslation && (
//                   <div className="space-y-4">
//                     {/* Language Selector */}
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                         Select Language:
//                       </label>
//                       <select
//                         value={selectedLanguage}
//                         onChange={(e) => setSelectedLanguage(e.target.value)}
//                         className="w-full px-4 py-2 rounded-lg border border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 focus:outline-none bg-white dark:bg-gray-700 font-medium text-gray-800 dark:text-white"
//                       >
//                         {languages.map((lang) => (
//                           <option key={lang.code} value={lang.code}>
//                             {lang.name} ({lang.nativeName})
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={translateSentence}
//                         disabled={isTranslating}
//                         className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
//                       >
//                         {isTranslating ? 'Translating...' : 'Translate'}
//                       </button>
                      
//                       <button
//                         onClick={speakTranslatedText}
//                         disabled={!translatedText || isSpeakingTranslated}
//                         className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
//                       >
//                         {isSpeakingTranslated ? 'Speaking...' : '🔊 Speak'}
//                       </button>
//                     </div>

//                     {/* Translated Output */}
//                     {translatedText && (
//                       <div className="bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 p-4">
//                         <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
//                           Translated Text:
//                         </div>
//                         <div className="text-lg font-medium text-gray-800 dark:text-white" style={{ lineHeight: '1.6' }}>
//                           {translatedText}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DetectionInterface;









import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function DetectionInterface() {
  const [detectionMode, setDetectionMode] = useState('auto');
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [sentence, setSentence] = useState([]);
  const [handsDetected, setHandsDetected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [landmarksImage, setLandmarksImage] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [distance, setDistance] = useState('unknown');
  
  // Translation states
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSpeakingTranslated, setIsSpeakingTranslated] = useState(false);
  
  const socketRef = useRef(null);

  // Indian language options
  const languages = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
  ];

  // Socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('Disconnected from server');
    });

    socketRef.current.on('detection_update', (data) => {
      setCurrentPrediction(data.prediction);
      setConfidence(data.confidence);
      setHandsDetected(data.hands_detected);
      
      if (data.landmarks_image) {
        setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
      }
      if (data.active_mode) {
        setActiveMode(data.active_mode);
      }
      if (data.distance) {
        setDistance(data.distance);
      }
    });

    socketRef.current.on('frame_update', (data) => {
      setHandsDetected(data.hands_detected);
      if (data.landmarks_image) {
        setLandmarksImage(`data:image/jpeg;base64,${data.landmarks_image}`);
      }
      if (data.active_mode) {
        setActiveMode(data.active_mode);
      }
      if (data.distance) {
        setDistance(data.distance);
      }
    });

    socketRef.current.on('sentence_update', (data) => {
      setSentence(data.sentence);
    });

    socketRef.current.on('detection_started', () => {
      setIsDetecting(true);
    });

    socketRef.current.on('detection_stopped', () => {
      setIsDetecting(false);
      setCurrentPrediction('');
      setConfidence(0);
      setLandmarksImage(null);
      setActiveMode(null);
      setDistance('unknown');
    });

    socketRef.current.on('error', (data) => {
      console.error('Server error:', data.message);
      alert(`Error: ${data.message}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Auto-translate when sentence changes
  useEffect(() => {
    if (sentence.length > 0 && showTranslation) {
      translateSentence();
    }
  }, [sentence, selectedLanguage]);

  // Manual translation fallback function
  const getManualTranslation = (text, language) => {
    const translations = {
      'hi': {
        'hello': 'नमस्ते',
        'good morning': 'शुभ प्रभात',
        'thank you': 'धन्यवाद',
        'good': 'अच्छा',
        'morning': 'सुबह',
        'close': 'बंद',
        'exam': 'परीक्षा',
        'goodmorning': 'शुभ प्रभात'
      },
      'ta': {
        'hello': 'வணக்கம்',
        'good morning': 'காலை வணக்கம்',
        'thank you': 'நன்றி',
        'good': 'நல்ல',
        'morning': 'காலை',
        'close': 'மூடு',
        'exam': 'தேர்வு',
        'goodmorning': 'காலை வணக்கம்'
      },
      'te': {
        'hello': 'హలో',
        'good morning': 'శుభోదయం',
        'thank you': 'ధన్యవాదాలు',
        'good': 'మంచి',
        'morning': 'ఉదయం',
        'close': 'మూసివేయి',
        'exam': 'పరీక్ష',
        'goodmorning': 'శుభోదయం'
      },
      'bn': {
        'hello': 'হ্যালো',
        'good morning': 'সুপ্রভাত',
        'thank you': 'ধন্যবাদ',
        'good': 'ভাল',
        'morning': 'সকাল',
        'close': 'বন্ধ',
        'exam': 'পরীক্ষা',
        'goodmorning': 'সুপ্রভাত'
      },
      'mr': {
        'hello': 'नमस्कार',
        'good morning': 'शुभ प्रभात',
        'thank you': 'धन्यवाद',
        'good': 'चांगले',
        'morning': 'सकाळ',
        'close': 'बंद',
        'exam': 'परीक्षा',
        'goodmorning': 'शुभ प्रभात'
      },
      'gu': {
        'hello': 'નમસ્તે',
        'good morning': 'શુભ સવાર',
        'thank you': 'આભાર',
        'good': 'સારું',
        'morning': 'સવાર',
        'close': 'બંધ',
        'exam': 'પરીક્ષા',
        'goodmorning': 'શુભ સવાર'
      },
      'kn': {
        'hello': 'ನಮಸ್ಕಾರ',
        'good morning': 'ಶುಭೋದಯ',
        'thank you': 'ಧನ್ಯವಾದ',
        'good': 'ಒಳ್ಳೆಯ',
        'morning': 'ಬೆಳಗ್ಗೆ',
        'close': 'ಮುಚ್ಚಿ',
        'exam': 'ಪರೀಕ್ಷೆ',
        'goodmorning': 'ಶುಭೋದಯ'
      },
      'ml': {
        'hello': 'ഹലോ',
        'good morning': 'സുപ്രഭാതം',
        'thank you': 'നന്ദി',
        'good': 'നല്ല',
        'morning': 'രാവിലെ',
        'close': 'അടയ്ക്കുക',
        'exam': 'പരീക്ഷ',
        'goodmorning': 'സുപ്രഭാതം'
      }
    };

    const lowerText = text.toLowerCase().replace(/\s+/g, '');
    
    // Check for exact matches first
    if (translations[language] && translations[language][lowerText]) {
      return translations[language][lowerText];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(translations[language] || {})) {
      if (lowerText.includes(key)) {
        return value;
      }
    }
    
    return null;
  };

  const translateSentence = async () => {
    const textToTranslate = getDisplaySentence();
    if (!textToTranslate.trim()) {
      setTranslatedText('No text to translate');
      return;
    }

    setIsTranslating(true);
    setTranslatedText(''); // Clear previous translation
    
    try {
      console.log('Translating:', textToTranslate, 'to', selectedLanguage);
      
      // Method 1: Try Google Translate API first (more reliable)
      const googleResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${selectedLanguage}&dt=t&q=${encodeURIComponent(textToTranslate)}`
      );
      
      if (googleResponse.ok) {
        const data = await googleResponse.json();
        
        // The response structure is nested arrays
        if (data && data[0]) {
          const translatedText = data[0].map((item) => item[0]).join('');
          setTranslatedText(translatedText);
          console.log('Google Translation successful:', translatedText);
          return;
        }
      }

      // Method 2: Try LibreTranslate
      console.log('Trying LibreTranslate...');
      const libreResponse = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        body: JSON.stringify({
          q: textToTranslate,
          source: 'en',
          target: selectedLanguage,
          format: 'text'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (libreResponse.ok) {
        const data = await libreResponse.json();
        setTranslatedText(data.translatedText);
        console.log('LibreTranslate successful:', data.translatedText);
        return;
      }

      // Method 3: Fallback to MyMemory API
      console.log('Trying MyMemory API...');
      const memoryResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${selectedLanguage}`
      );
      
      if (memoryResponse.ok) {
        const memoryData = await memoryResponse.json();
        
        if (memoryData.responseStatus === 200 && memoryData.responseData.translatedText) {
          let cleanTranslation = memoryData.responseData.translatedText
            .replace(/\s+/g, ' ')
            .trim();
          
          // Check if translation actually worked
          if (cleanTranslation.toLowerCase() !== textToTranslate.toLowerCase()) {
            setTranslatedText(cleanTranslation);
            console.log('MyMemory Translation successful:', cleanTranslation);
          } else {
            throw new Error('Translation returned same text');
          }
        } else {
          throw new Error('MyMemory API returned error');
        }
      } else {
        throw new Error('All translation services failed');
      }
      
    } catch (error) {
      console.error('Translation error:', error);
      
      // Final fallback to manual translation
      console.log('Using manual translation fallback...');
      const manualTranslation = getManualTranslation(textToTranslate, selectedLanguage);
      if (manualTranslation) {
        setTranslatedText(manualTranslation);
        console.log('Manual translation used:', manualTranslation);
      } else {
        setTranslatedText('Translation unavailable. Please try common phrases like "hello", "good morning".');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  // Function to speak translated text
  const speakTranslatedText = () => {
    if (!translatedText.trim()) return;
    
    setIsSpeakingTranslated(true);
    
    // Client-side TTS for translated text
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      
      // Set language based on selected language
      const languageMap = {
        'hi': 'hi-IN', // Hindi
        'bn': 'bn-IN', // Bengali
        'te': 'te-IN', // Telugu
        'ta': 'ta-IN', // Tamil
        'mr': 'mr-IN', // Marathi
        'gu': 'gu-IN', // Gujarati
        'kn': 'kn-IN', // Kannada
        'ml': 'ml-IN'  // Malayalam
      };
      
      utterance.lang = languageMap[selectedLanguage] || 'en-US';
      
      utterance.onend = () => {
        setIsSpeakingTranslated(false);
      };
      
      utterance.onerror = () => {
        setIsSpeakingTranslated(false);
        console.error('Speech synthesis failed');
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeakingTranslated(false);
      alert('Text-to-speech is not supported in your browser');
    }
  };

  // Debug translation function
  const debugTranslation = async () => {
    const textToTranslate = getDisplaySentence();
    console.log('=== TRANSLATION DEBUG INFO ===');
    console.log('Original text:', textToTranslate);
    console.log('Target language:', selectedLanguage);
    console.log('Text length:', textToTranslate.length);
    
    // Test with a simple word
    try {
      const testResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=hello&langpair=en|${selectedLanguage}`
      );
      const testData = await testResponse.json();
      console.log('Test translation (hello):', testData);
    } catch (error) {
      console.log('Test translation failed:', error);
    }
  };

  // New functions for sentence management
  const addSpace = () => {
    if (socketRef.current) {
      socketRef.current.emit('add_space');
    }
  };

  const removeLastCharacter = () => {
    if (socketRef.current) {
      socketRef.current.emit('remove_last_character');
    }
  };

  const startDetection = (mode) => {
    if (socketRef.current) {
      socketRef.current.emit('start_detection', { mode });
      setDetectionMode(mode);
    }
  };

  const stopDetection = () => {
    if (socketRef.current) {
      socketRef.current.emit('stop_detection');
    }
  };

  const addToSentence = () => {
    if (socketRef.current) {
      socketRef.current.emit('add_to_sentence');
    }
  };

  const clearSentence = () => {
    if (socketRef.current) {
      socketRef.current.emit('clear_sentence');
    }
    setTranslatedText('');
  };

  const speakSentence = () => {
    if (socketRef.current) {
      socketRef.current.emit('speak_sentence');
    }
    
    // Client-side TTS for English as fallback
    if (sentence.length > 0 && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(getDisplaySentence());
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const getModeColor = (mode) => {
    switch(mode) {
      case 'letter': return 'text-cyan-600';
      case 'word': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getModeBgColor = (mode) => {
    switch(mode) {
      case 'letter': return 'bg-cyan-50 border-cyan-200';
      case 'word': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getDistanceColor = (dist) => {
    switch(dist) {
      case 'close': return 'text-red-600 bg-red-50';
      case 'far': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Helper function to display sentence with proper formatting
  const getDisplaySentence = () => {
    return sentence.join('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 pb-16">
      {/* Fixed Height Container - No Scrolling Needed */}
      <div className="h-screen flex flex-col max-w-7xl mx-auto p-6">
        
        {/* Header Section - Fixed Height */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Sign Language Detection
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Welcome, {localStorage.getItem('username') || 'User'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <div className={`flex items-center gap-2 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
            </div>
            {isDetecting && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Live Detection</span>
              </div>
            )}
            {handsDetected && isDetecting && (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Hands Detected</span>
              </div>
            )}
            {detectionMode === 'auto' && activeMode && isDetecting && (
              <div className={`flex items-center gap-2 ${getModeColor(activeMode)} px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600`}>
                <span className="text-sm font-medium">
                  {activeMode === 'letter' ? 'Letter Mode' : 'Word Mode'} 
                  {distance !== 'unknown' && ` (${distance})`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid - Takes remaining space */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
          
          {/* Left Column - Controls */}
          <div className="space-y-6 overflow-y-auto">
            {/* Mode Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Detection Mode
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => !isDetecting && startDetection('auto')}
                  className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    detectionMode === 'auto' && isDetecting
                      ? 'bg-blue-500 text-white shadow-lg'
                      : detectionMode === 'auto'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${isDetecting && detectionMode !== 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isDetecting && detectionMode !== 'auto'}
                >
                  <div className="flex items-center justify-between">
                    <span>Auto (Distance-based)</span>
                    {detectionMode === 'auto' && isDetecting && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-xs mt-1 opacity-75">Automatically switches between letters and words</div>
                </button>

                <button
                  onClick={() => !isDetecting && startDetection('letter')}
                  className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    detectionMode === 'letter' && isDetecting
                      ? 'bg-green-500 text-white shadow-lg'
                      : detectionMode === 'letter'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${isDetecting && detectionMode !== 'letter' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isDetecting && detectionMode !== 'letter'}
                >
                  <div className="flex items-center justify-between">
                    <span>Letters Only</span>
                    {detectionMode === 'letter' && isDetecting && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-xs mt-1 opacity-75">Close to camera for letters</div>
                </button>

                <button
                  onClick={() => !isDetecting && startDetection('word')}
                  className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    detectionMode === 'word' && isDetecting
                      ? 'bg-purple-500 text-white shadow-lg'
                      : detectionMode === 'word'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${isDetecting && detectionMode !== 'word' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isDetecting && detectionMode !== 'word'}
                >
                  <div className="flex items-center justify-between">
                    <span>Words Only</span>
                    {detectionMode === 'word' && isDetecting && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-xs mt-1 opacity-75">Away from camera for words</div>
                </button>
              </div>
            </div>

            {/* Distance Info - For Auto Mode */}
            {detectionMode === 'auto' && isDetecting && (
              <div className={`rounded-2xl shadow-lg p-6 border ${getModeBgColor(activeMode)} dark:bg-gray-800 dark:border-gray-700`}>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Distance Detection</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span>
                    <span className={`font-bold px-3 py-1 rounded-lg ${getDistanceColor(distance)} dark:bg-gray-700`}>
                      {distance === 'close' ? 'CLOSE' : distance === 'far' ? 'FAR' : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Active Mode:</span>
                    <span className={`font-bold px-3 py-1 rounded-lg ${getModeColor(activeMode)} bg-white dark:bg-gray-700`}>
                      {activeMode === 'letter' ? 'Letters' : activeMode === 'word' ? 'Words' : '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Actions
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {!isDetecting ? (
                  <button
                    onClick={() => startDetection(detectionMode)}
                    className="col-span-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start Detection
                  </button>
                ) : (
                  <button
                    onClick={stopDetection}
                    className="col-span-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Stop Detection
                  </button>
                )}
                
                <button
                  onClick={addToSentence}
                  disabled={!currentPrediction || !isDetecting}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  Add to Sentence
                </button>
                
                <button
                  onClick={clearSentence}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Clear
                </button>

                {/* NEW BUTTONS FOR SPACE AND REMOVAL */}
                <button
                  onClick={addSpace}
                  disabled={!isDetecting}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  Add Space
                </button>
                
                <button
                  onClick={removeLastCharacter}
                  disabled={sentence.length === 0}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  Remove Last
                </button>
                
                <button
                  onClick={speakSentence}
                  disabled={sentence.length === 0}
                  className="col-span-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  Speak Sentence
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column - Camera Feed with Landmarks */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Live Camera Feed
            </h4>
            
            <div className="flex-grow flex flex-col justify-center items-center bg-black rounded-lg overflow-hidden relative">
              {!isDetecting ? (
                <div className="text-center text-gray-400 p-8">
                  <div className="text-6xl mb-4">📷</div>
                  <p>Camera feed will appear here</p>
                  <p className="text-sm mt-2">Start detection to see live video with hand landmarks</p>
                </div>
              ) : landmarksImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src={landmarksImage} 
                    alt="Live camera feed with hand landmarks"
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400 p-8">
                  <div className="text-4xl mb-4">⏳</div>
                  <p>Starting camera...</p>
                </div>
              )}
              
              {isDetecting && (
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  {handsDetected ? '🟢 Hands Detected' : '🟡 Waiting for hands...'}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Detection Results & Sentence Builder */}
          <div className="space-y-6 overflow-y-auto">
            {/* Current Detection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Current Detection
              </h4>
              
              <div className="flex-grow flex flex-col justify-center items-center">
                {!isDetecting ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-6xl mb-4">👋</div>
                    <p>Start detection to see results</p>
                  </div>
                ) : !handsDetected ? (
                  <div className="text-center text-orange-500">
                    <div className="text-6xl mb-4">✋</div>
                    <p>Show your hands to the camera</p>
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <div className={`text-5xl font-bold mb-4 ${
                      confidence > 0.8 ? 'text-green-600' : 
                      confidence > 0.6 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {currentPrediction}
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                      Confidence: {(confidence * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          confidence > 0.8 ? 'bg-green-500' : 
                          confidence > 0.6 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sentence Builder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Sentence Builder
              </h4>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 h-32 overflow-y-auto">
                {sentence.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {sentence.map((word, index) => (
                      <div 
                        key={index}
                        className={`px-3 py-2 rounded-lg border flex items-center ${
                          word === ' ' 
                            ? 'bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500' 
                            : 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500'
                        }`}
                      >
                        <span>{word === ' ' ? '␣' : word}</span>
                        <span className="text-xs text-gray-500 ml-2">#{index + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-center">
                    <div>
                      <div className="text-2xl mb-1">📝</div>
                      <p className="text-sm">Your sentence will appear here</p>
                    </div>
                  </div>
                )}
              </div>
              
              {sentence.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    <strong>Current Sentence:</strong> {getDisplaySentence()}
                  </p>
                </div>
              )}
            </div>

            {/* Translation Panel */}
            {sentence.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <span>🌐</span> Translation
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={debugTranslation}
                      className="text-sm px-3 py-1 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      Debug
                    </button>
                    <button
                      onClick={() => setShowTranslation(!showTranslation)}
                      className="text-sm px-3 py-1 bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium transition-colors"
                    >
                      {showTranslation ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {showTranslation && (
                  <div className="space-y-4">
                    {/* Language Selector */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select Language:
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => {
                          setSelectedLanguage(e.target.value);
                          setTranslatedText(''); // Clear previous translation
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 focus:outline-none bg-white dark:bg-gray-700 font-medium text-gray-800 dark:text-white"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name} ({lang.nativeName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Original Text Display */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 p-3">
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Original Text:
                      </div>
                      <div className="text-gray-800 dark:text-gray-200 font-medium">
                        {getDisplaySentence()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={translateSentence}
                        disabled={isTranslating}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                      >
                        {isTranslating ? 'Translating...' : 'Translate'}
                      </button>
                      
                      <button
                        onClick={speakTranslatedText}
                        disabled={!translatedText || isSpeakingTranslated}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                      >
                        {isSpeakingTranslated ? 'Speaking...' : '🔊 Speak'}
                      </button>
                    </div>

                    {/* Translated Output */}
                    {translatedText && (
                      <div className="bg-white dark:bg-gray-700 rounded-lg border border-green-300 dark:border-green-600 p-4">
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          Translated Text:
                        </div>
                        <div className="text-lg font-medium text-gray-800 dark:text-white" style={{ lineHeight: '1.6' }}>
                          {translatedText}
                        </div>
                        {translatedText.includes('unavailable') || translatedText.includes('failed') || translatedText.includes('try') ? (
                          <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                            Note: Using fallback translation. Try phrases like "hello", "good morning", "thank you".
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Translation Tips */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700 p-3">
                      <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                        💡 Translation Tips:
                      </div>
                      <ul className="text-xs text-yellow-700 dark:text-yellow-400 list-disc list-inside space-y-1">
                        <li>Try common phrases like "hello", "good morning", "thank you"</li>
                        <li>Make sure you have internet connection for live translation</li>
                        <li>Use the Debug button if translation isn't working</li>
                        <li>Manual translations available for basic words</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetectionInterface;