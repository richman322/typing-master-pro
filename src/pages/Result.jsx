import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, RotateCcw, Home, Share2, 
  ChevronRight, Calendar, Zap, Target, 
  AlertCircle, History
} from 'lucide-react';
import ResultChart from '../components/ResultChart';
import toast from 'react-hot-toast';

const Result = () => {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('typingResults');
    if (!data) {
      navigate('/test');
      return;
    }
    setResult(JSON.parse(data));

    const savedHistory = JSON.parse(localStorage.getItem('phantom_history') || '[]');
    setHistory(savedHistory.slice(0, 5));
  }, [navigate]);

  const handleShare = async () => {
    if (!result) return;
    
    const shareText = `🚀 My Typing Performance on PhantomType:
- WPM: ${result.wpm}
- Accuracy: ${result.accuracy}%
- Mode: ${result.difficulty} (${result.lang})
- Time: ${result.duration}s
- Rank: ${rank}

Try it yourself at: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Typing Performance - PhantomType',
          text: shareText,
          url: window.location.origin,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Result copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy result.');
      }
    }
  };

  if (!result) return null;

  const rank = result.wpm > 100 ? 'Phantom' : result.wpm > 70 ? 'Master' : result.wpm > 40 ? 'Pro' : 'Rookie';

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Main Result Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-8"
        >
          <div className="glass-panel p-10 md:p-16 relative overflow-hidden saas-shadow border-indigo-500/10">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Trophy size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest mb-8">
                <Trophy size={14} /> Mission Accomplished
              </div>
              <h1 className="text-5xl font-black mb-12 tracking-tight">Your Performance Report</h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <ResultStat label="Net WPM" value={result.wpm} icon={<Zap className="text-yellow-500" />} />
                <ResultStat label="Accuracy" value={result.accuracy} unit="%" icon={<Target className="text-emerald-500" />} />
                <ResultStat label="Mistakes" value={result.mistakes} icon={<AlertCircle className="text-rose-500" />} />
                <ResultStat label="Rank" value={rank} icon={<Trophy className="text-indigo-500" />} isText />
              </div>

              <div className="h-64 w-full bg-secondary/30 rounded-3xl p-6">
                <ResultChart />
              </div>

              <div className="flex flex-wrap gap-4 mt-12">
                <button onClick={() => navigate('/test')} className="btn-modern px-8 gap-2">
                  <RotateCcw size={18} /> Retake Test
                </button>
                <button onClick={() => navigate('/')} className="btn-modern-outline px-8 gap-2">
                  <Home size={18} /> Home
                </button>
                <button onClick={handleShare} className="btn-modern-outline px-8 gap-2">
                  <Share2 size={18} /> Share Result
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar: History & Tips */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 space-y-8"
        >
          <div className="glass-panel p-8 saas-shadow">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <History size={20} className="text-indigo-500" />
              Recent History
            </h3>
            <div className="space-y-4">
              {history.map((entry, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-secondary/50 border border-border/50">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{entry.wpm} WPM</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black">{entry.lang} | {entry.difficulty}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block mb-1">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <div className="text-[10px] font-black text-emerald-500">{entry.accuracy}% Acc</div>
                  </div>
                </div>
              ))}
              {history.length === 0 && <p className="text-sm text-muted-foreground italic">No history yet.</p>}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20">
            <h4 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Pro Tip</h4>
            <p className="text-sm text-indigo-100 leading-relaxed mb-6">
              Focus on accuracy first. Speed will naturally follow once your muscle memory is established. Phantom Rank requires 100+ WPM with 98%+ accuracy.
            </p>
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-white" />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const ResultStat = ({ label, value, unit = '', icon, isText = false }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
      {icon} {label}
    </div>
    <div className={`${isText ? 'text-2xl' : 'text-4xl'} font-black tabular-nums tracking-tighter`}>
      {value}<span className="text-base text-muted-foreground/40 ml-1 font-bold">{unit}</span>
    </div>
  </div>
);

export default Result;
