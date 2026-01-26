import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignMateTutorial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [handFrame, setHandFrame] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHandFrame((prev) => (prev + 1) % 4);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { id: 1, title: "Start Detection", subtitle: "Position yourself in front of camera", description: "Click 'Start Detection' and ensure your hands are visible in the camera frame", icon: "🎥", color: "from-green-400 to-emerald-500", bgColor: "bg-green-50", borderColor: "border-green-300" },
    { id: 2, title: "Show Signs", subtitle: "Perform ISL gestures clearly", description: "Make sign language gestures. Move closer for letters (A-Z) or farther for words", icon: "🤟", color: "from-blue-400 to-cyan-500", bgColor: "bg-blue-50", borderColor: "border-blue-300" },
    { id: 3, title: "Build Sentence", subtitle: "Add detected signs to your sentence", description: "Click 'Add' button when a sign is correctly detected to build your sentence", icon: "📝", color: "from-purple-400 to-violet-500", bgColor: "bg-purple-50", borderColor: "border-purple-300" },
    { id: 4, title: "Speak Aloud", subtitle: "Convert your sentence to speech", description: "Press 'Speak' button to hear your sentence spoken aloud", icon: "🔊", color: "from-orange-400 to-amber-500", bgColor: "bg-orange-50", borderColor: "border-orange-300" },
    { id: 5, title: "Translate", subtitle: "Convert to Indian languages", description: "Translate to Hindi, Tamil, Telugu, Bengali and more", icon: "🌐", color: "from-teal-400 to-cyan-500", bgColor: "bg-teal-50", borderColor: "border-teal-300" }
  ];

  // ISL Letter A - Both hands forming triangle/roof shape above head
  const ISL_A = () => (
    <svg viewBox="0 0 150 180" className="w-full h-full">
      <defs>
        <linearGradient id="skinA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914"/>
          <stop offset="50%" stopColor="#6B4F12"/>
          <stop offset="100%" stopColor="#5A4210"/>
        </linearGradient>
        <linearGradient id="skinHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B7924"/>
          <stop offset="100%" stopColor="#7B5F18"/>
        </linearGradient>
      </defs>
      
      {/* Left hand */}
      <g transform="translate(20, 30)">
        {/* Palm */}
        <path d="M 5 60 Q 0 40 10 25 L 30 5 Q 35 0 40 5 L 45 15 Q 50 25 45 40 L 40 60 Q 35 75 20 75 Q 5 75 5 60" fill="url(#skinA)"/>
        {/* Thumb tucked */}
        <ellipse cx="8" cy="55" rx="8" ry="12" fill="url(#skinHighlight)"/>
        {/* Fingers together pointing up-right */}
        <rect x="25" y="5" width="8" height="35" rx="4" fill="url(#skinA)" transform="rotate(15 29 22)"/>
        <rect x="33" y="3" width="8" height="38" rx="4" fill="url(#skinA)" transform="rotate(20 37 22)"/>
        <rect x="41" y="5" width="7" height="35" rx="3.5" fill="url(#skinA)" transform="rotate(25 44 22)"/>
        <rect x="48" y="10" width="6" height="30" rx="3" fill="url(#skinA)" transform="rotate(30 51 25)"/>
      </g>
      
      {/* Right hand - mirrored */}
      <g transform="translate(75, 30) scale(-1, 1) translate(-55, 0)">
        {/* Palm */}
        <path d="M 5 60 Q 0 40 10 25 L 30 5 Q 35 0 40 5 L 45 15 Q 50 25 45 40 L 40 60 Q 35 75 20 75 Q 5 75 5 60" fill="url(#skinA)"/>
        {/* Thumb tucked */}
        <ellipse cx="8" cy="55" rx="8" ry="12" fill="url(#skinHighlight)"/>
        {/* Fingers */}
        <rect x="25" y="5" width="8" height="35" rx="4" fill="url(#skinA)" transform="rotate(15 29 22)"/>
        <rect x="33" y="3" width="8" height="38" rx="4" fill="url(#skinA)" transform="rotate(20 37 22)"/>
        <rect x="41" y="5" width="7" height="35" rx="3.5" fill="url(#skinA)" transform="rotate(25 44 22)"/>
        <rect x="48" y="10" width="6" height="30" rx="3" fill="url(#skinA)" transform="rotate(30 51 25)"/>
      </g>
      
      {/* Fingertips touching - triangle top */}
      <ellipse cx="75" cy="18" rx="12" ry="8" fill="url(#skinHighlight)" opacity="0.8"/>
      
      {/* Label */}
      <text x="75" y="170" fill="#1E40AF" fontSize="28" fontWeight="bold" textAnchor="middle">A</text>
    </svg>
  );

  // ISL Letter B - Flat hand, fingers together, thumb across palm (like OK but flat)
  const ISL_B = () => (
    <svg viewBox="0 0 150 180" className="w-full h-full">
      <defs>
        <linearGradient id="skinB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914"/>
          <stop offset="50%" stopColor="#6B4F12"/>
          <stop offset="100%" stopColor="#5A4210"/>
        </linearGradient>
      </defs>
      
      <g transform="translate(30, 15)">
        {/* Palm - facing viewer */}
        <ellipse cx="45" cy="95" rx="32" ry="38" fill="url(#skinB)"/>
        
        {/* Four fingers together, slightly curved at top */}
        {/* Index */}
        <path d="M 25 85 L 22 25 Q 22 15 27 15 Q 32 15 32 25 L 35 75" fill="url(#skinB)"/>
        <ellipse cx="27" cy="15" rx="5" ry="6" fill="url(#skinB)"/>
        
        {/* Middle */}
        <path d="M 38 80 L 37 18 Q 37 8 43 8 Q 49 8 49 18 L 50 70" fill="url(#skinB)"/>
        <ellipse cx="43" cy="8" rx="6" ry="7" fill="url(#skinB)"/>
        
        {/* Ring */}
        <path d="M 53 75 L 55 22 Q 55 12 61 12 Q 67 12 67 22 L 67 70" fill="url(#skinB)"/>
        <ellipse cx="61" cy="12" rx="6" ry="7" fill="url(#skinB)"/>
        
        {/* Pinky */}
        <path d="M 70 78 L 73 35 Q 73 25 78 25 Q 83 25 83 35 L 82 75" fill="url(#skinB)"/>
        <ellipse cx="78" cy="25" rx="5" ry="6" fill="url(#skinB)"/>
        
        {/* Thumb - bent across palm, touching middle finger area */}
        <path d="M 15 95 Q 5 85 8 70 Q 12 55 25 50 Q 35 47 40 55" fill="url(#skinB)"/>
        <ellipse cx="38" cy="55" rx="8" ry="10" fill="url(#skinB)"/>
      </g>
      
      <text x="75" y="170" fill="#8B5CF6" fontSize="28" fontWeight="bold" textAnchor="middle">B</text>
    </svg>
  );

  // ISL Letter C - Curved hand forming C shape
  const ISL_C = () => (
    <svg viewBox="0 0 150 180" className="w-full h-full">
      <defs>
        <linearGradient id="skinC" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914"/>
          <stop offset="50%" stopColor="#6B4F12"/>
          <stop offset="100%" stopColor="#5A4210"/>
        </linearGradient>
      </defs>
      
      <g transform="translate(25, 10)">
        {/* C-shaped hand - curved fingers and thumb forming C */}
        
        {/* Main curved palm/hand forming C */}
        <path d="M 30 130 
                 Q 10 110 10 80 
                 Q 10 50 25 30 
                 Q 40 15 55 15
                 Q 65 15 70 25
                 L 72 35
                 Q 75 45 70 50
                 Q 60 45 50 45
                 Q 35 50 30 70
                 Q 28 90 35 110
                 Q 45 125 55 125
                 Q 65 122 70 115
                 L 75 105
                 Q 80 95 85 100
                 Q 90 110 85 125
                 Q 75 145 50 145
                 Q 35 145 30 130" 
              fill="url(#skinC)" stroke="#5A4210" strokeWidth="1"/>
        
        {/* Thumb - top of C */}
        <path d="M 55 15 Q 70 10 80 20 Q 90 30 85 45 Q 80 55 70 50" fill="url(#skinC)"/>
        <ellipse cx="82" cy="28" rx="10" ry="12" fill="url(#skinC)"/>
        
        {/* Curved fingers - bottom of C */}
        <ellipse cx="80" cy="108" rx="10" ry="14" fill="url(#skinC)"/>
        
        {/* Finger details */}
        <path d="M 70 50 Q 85 55 90 70 Q 92 85 88 100" fill="none" stroke="#5A4210" strokeWidth="1" opacity="0.5"/>
      </g>
      
      <text x="75" y="170" fill="#EC4899" fontSize="28" fontWeight="bold" textAnchor="middle">C</text>
    </svg>
  );

  const HandAnimation = ({ step }) => {
    const animations = {
      0: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="skin0" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B6914"/><stop offset="100%" stopColor="#5A4210"/>
            </linearGradient>
          </defs>
          <rect x="60" y="25" width="80" height="55" rx="8" fill="#1F2937"/>
          <circle cx="100" cy="48" r="16" fill="#111827"/>
          <circle cx="100" cy="48" r="10" fill="#3B82F6"/>
          <circle cx="104" cy="44" r="3" fill="white" opacity="0.6"/>
          <rect x="128" y="32" width="8" height="8" rx="2" fill="#EF4444">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
          </rect>
          <g transform={`translate(${82 + handFrame * 4}, 95) rotate(${-15 + handFrame * 8})`}>
            <ellipse cx="18" cy="45" rx="20" ry="25" fill="url(#skin0)"/>
            <rect x="8" y="5" width="7" height="30" rx="3.5" fill="url(#skin0)"/>
            <rect x="17" y="0" width="7" height="35" rx="3.5" fill="url(#skin0)"/>
            <rect x="26" y="2" width="7" height="33" rx="3.5" fill="url(#skin0)"/>
            <rect x="35" y="8" width="6" height="27" rx="3" fill="url(#skin0)"/>
            <rect x="-2" y="28" width="7" height="20" rx="3.5" fill="url(#skin0)" transform="rotate(-40 0 28)"/>
          </g>
          <text x="100" y="190" fill="#22C55E" fontSize="14" fontWeight="bold" textAnchor="middle">Position your hands</text>
        </svg>
      ),
      1: (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          <div className="flex gap-2 mb-2">
            <span className={`text-lg font-bold px-2 py-1 rounded ${handFrame === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>A</span>
            <span className={`text-lg font-bold px-2 py-1 rounded ${handFrame === 1 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'}`}>B</span>
            <span className={`text-lg font-bold px-2 py-1 rounded ${handFrame === 2 || handFrame === 3 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>C</span>
          </div>
          <div className="w-40 h-44 bg-gray-900 rounded-xl p-3 flex items-center justify-center border-4 border-green-500">
            {handFrame === 0 && <ISL_A />}
            {handFrame === 1 && <ISL_B />}
            {(handFrame === 2 || handFrame === 3) && <ISL_C />}
          </div>
          <div className="mt-2 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full animate-pulse">
            ✓ Detected
          </div>
        </div>
      ),
      2: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="15" y="25" width="170" height="45" rx="8" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2"/>
          <rect x="25" y="35" width="30" height="25" rx="5" fill="#3B82F6" opacity={handFrame >= 0 ? 1 : 0.2}/>
          <text x="40" y="53" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" opacity={handFrame >= 0 ? 1 : 0}>H</text>
          <rect x="60" y="35" width="30" height="25" rx="5" fill="#8B5CF6" opacity={handFrame >= 1 ? 1 : 0.2}/>
          <text x="75" y="53" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" opacity={handFrame >= 1 ? 1 : 0}>E</text>
          <rect x="95" y="35" width="30" height="25" rx="5" fill="#EC4899" opacity={handFrame >= 2 ? 1 : 0.2}/>
          <text x="110" y="53" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" opacity={handFrame >= 2 ? 1 : 0}>L</text>
          <rect x="130" y="35" width="30" height="25" rx="5" fill="#F59E0B" opacity={handFrame >= 3 ? 1 : 0.2}/>
          <text x="145" y="53" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" opacity={handFrame >= 3 ? 1 : 0}>P</text>
          <g transform="translate(65, 90)">
            <rect x="0" y={handFrame % 2 === 0 ? 0 : 4} width="70" height="35" rx="8" fill="#3B82F6"/>
            <text x="35" y="24" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">+ Add</text>
          </g>
          <text x="100" y="180" fill="#6B7280" fontSize="12" textAnchor="middle">Click to add each letter</text>
        </svg>
      ),
      3: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(55, 30)">
            <rect x="0" y="20" width="30" height="35" rx="5" fill="#F59E0B"/>
            <polygon points="30,20 60,0 60,75 30,55" fill="#F59E0B"/>
            <path d="M 70 20 Q 90 37 70 55" fill="none" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" opacity={handFrame >= 1 ? 1 : 0.3}>
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite"/>
            </path>
            <path d="M 82 8 Q 110 37 82 67" fill="none" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" opacity={handFrame >= 2 ? 1 : 0.3}>
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" begin="0.2s"/>
            </path>
          </g>
          <g transform="translate(20, 115)">
            <rect x="0" y="0" width="160" height="40" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
            <text x="80" y="27" fill="#92400E" fontSize="18" fontWeight="bold" textAnchor="middle">"HELLO"</text>
          </g>
          <text x="100" y="185" fill="#F59E0B" fontSize="12" fontWeight="bold" textAnchor="middle">🔊 Text-to-Speech</text>
        </svg>
      ),
      4: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="50" r="35" fill="#0D9488" opacity="0.2"/>
          <circle cx="100" cy="50" r="35" fill="none" stroke="#0D9488" strokeWidth="2"/>
          <ellipse cx="100" cy="50" rx="35" ry="12" fill="none" stroke="#0D9488" strokeWidth="1.5"/>
          <ellipse cx="100" cy="50" rx="12" ry="35" fill="none" stroke="#0D9488" strokeWidth="1.5"/>
          <rect x="25" y="100" width="70" height="30" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2"/>
          <text x="60" y="120" fill="#1E40AF" fontSize="12" fontWeight="bold" textAnchor="middle">HELLO</text>
          <path d="M 100 115 L 100 135" stroke="#6B7280" strokeWidth="2"/>
          <polygon points="100,140 95,132 105,132" fill="#6B7280">
            <animateTransform attributeName="transform" type="translate" values="0,0;0,5;0,0" dur="1s" repeatCount="indefinite"/>
          </polygon>
          <rect x="25" y="148" width="150" height="35" rx="6" fill="#F0FDF4" stroke="#22C55E" strokeWidth="2"/>
          <text x="100" y="172" fill="#166534" fontSize="16" fontWeight="bold" textAnchor="middle">
            {handFrame === 0 && "नमस्ते"}
            {handFrame === 1 && "வணக்கம்"}
            {handFrame === 2 && "నమస్కారం"}
            {handFrame === 3 && "নমস্কার"}
          </text>
          <text x="165" y="158" fill="#6B7280" fontSize="8">
            {handFrame === 0 && "Hindi"}
            {handFrame === 1 && "Tamil"}
            {handFrame === 2 && "Telugu"}
            {handFrame === 3 && "Bengali"}
          </text>
        </svg>
      )
    };
    return animations[step] || animations[0];
  };

  // ISL Alphabet Reference Component
  const ISLAlphabetPreview = () => (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="bg-gray-900 rounded-xl p-3 aspect-square flex items-center justify-center">
        <ISL_A />
      </div>
      <div className="bg-gray-900 rounded-xl p-3 aspect-square flex items-center justify-center">
        <ISL_B />
      </div>
      <div className="bg-gray-900 rounded-xl p-3 aspect-square flex items-center justify-center">
        <ISL_C />
      </div>
    </div>
  );

  const handleStartDetection = () => {
    navigate('/detection');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="text-center mb-6 relative">
          <button
            onClick={handleGoHome}
            className="absolute left-0 top-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            How to Use <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SignMate</span>
          </h1>
          <p className="text-md text-purple-200">Learn Indian Sign Language detection in 5 simple steps</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl mb-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className={`${steps[activeStep].bgColor} rounded-xl p-4 border-2 ${steps[activeStep].borderColor} aspect-square flex items-center justify-center`}>
              <div className="w-full h-full">
                <HandAnimation step={activeStep} />
              </div>
            </div>

            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center text-2xl shadow-lg`}>
                  {steps[activeStep].icon}
                </div>
                <div>
                  <span className="text-purple-300 text-sm font-medium">Step {activeStep + 1} of 5</span>
                  <h2 className="text-xl md:text-2xl font-bold">{steps[activeStep].title}</h2>
                </div>
              </div>
              
              <p className="text-lg text-purple-200 mb-2">{steps[activeStep].subtitle}</p>
              <p className="text-purple-300 text-md leading-relaxed mb-4">{steps[activeStep].description}</p>

              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div className={`h-2 rounded-full bg-gradient-to-r ${steps[activeStep].color} transition-all duration-500`} style={{ width: `${((activeStep + 1) / 5) * 100}%` }}/>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => setActiveStep((prev) => (prev - 1 + 5) % 5)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all">← Prev</button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all">{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
                <button onClick={() => setActiveStep((prev) => (prev + 1) % 5)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all">Next →</button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {steps.map((step, index) => (
            <button key={step.id} onClick={() => { setActiveStep(index); setIsPlaying(false); }}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${activeStep === index ? `${step.bgColor} ${step.borderColor} scale-105 shadow-lg` : 'bg-white/10 border-white/20 hover:bg-white/20'}`}>
              <div className={`text-xl mb-1 ${activeStep === index ? '' : 'grayscale opacity-60'}`}>{step.icon}</div>
              <div className={`text-xs font-bold ${activeStep === index ? 'text-gray-800' : 'text-white'}`}>{step.title}</div>
            </button>
          ))}
        </div>

        {/* ISL Alphabet Reference */}
        <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🤟</span> ISL Alphabet Reference (A, B, C)
          </h3>
          <p className="text-purple-300 text-sm mb-3">These are the accurate Indian Sign Language hand shapes</p>
          <ISLAlphabetPreview />
        </div>

        <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-3">💡 Quick Tips</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xl mb-1">☀️</div>
              <h4 className="font-semibold text-white text-sm">Good Lighting</h4>
              <p className="text-xs text-purple-300">Well-lit hands for accurate detection</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xl mb-1">🎯</div>
              <h4 className="font-semibold text-white text-sm">Center Frame</h4>
              <p className="text-xs text-purple-300">Keep hands centered in view</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xl mb-1">🐢</div>
              <h4 className="font-semibold text-white text-sm">Hold Steady</h4>
              <p className="text-xs text-purple-300">Hold signs for 1-2 seconds</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button 
              onClick={handleGoHome}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-md rounded-xl shadow-lg hover:scale-105 transition-all border-2 border-white/30 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🏠</span>
              Back to Home
            </button>
            <button 
              onClick={handleStartDetection}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-black text-md rounded-xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">🚀</span>
              Start Detection
            </button>
          </div>
          <p className="text-purple-200 text-xs mt-3">
            Ready to try it yourself? Start detecting signs or return to the home page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignMateTutorial;