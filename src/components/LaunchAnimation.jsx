import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Calculator, TrendingUp, CheckCircle, FileText } from 'lucide-react';

export default function LaunchAnimation({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000), // Book appear
      setTimeout(() => setStep(2), 2000), // Subject symbols
      setTimeout(() => setStep(3), 3000), // Glowing particles
      setTimeout(() => setStep(4), 4000), // Graduation cap
      setTimeout(() => setStep(5), 5000), // Logo + Tagline
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 6500)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#08251C] via-[#0F382C] to-[#1B5E4B] text-white overflow-hidden select-none">
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Step 4: Graduation Cap descending onto the book */}
        {step >= 4 && (
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-20 -mb-4 text-[#E6C687]"
          >
            <GraduationCap className="w-16 h-16 drop-shadow-[0_0_15px_rgba(230,198,135,0.6)]" />
          </motion.div>
        )}

        {/* Step 1: Closed/Opening Book in center */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
          >
            <BookOpen className="w-20 h-20 text-[#FAF7F0] drop-shadow-md" />
          </motion.div>
        )}

        {/* Step 2: Floating Subject Symbols */}
        {step >= 2 && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -50, y: -20 }}
              animate={{ opacity: 0.85, x: -80, y: -40 }}
              transition={{ duration: 0.7 }}
              className="absolute text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm text-emerald-200"
            >
              Accounting
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, y: -20 }}
              animate={{ opacity: 0.85, x: 80, y: -30 }}
              transition={{ duration: 0.7 }}
              className="absolute text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm text-emerald-200"
            >
              Economics
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.85, y: 70 }}
              transition={{ duration: 0.7 }}
              className="absolute text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm text-emerald-200"
            >
              Business Studies
            </motion.div>
          </div>
        )}

        {/* Step 3: Glowing Particles & Study Icons */}
        {step >= 3 && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-12 -left-16 text-yellow-300 animate-pulse"
            >
              <Calculator className="w-6 h-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute -top-10 -right-16 text-emerald-300"
            >
              <TrendingUp className="w-6 h-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-10 -left-12 text-teal-300"
            >
              <CheckCircle className="w-6 h-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-10 -right-12 text-amber-200"
            >
              <FileText className="w-6 h-6" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Step 5: NEXORA STUDY Logo & Tagline */}
      {step >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 text-center px-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-[#FAF7F0] drop-shadow-md">
            NEXORA <span className="text-[#E6C687]">STUDY</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-emerald-100/80 tracking-wide font-light max-w-md mx-auto">
            Your Future Starts With What You Do Today.
          </p>
        </motion.div>
      )}
    </div>
  );
}