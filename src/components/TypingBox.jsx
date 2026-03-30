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
  const [isPaused, setIsPaused] = useState(false);
  const [dynamicPadding, setDynamicPadding] = useState(48);
  const lastScrolledCharTop = useRef(-1);
  const lastWords = useRef(words);
  const localStartTime = useRef(null);

  // Reset scroll & typing flag whenever words change (unless it's just an append)
  useEffect(() => {
    const isAppend = words.startsWith(lastWords.current) && lastWords.current.length > 0;
    
    if (!isAppend) {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setHasStarted(false);
      setLineHeight(0);
      setFirstLineTop(0);
      lastScrolledCharTop.current = -1;
      localStartTime.current = null;
    }
    lastWords.current = words;
  }, [words]);

  // Mobile UX: Reduce padding for smaller viewports
  useEffect(() => {
    const handleResize = () => {
      setDynamicPadding(window.innerHeight < 700 ? 24 : 48);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Focus System & Global Events
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    window.addEventListener('focus', focus);
    window.addEventListener('click', focus);
    window.addEventListener('keydown', focus);

    const handleBlur = () => { if (hasStarted) setIsPaused(true); };
    const handleFocus = () => { setIsPaused(false); };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

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
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('mousedown', initAudio);
    };
  }, [hasStarted]);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const allChars = container.querySelectorAll('span');
    const activeChar = container.querySelector('.char-active');
    
    if (allChars && allChars.length > 0 && lineHeight === 0) {
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

      // Threshold-based scrolling (preserved 3-line logic)
      const threshold = firstLineTop + lineHeight;
      
      if (hasStarted && userInput.length > 0 && lineHeight > 0) {
        if (charTop > threshold) {
          container.scrollTo({
            top: charTop - threshold,
            behavior: 'smooth'
          });
        }
      } else {
        container.scrollTop = 0;
      }
    }

    if (userInput.length > words.length * 0.8) {
      onAppend();
    }
  }, [userInput, words, onAppend, hasStarted, lineHeight, firstLineTop]);

  // Live HUD Calculations
  const getLiveStats = () => {
    if (!hasStarted || userInput.length === 0) return { wpm: 0, acc: 100 };
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === words[i]) correct++;
    }
    const acc = Math.floor((correct / userInput.length) * 100);
    const elapsedMinutes = (Date.now() - (localStartTime.current || Date.now())) / 60000 || 0.001;
    const wpm = Math.floor((correct / 5) / elapsedMinutes);
    return { wpm, acc };
  };

  const stats = getLiveStats();

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
    if (isPaused) return;
    const value = e.target.value;
    if (value.length - userInput.length > 15) return;

    if (!hasStarted && value.length === 1) {
      onStart();
      setHasStarted(true);
      localStartTime.current = Date.now();
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
      style={{ minHeight: '250px', maxHeight: 'none', overflowY: 'auto' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Live HUD */}
      <div className="sticky top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1 rounded-full bg-background/40 backdrop-blur-md border border-border/50 flex gap-4 text-[10px] font-mono opacity-60 pointer-events-none">
        <span>WPM: {stats.wpm}</span>
        <span className="opacity-30">|</span>
        <span>ACC: {stats.acc}%</span>
      </div>

      <div 
        className="w-full px-12 flex flex-wrap gap-x-[0.2em] gap-y-6 md:gap-y-8 text-3xl md:text-5xl tracking-tight leading-normal typing-font font-medium relative text-left"
        style={{ paddingTop: `${dynamicPadding}px`, paddingBottom: '48px' }}
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

        <motion.div 
          animate={{ 
            x: cursorPos.left, 
            y: cursorPos.top,
            height: cursorPos.height || 40
          }}
          transition={{ type: "spring", damping: 60, stiffness: 1000, mass: 0.5 }}
          className="absolute top-0 left-0 w-[3px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20"
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

      <AnimatePresence>
        {(isPaused || !userInput.length) && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center transition-all duration-500 z-50">
             <div className="flex flex-col items-center gap-6">
                <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                <span className="text-sm font-black uppercase tracking-[0.5em] text-indigo-500 animate-pulse">
                  {isPaused ? 'Paused - Click to Resume' : 'Click to Focus'}
                </span>
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
        .char-active { color: #6366f1 !important; text-shadow: 0 0 8px rgba(99, 102, 241, 0.6); }
      `}</style>
    </div>
  );
};

export default TypingBox;