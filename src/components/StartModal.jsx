import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BarChart, Globe, Play, X } from 'lucide-react';

const StartModal = ({ onStart, onCancel }) => {
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState('medium');
  const [lang, setLang] = useState('english');

  const durations = [
    { label: '30s', value: 30 },
    { label: '60s', value: 60 },
    { label: '3m', value: 180 },
    { label: '5m', value: 300 }
  ];
  const difficulties = ['easy', 'medium', 'hard'];
  const languages = ['english'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-xl overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-panel max-w-2xl w-full p-6 md:p-12 saas-shadow border-indigo-500/20 my-auto relative"
      >
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8 md:mb-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-500 rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Play size={28} className="md:size-32" fill="currentColor" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-2">Configure Mission</h2>
          <p className="text-sm md:text-base text-muted-foreground">Select your settings to begin the typing test.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Duration */}
          <div className="space-y-3 md:space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Clock size={14} /> Duration
            </label>
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2">
              {durations.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm font-bold border transition-all ${duration === d.value ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-secondary/50 border-border hover:border-indigo-500/50'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3 md:space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <BarChart size={14} /> Difficulty
            </label>
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm font-bold border capitalize transition-all ${difficulty === d ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-secondary/50 border-border hover:border-indigo-500/50'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3 md:space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Globe size={14} /> Language
            </label>
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2">
              {languages.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm font-bold border capitalize transition-all ${lang === l ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-secondary/50 border-border hover:border-indigo-500/50'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 md:py-5 bg-secondary text-foreground rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-secondary/80 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button 
            onClick={() => onStart(duration, difficulty, lang)}
            className="flex-[2] py-4 md:py-5 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-[0.98] shadow-xl"
          >
            Initialize Engine
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StartModal;
