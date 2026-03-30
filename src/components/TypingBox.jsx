import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingBox = ({ words, userInput, setUserInput, onStart, onAppend, soundEnabled }) => {
  const inputRef = useRef(null);
  const audioCtx = useRef(null);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const scrollRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [firstLineTop, setFirstLineTop] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const lastWords = useRef(words);

  const paddingTop = 48;

  // Reset scroll whenever words change (new test)
  useEffect(() => {
    const isAppend = words.startsWith(lastWords.current) && lastWords.current.length > 0;
    
    if (!isAppend) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      setHasStarted(false);
      setLineHeight(0);
      setFirstLineTop(0);
    }
    lastWords.current = words;
  }, [words]);

  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    window.addEventListener('focus', focus);
    window.addEventListener('click', focus);
    window.addEventListener('keydown', focus);

    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };
    window.addEventListener('mousedown', initAudio);

    focus();

    return () => {
      window.removeEventListener('focus', focus);
      window.removeEventListener('click', focus);
      window.removeEventListener('keydown', focus);
      window.removeEventListener('mousedown', initAudio);
    };
  }, []);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const allChars = container.querySelectorAll('.char-unit');
    const activeChar = container.querySelector('.char-active');
    
    // 1. Calculate line height correctly if not yet set
    if (allChars.length > 0 && lineHeight === 0) {
      const firstTop = allChars[0].offsetTop;
      setFirstLineTop(firstTop);
      let secondTop = 0;
      for (let i = 1; i < allChars.length; i++) {
        if (allChars[i].offsetTop > firstTop) {
          secondTop = allChars[i].offsetTop;
          break;
        }
      }
      if (secondTop > 0) {
        setLineHeight(secondTop - firstTop);
      }
    }

    // 2. Handle Scrolling
    if (activeChar) {
      const charTop = activeChar.offsetTop;
      const charHeight = activeChar.offsetHeight || 40;
      const charLeft = activeChar.offsetLeft;

      setCursorPos({
        top: charTop,
        left: charLeft,
        width: activeChar.offsetWidth,
        height: charHeight
      });

      // Only scroll if we have started typing and lineHeight is known
      if (hasStarted && userInput.length > 0 && lineHeight > 0) {
        // threshold: only scroll if the active character is below the 2nd line
        const threshold = firstLineTop + lineHeight;
        
        if (charTop > threshold) {
          container.scrollTo({
            top: charTop - threshold,
            behavior: 'smooth'
          });
        }
      } 
    }

    if (userInput.length > words.length * 0.8) {
      onAppend();
    }
  }, [userInput, words, onAppend, hasStarted, lineHeight, firstLineTop]);

  const playClick = () => {
    if (!soundEnabled || !audioCtx.current) return;
    try {
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.frequency.setValueAtTime(300 + (Math.random() * 200), audioCtx.current.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.05);
      osc.connect(gain); 
      gain.connect(audioCtx.current.destination);
      osc.start(); 
      osc.stop(audioCtx.current.currentTime + 0.05);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length - userInput.length > 15) return;

    if (!hasStarted && value.length === 1) {
      onStart();
      setHasStarted(true);
    }

    if (value.length > userInput.length) playClick();
    setUserInput(value);
  };

  const getCharStatus = (index) => {
    if (index === userInput.length) return 'char-active';
    if (index > userInput.length) return 'char-untyped';
    return userInput[index] === words[index] ? 'char-correct' : 'char-wrong';
  };

  return (
    <div 
      ref={scrollRef}
      className="phantom-viewport mx-auto group cursor-text relative bg-card border-border/50"
      style={{ minHeight: '250px', maxHeight: '320px', overflowY: 'auto', scrollBehavior: 'smooth' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        className="w-full px-12 flex flex-wrap gap-x-[0.2em] gap-y-6 md:gap-y-8 text-3xl md:text-5xl tracking-tight leading-normal typing-font font-medium relative text-left"
        style={{ paddingTop: `${paddingTop}px`, paddingBottom: '150px' }}
      >
        {/* FIX: Input is now small and moves with cursor to prevent browser jump-scrolling */}
        <input
          ref={inputRef}
          type="text"
          style={{ 
            position: 'absolute', 
            top: cursorPos.top, 
            left: cursorPos.left, 
            opacity: 0, 
            width: '10px', 
            zIndex: -1 
          }}
          value={userInput}
          onChange={handleChange}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        />

        <motion.div 
          animate={{ 
            x: cursorPos.left, 
            y: cursorPos.top,
            height: cursorPos.height || 40
          }}
          transition={{ type: "spring", damping: 35, stiffness: 450, mass: 0.4 }}
          className="absolute top-0 left-0 w-[3px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20"
          style={{ 
            display: userInput.length >= words.length ? 'none' : 'block',
            animation: 'blink 1s step-end infinite'
          }}
        />

        {words.split('').map((char, index) => (
          <span 
            key={index} 
            className={`char-unit relative z-10 transition-colors duration-150 ${getCharStatus(index)}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {!hasStarted && (
           <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center group-focus-within:opacity-0 transition-all duration-500 pointer-events-none z-50">
              <div className="flex flex-col items-center gap-6">
                 <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                 <span className="text-sm font-black uppercase tracking-[0.5em] text-indigo-500 animate-pulse">Type to Start</span>
              </div>
           </div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        .char-correct { color: #10b981 !important; text-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
        .char-wrong { color: #f43f5e !important; background: rgba(244, 63, 94, 0.15); border-radius: 4px; }
        .char-untyped { color: rgba(156, 163, 175, 0.25); }
        .char-active { color: #6366f1 !important; }
        .phantom-viewport::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default TypingBox;