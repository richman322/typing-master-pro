import { Link } from 'react-router-dom';
import { 
  Keyboard, Calculator, Zap, Target, 
  ArrowRight, Sparkles, Trophy, Globe,
  ShieldCheck, BarChart3, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-32 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-500/20 blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles size={14} />
            The Ultimate Student Toolkit
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Smart Student Tools & <br />
            <span className="saas-gradient-text">Typing Master.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Master your typing speed and calculate your academic performance with our professional, precision-engineered tools. Built for students and professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/test" className="btn-modern px-8 py-6 h-auto text-base group">
              Start Typing Test 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/gpa-calculator" className="btn-modern-outline px-8 py-6 h-auto text-base">
              GPA & CGPA Calculator
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeatureCard 
            title="Typing Master Pro"
            description="Improve your WPM and accuracy with our cinematic typing engine. Supports English, Urdu, and Arabic."
            icon={<Keyboard size={32} className="text-indigo-500" />}
            link="/test"
            tag="Speed Training"
            gradient="from-indigo-500/10 to-blue-500/10"
          />
          <FeatureCard 
            title="GPA & CGPA Calculator"
            description="Calculate your semester GPA and cumulative CGPA with precision using the GCUF standard."
            icon={<Calculator size={32} className="text-purple-500" />}
            link="/gpa-calculator"
            tag="Academic Tool"
            gradient="from-purple-500/10 to-pink-500/10"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-secondary/30 dark:bg-secondary/10 py-24 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem label="Tests Taken" value="25,000+" />
            <StatItem label="GPA Calculated" value="12,400+" />
            <StatItem label="Active Users" value="5,000+" />
            <StatItem label="Avg Improvement" value="+30 WPM" />
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="w-full max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-4">Why use PhantomType?</h2>
          <p className="text-muted-foreground font-medium">Engineered for performance and ease of use.</p>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <BenefitCard 
            icon={<Zap />} 
            title="Ultra Responsive" 
            description="Experience zero-latency typing and real-time GPA calculations." 
          />
          <BenefitCard 
            icon={<Globe />} 
            title="Multilingual" 
            description="Full support for English, Urdu, and Arabic with specialized layouts." 
          />
          <BenefitCard 
            icon={<ShieldCheck />} 
            title="Local Storage" 
            description="Your progress is saved automatically to your browser for privacy." 
          />
          <BenefitCard 
            icon={<Trophy />} 
            title="Rank System" 
            description="Climb from Rookie to Phantom based on your performance." 
          />
          <BenefitCard 
            icon={<BarChart3 />} 
            title="Detailed Analytics" 
            description="Track your WPM progress and GPA trends with beautiful charts." 
          />
          <BenefitCard 
            icon={<Clock />} 
            title="Time Efficiency" 
            description="Calculations and tests designed to be quick and accurate." 
          />
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="glass-panel p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <h2 className="text-4xl font-bold mb-6 italic">Ready to boost your productivity?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of students and professionals using PhantomType to level up their skills.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/test" className="btn-modern px-10">Get Started Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, link, tag, gradient }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`p-8 rounded-[2rem] border border-border bg-card saas-shadow relative overflow-hidden group`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
    <div className="relative z-10">
      <div className="inline-block px-3 py-1 rounded-full bg-secondary text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
        {tag}
      </div>
      <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-8 saas-shadow">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        {description}
      </p>
      <Link to={link} className="inline-flex items-center text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
        Open Tool <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

const StatItem = ({ label, value }) => (
  <div>
    <div className="text-3xl md:text-4xl font-extrabold mb-1">{value}</div>
    <div className="text-xs uppercase font-black tracking-widest text-muted-foreground">{label}</div>
  </div>
);

const BenefitCard = ({ icon, title, description }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    className="p-8 rounded-2xl border border-transparent hover:border-border hover:bg-card transition-all"
  >
    <div className="text-indigo-500 mb-6">{icon}</div>
    <h4 className="text-lg font-bold mb-3">{title}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

export default Home;
