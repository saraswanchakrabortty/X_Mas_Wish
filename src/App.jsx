import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // Poem paragraphs
  const poemParagraphs = [
    "This Christmas",
    "I bring no vows wrapped in shine,\nno loud promises meant to sound divine.\nI bring you the quieter truth of me—\nthe parts that only breathe\nwhen you're near.",
    "I've learned to pause,\nto soften my words before they fall,\nbecause loving you taught me\nthat how we speak\nmatters as much as what we say.",
    "I know my storms still rise,\nand my white flag doesn't always look like peace—\nsometimes it's silence,\nsometimes space.\nBut believe me,\nit's always been for you.",
    "This Christmas,\nI choose you again—\nnot perfect, not polished,\njust real.\nI choose how you calm my edges,\nhow your anger carries care,\nhow your love stays\neven when you're tired.",
    "I don't want to win.\nI don't want to be right.\nI just want to understand you\nwithout turning your fears into fights.",
    "So if the world feels heavy tonight,\ncome rest here.\nNo storms. No distance.\nJust two hearts\nlearning—slowly—\nhow to listen.",
    "Merry Christmas, my love.\nNo!! Sorry My Sreyashi\nI'm still here.\nStill choosing you.\nStill learning how to love you better.",
    "I'm here...Your Abubuuu!!"
  ];

  // State management
  const [currentIndex, setCurrentIndex] = useState(-2);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  
  // Audio ref
  const audioRef = useRef(null);
  
  // Animation speeds (original speeds)
  const typingSpeed = 40;
  const pauseBetweenParagraphs = 1200;
  
  // Refs
  const typingTimeoutRef = useRef(null);
  const introTimeoutRef = useRef(null);

  // Initialize audio on component mount
  useEffect(() => {
    try {
      // Audio file is in public/audio/ folder
      audioRef.current = new Audio('/audio/audio1.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
      audioRef.current.preload = 'auto';
      
      console.log('Audio initialized from public folder');
      
    } catch (error) {
      console.error("Audio setup error:", error);
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Function to start audio
  const startAudio = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.play()
        .then(() => {
          console.log('Audio started successfully');
          setAudioStarted(true);
        })
        .catch(error => {
          console.error("Failed to start audio:", error);
          // Try alternative audio if first fails
          audioRef.current.src = '/audio/audio2.mp3';
          audioRef.current.play()
            .then(() => {
              setAudioStarted(true);
            })
            .catch(e => {
              console.error("Alternative audio also failed:", e);
            });
        });
    }
  };

  // Handle intro animation sequence
  useEffect(() => {
    if (showIntro) {
      switch (introPhase) {
        case 0: // Show big X
          introTimeoutRef.current = setTimeout(() => {
            setIntroPhase(1);
          }, 1200);
          break;
        case 1: // Show mas
          introTimeoutRef.current = setTimeout(() => {
            setIntroPhase(2);
          }, 1000);
          break;
        case 2: // Show coding animation
          introTimeoutRef.current = setTimeout(() => {
            setIntroPhase(3);
          }, 2000);
          break;
        case 3: // Transition to main content
          introTimeoutRef.current = setTimeout(() => {
            setShowIntro(false);
            setCurrentIndex(0);
          }, 800);
          break;
      }
    }

    return () => {
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
      }
    };
  }, [showIntro, introPhase]);

  // Typing effect logic
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= poemParagraphs.length) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const currentParagraph = poemParagraphs[currentIndex];
    const shouldType = currentIndex === 0 || currentIndex === 7;
    
    if (shouldType && currentParagraph && currentIndex !== poemParagraphs.length - 1) {
      setIsTyping(true);
      setDisplayText('');
      setIsTransitioning(false);
      
      let charIndex = 0;
      
      const typeCharacter = () => {
        if (charIndex < currentParagraph.length) {
          setDisplayText(currentParagraph.substring(0, charIndex + 1));
          charIndex++;
          typingTimeoutRef.current = setTimeout(typeCharacter, typingSpeed);
        } else {
          setIsTyping(false);
          typingTimeoutRef.current = setTimeout(() => {
            setShowContinue(true);
            if (currentIndex === poemParagraphs.length - 2) {
              setShowResetButton(true);
            }
          }, pauseBetweenParagraphs);
        }
      };
      
      typingTimeoutRef.current = setTimeout(typeCharacter, typingSpeed);
    } else {
      // Fade in effect for non-typing paragraphs
      setIsTransitioning(true);
      setDisplayText('');
      
      setTimeout(() => {
        setDisplayText(currentParagraph);
        setIsTransitioning(false);
        setShowContinue(true);
        
        if (currentIndex === poemParagraphs.length - 1) {
          setShowResetButton(true);
        }
      }, 500);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentIndex]);

  // Handle next button click
  const handleNext = () => {
    if (currentIndex < poemParagraphs.length - 1) {
      // Start audio on FIRST Continue click only
      if (currentIndex === 0 && !audioStarted) {
        startAudio();
      }
      
      setShowContinue(false);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500);
    }
  };

  // Handle reset
  const handleReset = () => {
    setShowIntro(true);
    setIntroPhase(0);
    setCurrentIndex(-2);
    setDisplayText('');
    setIsTyping(false);
    setShowContinue(false);
    setShowResetButton(false);
    setIsTransitioning(false);
    setAudioStarted(false);
    
    // Stop and reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // Reset to first audio
      audioRef.current.src = '/audio/audio1.mp3';
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Render intro animation
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center overflow-hidden px-4">
        {/* Particle background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-red-500/20 to-green-500/20 animate-pulse"
              style={{
                width: `${Math.random() * 8 + 3}px`,
                height: `${Math.random() * 8 + 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center w-full max-w-4xl">
          {/* Big X animation */}
          {introPhase === 0 && (
            <div className="animate-zoomInFadeOut">
              <div className="text-[200px] sm:text-[300px] md:text-[400px] font-black bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent leading-none">
                X
              </div>
            </div>
          )}

          {/* mas text animation */}
          {introPhase === 1 && (
            <div className="animate-slideIn">
              <div className="text-6xl sm:text-8xl md:text-9xl font-black bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-none">
                mas
              </div>
            </div>
          )}

          {/* Coding animation */}
          {introPhase === 2 && (
            <div className="animate-fadeInUp">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-8">
                  &lt;coding_emotions/&gt;
                </div>
                
                {/* Code terminal animation - responsive */}
                <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 max-w-full sm:max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    <div className="text-gray-400 text-xs sm:text-sm ml-2 sm:ml-4">terminal</div>
                  </div>
                  
                  <div className="font-mono text-left text-green-400 space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <div className="animate-typing">$ npm install love</div>
                    <div className="animate-typing" style={{animationDelay: '0.5s'}}>✓ Installed forever...</div>
                    <div className="animate-typing" style={{animationDelay: '1s'}}>$ echo "Christmas with You"</div>
                    <div className="animate-typing" style={{animationDelay: '1.5s'}}>🎄 Loading emotions... 100%</div>
                    <div className="animate-typing" style={{animationDelay: '2s'}}>✨ Experience ready</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-48 sm:w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto mt-4 sm:mt-8">
                  <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 animate-progress"></div>
                </div>
              </div>
            </div>
          )}

          {/* Transition text */}
          {introPhase === 3 && (
            <div className="animate-fadeIn">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Begin Your Journey
              </div>
            </div>
          )}
        </div>

        {/* Inline styles for animations */}
        <style jsx>{`
          @keyframes zoomInFadeOut {
            0% {
              transform: scale(0.1) rotate(-180deg);
              opacity: 0;
            }
            20% {
              transform: scale(1.2) rotate(0deg);
              opacity: 1;
            }
            80% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          
          @keyframes slideIn {
            0% {
              transform: translateY(100px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeInUp {
            0% {
              transform: translateY(30px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes typing {
            0% { width: 0; opacity: 0; }
            50% { opacity: 1; }
            100% { width: 100%; opacity: 1; }
          }
          
          @keyframes progress {
            0% { width: 0; }
            100% { width: 100%; }
          }
          
          .animate-zoomInFadeOut {
            animation: zoomInFadeOut 1.2s ease-out forwards;
          }
          
          .animate-slideIn {
            animation: slideIn 0.8s ease-out forwards;
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 1s ease-out forwards;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-typing {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 1.5s steps(40, end) forwards;
            opacity: 0;
          }
          
          .animate-progress {
            animation: progress 2s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Floating snowflakes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              fontSize: `${Math.random() * 12 + 10}px`,
            }}
          >
            ❄
          </div>
        ))}
        
        {/* Gradient orbs - responsive sizes */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-r from-red-500/10 to-transparent rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-l from-green-500/10 to-transparent rounded-full blur-2xl md:blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto min-h-screen flex flex-col p-3 sm:p-4 md:p-8">
        {/* Header - responsive */}
        <header className="py-4 sm:py-6 flex justify-between items-center px-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent">
              Christmas &lt;3
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-mono hidden xs:block">
              #{currentIndex + 1}/{poemParagraphs.length}
            </div>
          </div>
          
          {/* Music indicator */}
          <div className="p-2 sm:p-3 rounded-full bg-gray-800/50 backdrop-blur-sm">
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                audioStarted 
                  ? 'bg-gradient-to-r from-green-400 to-blue-400 animate-pulseAudio' 
                  : 'bg-gradient-to-r from-red-400 to-pink-400'
              }`}></div>
            </div>
          </div>
        </header>

        {/* Main content - responsive */}
        <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-8 sm:py-12 md:py-20">
          <div className="w-full max-w-2xl">
            {/* Poem container - responsive */}
            <div className={`relative bg-gray-900/30 backdrop-blur-lg sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-6 md:p-8 lg:p-12 mb-8 sm:mb-12 transition-all duration-500 ${
              isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            } ${currentIndex === 0 ? 'animate-cardEntrance' : 'animate-cardFloat'}`}>
              {/* Decorative elements - responsive */}
              <div className="absolute -top-2 -left-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
              
              <div className="relative z-10">
                {/* Text display - responsive */}
                <div className={`text-center transition-all duration-500 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  <div className={`font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-loose whitespace-pre-line ${
                    (currentIndex === 0 || currentIndex === 7) && currentIndex !== poemParagraphs.length - 1
                      ? 'font-light tracking-wide sm:tracking-wider' 
                      : 'font-normal'
                  } ${
                    isTyping ? 'animate-pulseCursor' : ''
                  }`}>
                    {displayText}
                    
                    {/* Typing cursor - responsive */}
                    {(currentIndex === 0 || currentIndex === 7) && isTyping && (
                      <span className="inline-block w-[2px] sm:w-[3px] h-[1.2em] bg-gradient-to-b from-red-400 to-pink-400 ml-0.5 sm:ml-1 align-middle animate-blink"></span>
                    )}
                  </div>
                  
                  {/* Final message special treatment - responsive */}
                  {currentIndex === poemParagraphs.length - 1 && (
                    <div className="mt-8 sm:mt-12 animate-heartbeat">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                        {displayText}
                      </div>
                      <div className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-400">
                        forever & always
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress dots - responsive spacing */}
              <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mt-6 sm:mt-8">
                {poemParagraphs.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${
                      idx === currentIndex
                        ? 'w-6 sm:w-8 md:w-10 bg-gradient-to-r from-red-500 to-pink-500'
                        : idx < currentIndex
                        ? 'bg-green-500/70'
                        : 'bg-gray-600/30'
                    } ${idx === currentIndex ? 'animate-pulseDot' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Continue button - responsive */}
            {showContinue && currentIndex < poemParagraphs.length - 1 && (
              <div className={`text-center transition-all duration-500 ${
                showContinue ? 'animate-buttonEntrance' : 'opacity-0'
              }`}>
                <button
                  onClick={handleNext}
                  className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg sm:backdrop-blur-xl border border-gray-700/50 rounded-xl sm:rounded-2xl text-gray-200 hover:text-white transition-all duration-300 hover:scale-105 hover:border-gray-600/50 focus:outline-none w-full max-w-xs sm:max-w-sm mx-auto"
                  disabled={isTransitioning}
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-light tracking-wide">
                    {isTransitioning ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                      </span>
                    ) : (
                      <>
                        {currentIndex === 0 ? '🎵 Start Journey' : 'Continue Journey'}
                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                          →
                        </span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 transition-opacity duration-300">
                  {isTransitioning ? 'Transitioning...' : 'Tap to continue'}
                  {currentIndex === 0 && !audioStarted && (
                    <span className="block mt-1 text-xs text-green-400">
                      Music will start playing
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Reset button - responsive */}
            {showResetButton && currentIndex === poemParagraphs.length - 1 && (
              <div className="text-center animate-buttonEntrance">
                <button
                  onClick={handleReset}
                  className="group px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-red-500/20 to-green-500/20 backdrop-blur-lg sm:backdrop-blur-xl border border-gray-700/30 rounded-xl sm:rounded-2xl text-white hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none w-full max-w-xs sm:max-w-sm mx-auto"
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-light tracking-wide">
                    Start Again
                    <span className="group-hover:rotate-180 transition-transform duration-500">
                      ↻
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer - responsive */}
        <footer className="py-4 sm:py-6 text-center px-2">
          <div className="text-gray-500/50 text-xs sm:text-sm font-light tracking-wide">
            {currentIndex === 0 
              ? 'A message from the heart' 
              : currentIndex === poemParagraphs.length - 1
              ? 'Made with ❤️ for Sreyashi'
              : 'Keep going...'
            }
          </div>
        </footer>
      </div>

      {/* Inline styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-80px) rotate(180deg);
          }
        }
        
        @keyframes pulseCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(1); }
          75% { transform: scale(1.03); }
        }
        
        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes buttonEntrance {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulseAudio {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }
        
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-pulseCursor {
          position: relative;
        }
        
        .animate-pulseCursor::after {
          content: '';
          position: absolute;
          right: -2px;
          top: 0;
          height: 100%;
          width: 2px;
          background: linear-gradient(to bottom, #ef4444, #ec4899);
          animation: blink 1s infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }
        
        .animate-cardEntrance {
          animation: cardEntrance 0.8s ease-out forwards;
        }
        
        .animate-cardFloat {
          animation: cardFloat 6s ease-in-out infinite;
        }
        
        .animate-buttonEntrance {
          animation: buttonEntrance 0.6s ease-out forwards;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-pulseAudio {
          animation: pulseAudio 2s ease-in-out infinite;
        }
        
        .animate-pulseDot {
          animation: pulseDot 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;