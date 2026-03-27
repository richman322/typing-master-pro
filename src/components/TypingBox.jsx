import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingBox = ({ words, userInput, setUserInput, onStart, onAppend, soundEnabled, isRTL, lang }) => {
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const audioCtx = useRef(null);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const lastOffsetTop = useRef(0);

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

  useEffect(() => {
    const activeChar = scrollRef.current?.querySelector('.cursor-trigger');
    const container = scrollRef.current;
    
    if (activeChar && container) {
      const charTop = activeChar.offsetTop;
      const charHeight = activeChar.offsetHeight || 40;
      
      setCursorPos({
        top: charTop,
        left: activeChar.offsetLeft,
        width: activeChar.offsetWidth,
        height: charHeight
      });

      // VIRTUAL WINDOW SCROLLING
      // We want the current line to stay at a fixed relative position.
      if (charTop !== lastOffsetTop.current) {
        const container = scrollRef.current;

        // Detect line change ONLY
        if (charTop > lastOffsetTop.current) {
          const lineHeight = activeChar.offsetHeight + 8; // adjust gap if needed

          container.scrollTo({
            top: container.scrollTop + lineHeight,
            behavior: 'smooth'
          });
        }

        lastOffsetTop.current = charTop;
      }
    }
    
    if (userInput.length > words.length * 0.8) {
      onAppend();
    }
  }, [userInput, words, onAppend]);

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

    if (userInput.length === 0 && value.length === 1) onStart();
    if (value.length > userInput.length) playClick();
    setUserInput(value);
  };

  const getCharStatus = (index) => {
    if (index === userInput.length) return 'cursor-trigger char-active';
    if (index > userInput.length) return 'char-untyped';
    return userInput[index] === words[index] ? 'char-correct' : 'char-wrong';
  };

  const getFontClass = () => {
    if (lang === 'urdu') return 'urdu-font';
    if (lang === 'arabic') return 'arabic-font';
    return 'typing-font font-medium';
  };

  return (
    <div 
      className={`phantom-viewport mx-auto group cursor-text relative overflow-hidden h-[250px] md:h-[300px] flex items-center justify-center bg-card/50 backdrop-blur-sm border-border/50`}
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        ref={scrollRef}
        className={`w-full h-full p-8 md:p-12 flex flex-wrap gap-x-[0.2em] gap-y-4 md:gap-y-6 text-2xl md:text-4xl tracking-tight leading-relaxed scroll-smooth overflow-y-hidden relative ${getFontClass()} ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 opacity-0 cursor-default z-0"
          value={userInput}
          onChange={handleChange}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        />

        {/* Dynamic Cursor */}
        <motion.div 
          animate={{ 
            x: isRTL ? -cursorPos.left : cursorPos.left, 
            y: cursorPos.top,
            height: cursorPos.height || 40
          }}
          transition={{ type: "spring", damping: 35, stiffness: 450, mass: 0.4 }}
          className={`absolute top-0 w-[2px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20 ${isRTL ? 'right-0' : 'left-0'}`}
          style={{ 
            display: userInput.length >= words.length ? 'none' : 'block',
            animation: 'blink 1s step-end infinite'
          }}
        />

        {words.split('').map((char, index) => (
          <span 
            key={index} 
            className={`relative z-10 transition-colors duration-150 ${getCharStatus(index)}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Focus Overlay */}
      <AnimatePresence>
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-focus-within:pointer-events-none group-focus-within:opacity-0 transition-all duration-300 pointer-events-none">
           <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-sm font-black uppercase tracking-[0.4em] text-indigo-500">Click to Focus</span>
           </div>
        </div>
      </AnimatePresence>
      
      <style jsx>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        .char-correct { color: #10b981 !important; }
        .char-wrong { color: #f43f5e !important; background: rgba(244, 63, 94, 0.1); border-radius: 2px; }
        .char-untyped { color: rgba(156, 163, 175, 0.3); }
        .char-active { color: #6366f1 !important; background: rgba(99, 102, 241, 0.1); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default TypingBox;
