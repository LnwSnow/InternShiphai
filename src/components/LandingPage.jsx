import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, BookOpen, Calendar } from 'lucide-react';

export const LandingPage = ({ onStart }) => (
  <div className="pt-10">
    {/* Hero */}
    <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-mesh -z-10"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative"
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide uppercase text-blue-800 bg-blue-100/50 rounded-full font-headline">
          Empowering Your Career Path
        </span>
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1]">
          Track your <br /> internship journey <br className="hidden md:block" /> <span className="text-primary italic">in one place</span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
          Transform the chaos of applications into a mindful path to success.<br />Organize deadlines, track progress, and unlock resources tailored<br />for the modern scholar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStart}
            className="signature-gradient text-on-primary px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            Explore Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 bg-on-primary rounded-lg p-8 md:p-12 relative overflow-hidden group">
          <div className="relative z-10 max-w-md">
            <BarChart3 className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-headline text-3xl font-bold text-on-surface mb-4">Application Insights</h3>
            <p className="text-on-surface-variant mb-8">Visualize your progress with intelligent analytics. See exactly where you stand in every hiring pipeline.</p>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-surface-container-lowest/60 backdrop-blur rounded-full text-sm font-medium text-primary">Live Tracking</span>
              <span className="px-4 py-2 bg-surface-container-lowest/60 backdrop-blur rounded-full text-sm font-medium text-primary">Status Updates</span>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl group-hover:bg-primary-container/40 transition-all duration-700"></div>
        </div>

        <div className="md:col-span-4 bg-tertiary-container/30 rounded-lg p-8 flex flex-col justify-between">
          <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center text-on-tertiary-container">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Resource Library</h3>
            <p className="text-on-surface-variant text-sm">Curated guides and templates for resumes, cover letters, and interviews.</p>
          </div>
        </div>

        <div className="md:col-span-4 bg-secondary-container/30 rounded-lg p-8 flex flex-col justify-between">
          <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container ">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Smart Reminders</h3>
            <p className="text-on-surface-variant text-sm">Never miss a deadline again with our integrated deadline alerts.</p>
          </div>
        </div>

        <div className="md:col-span-8 bg-on-primary backdrop-blur-md rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h3 className="font-headline text-3xl font-bold text-on-surface mb-4">Designed for Deep Work</h3>
            <p className="text-on-surface-variant leading-relaxed">Our minimal interface reduces cognitive load, allowing you to focus on landing your dream role without distraction.</p>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOK_HWvwijn-GnUHPYvEMWVyGC0e0F_udD0JU6pJ4TDOCCu4gP2Ffu7PTBg9EKkrTccxdWnXI1au7lqTI0h_6sOp54Vrm2qRRNLXJxBvYa8-EmPnoO38D0P87O0T7z413-89lU6nKcoMuMrhbW_k16zvhSMl1O9HB0_h-yjTfdfxYXT8GB_SApi9_UcjfZvLb9jSc0PQZ-Wfg_63BJFQicTb-7HHBOvvSDxXxGFwevZeNVyxq5SNxFS8Q--PDist1BZ5Lj3M5tmoc" 
              alt="Workspace" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="bg-surface-container-lowest rounded-lg p-8 md:p-20 text-center relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 signature-gradient opacity-5 -z-10"></div>
        <h2 className="font-headline text-4xl font-extrabold mb-6">Ready to secure your future?</h2>
        <p className="text-lg text-on-surface-variant mb-10 max-w-xl mx-auto">Join thousands of students who have already organized<br />their way to success with ScholarIntern.</p>
        <button 
          onClick={onStart}
          className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold text-xl hover:shadow-lg hover:scale-105 transition-all"
        >
          Start Your Journey Today
        </button>
      </div>
    </section>
  </div>
);
