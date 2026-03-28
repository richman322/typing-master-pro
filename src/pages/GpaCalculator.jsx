import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Calculator, Info, 
  Download, Share2, GraduationCap, 
  BookOpen, Layers, Award, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const GpaCalculator = () => {
  const [activeTab, setActiveTab] = useState('gpa'); // 'gpa' or 'cgpa'
  
  // GPA State
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', creditHours: 3, qualityPoints: 12.0 },
    { id: 2, name: '', creditHours: 3, qualityPoints: 9.0 }
  ]);

  // CGPA State
  const [semesters, setSemesters] = useState([
    { id: 1, name: 'Semester 1', gpa: 3.5 },
    { id: 2, name: 'Semester 2', gpa: 3.8 }
  ]);

  // GPA Methods
  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', creditHours: 3, qualityPoints: 12.0 }]);
  };

  const removeSubject = (id) => {
    if (subjects.length === 1) {
      toast.error("Minimum one subject required");
      return;
    }
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // CGPA Methods
  const addSemester = () => {
    const nextId = semesters.length + 1;
    setSemesters([...semesters, { id: Date.now(), name: `Semester ${nextId}`, gpa: 3.5 }]);
  };

  const removeSemester = (id) => {
    if (semesters.length === 1) {
      toast.error("Minimum one semester required");
      return;
    }
    setSemesters(semesters.filter(s => s.id !== id));
  };

  const updateSemester = (id, field, value) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const getGpaStats = () => {
    let totalQualityPoints = 0;
    let totalCredits = 0;
    subjects.forEach(s => {
      const credits = parseFloat(s.creditHours) || 0;
      const qp = parseFloat(s.qualityPoints) || 0;
      totalQualityPoints += qp;
      totalCredits += credits;
    });
    const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : '0.00';
    return { gpa, totalQualityPoints, totalCredits };
  };

  const getCgpaStats = () => {
    let sumGpa = 0;
    semesters.forEach(s => {
      sumGpa += parseFloat(s.gpa) || 0;
    });
    const cgpa = semesters.length > 0 ? (sumGpa / semesters.length).toFixed(2) : '0.00';
    return { cgpa, count: semesters.length };
  };

  const gpaStats = getGpaStats();
  const cgpaStats = getCgpaStats();

  const handleShare = () => {
    const type = activeTab.toUpperCase();
    const value = activeTab === 'gpa' ? gpaStats.gpa : cgpaStats.cgpa;
    const text = `📊 My ${type} on PhantomType is ${value}! Calculate yours at ${window.location.origin}`;
    
    navigator.clipboard.writeText(text);
    toast.success(`${type} result copied to clipboard!`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-widest mb-6"
        >
          <GraduationCap size={14} />
          Academic Precision Tools
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
          GPA & CGPA <span className="text-purple-500">Calculator.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          Professional-grade calculation engine strictly adhering to the <span className="text-foreground font-bold">GCUF Standards</span>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-secondary p-1.5 rounded-2xl flex gap-1 saas-shadow">
          <TabButton 
            active={activeTab === 'gpa'} 
            onClick={() => setActiveTab('gpa')}
            icon={<BookOpen size={18} />}
            label="Semester GPA"
          />
          <TabButton 
            active={activeTab === 'cgpa'} 
            onClick={() => setActiveTab('cgpa')}
            icon={<Layers size={18} />}
            label="Cumulative CGPA"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'gpa' ? (
              <motion.div 
                key="gpa-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6 md:p-10 saas-shadow border-purple-500/10"
              >
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Calculator size={20} />
                    </div>
                    Subject Entries
                  </h3>
                  <button 
                    onClick={() => setSubjects([{ id: Date.now(), name: '', creditHours: 3, qualityPoints: 12.0 }])}
                    className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-2"
                  >
                    <RefreshCcw size={14} /> Reset
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="col-span-4">Subject Name</div>
                    <div className="col-span-3 text-center">Credit Hours</div>
                    <div className="col-span-4 text-center">Quality Points</div>
                    <div className="col-span-1"></div>
                  </div>

                  {subjects.map((s) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={s.id} 
                      className="grid grid-cols-12 gap-3 md:gap-4 items-center p-3 md:p-0 rounded-2xl bg-secondary/30 md:bg-transparent border border-border/50 md:border-none"
                    >
                      <div className="col-span-12 md:col-span-4">
                        <input 
                          type="text" 
                          placeholder="e.g. Computer Science"
                          className="input-minimal w-full text-sm font-medium"
                          value={s.name}
                          onChange={(e) => updateSubject(s.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3 flex flex-col gap-1">
                        <label className="md:hidden text-[10px] font-black uppercase text-muted-foreground ml-1">Credits</label>
                        <input 
                          type="number" 
                          min="1"
                          max="6"
                          className="input-minimal w-full text-center text-sm font-bold"
                          value={s.creditHours}
                          onChange={(e) => updateSubject(s.id, 'creditHours', e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 md:col-span-4 flex flex-col gap-1">
                        <label className="md:hidden text-[10px] font-black uppercase text-muted-foreground ml-1">Quality Points</label>
                        <input 
                          type="number" 
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="input-minimal w-full text-center text-sm font-bold bg-background"
                          value={s.qualityPoints}
                          onChange={(e) => updateSubject(s.id, 'qualityPoints', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <button 
                          onClick={() => removeSubject(s.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={addSubject}
                  className="mt-8 w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-purple-500 hover:border-purple-500/50 transition-all group font-bold text-sm"
                >
                  <Plus size={20} className="group-hover:scale-110 transition-transform" />
                  Add New Subject
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="cgpa-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6 md:p-10 saas-shadow border-purple-500/10"
              >
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Layers size={20} />
                    </div>
                    Semester Overview
                  </h3>
                  <button 
                    onClick={() => setSemesters([{ id: Date.now(), name: 'Semester 1', gpa: 3.5 }])}
                    className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-2"
                  >
                    <RefreshCcw size={14} /> Reset
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="col-span-8">Semester Name</div>
                    <div className="col-span-3 text-center">Semester GPA</div>
                    <div className="col-span-1"></div>
                  </div>

                  {semesters.map((sem, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={sem.id} 
                      className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:p-0 rounded-2xl md:rounded-none bg-secondary/30 md:bg-transparent border border-border/50 md:border-none"
                    >
                      <div className="w-full md:col-span-8">
                        <div className="input-minimal w-full bg-secondary/50 font-bold text-sm text-muted-foreground">
                          {sem.name}
                        </div>
                      </div>
                      
                      <div className="w-full flex md:contents gap-4">
                        <div className="flex-1 md:col-span-3 flex flex-col gap-1">
                          <label className="md:hidden text-[10px] font-black uppercase text-muted-foreground ml-1">GPA</label>
                          <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            max="4"
                            className="input-minimal w-full text-center font-black text-indigo-500"
                            value={sem.gpa}
                            onChange={(e) => updateSemester(sem.id, 'gpa', e.target.value)}
                          />
                        </div>

                        <div className="md:col-span-1 flex justify-end items-center">
                          <button 
                            onClick={() => removeSemester(sem.id)}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={addSemester}
                  className="mt-8 w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/50 transition-all group font-bold text-sm"
                >
                  <Plus size={20} className="group-hover:scale-110 transition-transform" />
                  Add Next Semester
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Result */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 md:p-10 saas-shadow bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none sticky top-24">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl border border-white/20">
                <Award size={32} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-80">
                Your Calculated {activeTab.toUpperCase()}
              </h4>
              <div className="text-7xl font-black tracking-tighter mb-8 drop-shadow-2xl">
                {activeTab === 'gpa' ? gpaStats.gpa : cgpaStats.cgpa}
              </div>
              
              <div className="w-full h-[1px] bg-white/10 mb-8" />
              
              <div className="grid grid-cols-2 w-full gap-4 mb-8">
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase opacity-60">
                    {activeTab === 'gpa' ? 'Total Quality Points' : 'Total Semesters'}
                  </div>
                  <div className="font-bold">
                    {activeTab === 'gpa' ? gpaStats.totalQualityPoints.toFixed(1) : cgpaStats.count}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase opacity-60">
                    {activeTab === 'gpa' ? 'Total Credit Hours' : 'Avg per Semester'}
                  </div>
                  <div className="font-bold">
                    {activeTab === 'gpa' ? gpaStats.totalCredits : cgpaStats.cgpa}
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleShare}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-black/20"
                >
                  <Share2 size={16} /> Share Result
                </button>
                <button className="w-full py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-95 border border-white/10">
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 saas-shadow bg-secondary/20">
            <h5 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Info size={16} className="text-purple-500" />
              GCUF Policy Notes
            </h5>
            <ul className="text-xs text-muted-foreground space-y-3 font-medium">
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                Formula: Sum of Quality Points / Sum of Credits
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                A Grade is equivalent to 4.0 Grade points.
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                Credits range from 1 to 6 per course.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Ads Placeholder */}
      <div className="mt-20 p-8 border border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center bg-secondary/10 grayscale opacity-40">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-2">Advertisement Space</div>
        <div className="w-full h-20 border border-border rounded-2xl flex items-center justify-center italic text-xs">
          Professional Ad Slot (728x90)
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-6 md:px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-3 ${
      active 
        ? 'bg-background text-foreground shadow-xl' 
        : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{label.split(' ')[1]}</span>
  </button>
);

export default GpaCalculator;
