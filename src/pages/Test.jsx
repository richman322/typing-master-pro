import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { difficultyData } from '../data/sentences';
import TypingBox from '../components/TypingBox';
import StartModal from '../components/StartModal';
import { Zap, Target, Flame, RotateCcw, XCircle, Globe, Settings2, Volume2, VolumeX } from 'lucide-react';
import { calculateMetrics, saveToHistory } from '../utils/metrics';
import { motion, AnimatePresence } from 'framer-motion';

const Test = () => {
  const [showModal, setShowModal] = useState(true);
  const [targetWords, setTargetWords] = useState('');
  const [userInput, setUserInput] = useState('');
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [lang, setLang] = useState('english');
  const [difficulty, setDifficulty] = useState('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const navigate = useNavigate();
  const startTime = useRef(null);
  const userInputRef = useRef('');
  const targetWordsRef = useRef('');

  useEffect(() => { userInputRef.current = userInput; }, [userInput]);
  useEffect(() => { targetWordsRef.current = targetWords; }, [targetWords]);

  const generateInitialContent = useCallback((l = lang, d = difficulty) => {
    const list = difficultyData[l][d] || difficultyData.english.medium;
    let initialText = "";
    
    // Shuffle and pick sentences for all modes to ensure variety
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    
    // Adjust initial content length based on difficulty
    if (d === 'easy') {
      initialText = shuffled.slice(0, 3).join(' ');
    } else if (d === 'medium') {
      // Medium: 5 sentences to start (enough to see but not overwhelming)
      initialText = shuffled.slice(0, 5).join(' ');
    } else {
      // Hard: 8 sentences to start (challenging)
      initialText = shuffled.slice(0, 8).join(' ');
    }
    
    setTargetWords(initialText);
  }, [lang, difficulty]);

  const appendContent = useCallback(() => {
    const list = difficultyData[lang][difficulty];
    let moreText = "";
    
    // Pick random sentences when appending
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    if (difficulty === 'easy') {
      moreText = shuffled.slice(0, 2).join(' ');
    } else if (difficulty === 'medium') {
      moreText = shuffled.slice(0, 3).join(' ');
    } else {
      moreText = shuffled.slice(0, 4).join(' ');
    }
    setTargetWords(prev => prev + ' ' + moreText);
  }, [lang, difficulty]);

  useEffect(() => { generateInitialContent(); }, [generateInitialContent]);

  const handleStart = (selectedDuration, selectedDifficulty, selectedLang) => {
    setDuration(selectedDuration);
    setTimeLeft(selectedDuration);
    setDifficulty(selectedDifficulty);
    setLang(selectedLang);
    setUserInput('');
    setTargetWords('');
    setShowModal(false);
    startTime.current = null;
    setIsActive(false);
    // Explicitly call with new values to avoid stale closure if needed, 
    // though generateInitialContent is in dependency array of useEffect above
    generateInitialContent(selectedLang, selectedDifficulty);
  };

  const handleCancel = () => {
    if (userInput.length > 0) {
      setShowModal(false);
    } else {
      navigate('/');
    }
  };

  const handleRestart = () => {
    setUserInput('');
    setTimeLeft(duration);
    setIsActive(false);
    startTime.current = null;
    generateInitialContent(lang, difficulty);
  };

  const handleEnd = useCallback(() => {
    setIsActive(false);
    const elapsed = (Date.now() - (startTime.current || Date.now())) / 1000;
    const finalMetrics = calculateMetrics(userInputRef.current, targetWordsRef.current, elapsed || duration);
    
    const savedResult = saveToHistory({
      ...finalMetrics,
      duration,
      difficulty,
      lang
    });

    sessionStorage.setItem('typingResults', JSON.stringify(savedResult));
    navigate('/result');
  }, [duration, difficulty, lang, navigate]);

  useEffect(() => {
    let id;
    if (isActive && timeLeft > 0) {
      id = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(id); handleEnd(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(id);
  }, [isActive, timeLeft, handleEnd]);

  const elapsed = startTime.current ? (Date.now() - startTime.current) / 1000 : 0;
  const liveStats = calculateMetrics(userInput, targetWords, elapsed || 1);
  const rank = liveStats.wpm > 100 ? 'Phantom' : liveStats.wpm > 70 ? 'Master' : liveStats.wpm > 40 ? 'Pro' : 'Rookie';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
      <AnimatePresence>
        {showModal && <StartModal onStart={handleStart} onCancel={handleCancel} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-border pb-12">
        <div className="flex flex-wrap justify-center md:justify-start gap-12">
          <Stat label="WPM" value={liveStats.wpm} icon={<Zap className="text-yellow-500" size={20} fill="currentColor" />} />
          <Stat label="Accuracy" value={liveStats.accuracy} unit="%" icon={<Target className="text-emerald-500" size={20} />} />
          <Stat label="Timer" value={timeLeft} unit="s" icon={<Flame className="text-orange-500" size={20} fill="currentColor" />} />
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex bg-secondary p-1 rounded-2xl gap-1">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                title="Toggle Sound"
                className={`p-3 rounded-xl transition-all ${soundEnabled ? 'bg-background shadow-sm text-indigo-500' : 'text-muted-foreground'}`}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button 
                onClick={() => setShowModal(true)} 
                title="Configure Test"
                className="p-3 rounded-xl hover:bg-background transition-all text-muted-foreground hover:text-foreground"
              >
                <Settings2 size={20} />
              </button>
              <button 
                onClick={handleRestart} 
                title="Restart Test"
                className="p-3 rounded-xl hover:bg-background transition-all text-muted-foreground hover:text-rose-500"
              >
                <RotateCcw size={20} />
              </button>
           </div>
           <div className="hidden lg:flex flex-col items-end">
              <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1 ${
                rank === 'Phantom' ? 'bg-indigo-500 text-white' : 'bg-secondary text-muted-foreground'
              }`}>
                Rank: {rank}
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">PHANTOM<span className="text-indigo-500">TYPE</span></h1>
           </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <TypingBox 
          words={targetWords} 
          userInput={userInput} 
          setUserInput={setUserInput} 
          onStart={() => {
            setIsActive(true);
            startTime.current = Date.now();
          }}
          onAppend={appendContent}
          difficulty={difficulty}
          isRTL={lang !== 'english'}
          lang={lang}
          soundEnabled={soundEnabled}
        />
      </motion.div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
         <div className="flex flex-wrap justify-center gap-8">
            <span>&lt; Mode: {difficulty} &gt;</span>
            <span>&lt; Language: {lang} &gt;</span>
            <span>&lt; Anti-Paste Active &gt;</span>
         </div>
         <div className="flex items-center gap-2 text-indigo-500/50">
            <Globe size={14} />
            <span>Server Time: {new Date().toLocaleTimeString()}</span>
         </div>
      </div>

      {/* Ads Placeholder */}
      <div className="mt-8 p-6 border border-dashed border-border rounded-3xl flex items-center justify-center bg-secondary/20 grayscale opacity-50">
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Advertisement Area</span>
      </div>
    </div>
  );
};

const Stat = ({ label, value, unit = '', icon }) => (
  <div className="flex flex-col gap-1 items-center md:items-start group">
    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest group-hover:text-foreground transition-colors">
      {icon} {label}
    </div>
    <div className="text-5xl font-black tabular-nums tracking-tighter">
      {value}<span className="text-lg text-muted-foreground/40 ml-1 font-bold">{unit}</span>
    </div>
  </div>
);

export default Test;