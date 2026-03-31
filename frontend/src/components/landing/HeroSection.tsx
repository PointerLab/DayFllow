import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, TrendingUp, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-background overflow-hidden pt-20">
      {/* Floating Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-32 left-[10%] w-16 h-16 bg-primary/20 rounded-full"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-48 right-[15%] w-24 h-24 bg-lavender rounded-full"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-[20%] w-12 h-12 border-2 border-primary/30 rotate-45"
          animate={{ y: [0, -10, 0], rotate: [45, 55, 45] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute top-[60%] right-[8%] w-8 h-8 bg-primary/30 rotate-45"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute bottom-20 right-[25%] w-20 h-20 border border-primary/20 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          {/* Left Content - 60% */}
          <motion.div 
            className="lg:col-span-3 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Empower Your <br />
              <span className="text-primary">8-Hour Workday</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              The best platform to manage attendance, payroll, and team performance. 
              Streamline your HR operations with intelligent automation.
            </p>
            <motion.button
              onClick={() => navigate('/plans')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lavender rounded-lg">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">10k+</p>
                  <p className="text-sm text-muted-foreground">Active Teams</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lavender rounded-lg">
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">5M+</p>
                  <p className="text-sm text-muted-foreground">Hours Tracked</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lavender rounded-lg">
                  <TrendingUp size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">99%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - 40% */}
          <motion.div 
            className="lg:col-span-2 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Dashboard Mockup */}
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-medium p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                  <div className="w-3 h-3 bg-warning-foreground rounded-full" />
                  <div className="w-3 h-3 bg-success-foreground rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-lavender rounded-lg w-3/4" />
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-lavender rounded-lg" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 bg-lavender rounded-lg" />
                    <div className="h-16 bg-lavender rounded-lg" />
                    <div className="h-16 bg-lavender rounded-lg" />
                  </div>
                  <div className="h-20 bg-lavender rounded-lg" />
                </div>
              </div>

              {/* Floating CTA Card */}
              <motion.div
                className="absolute -bottom-4 -right-4 md:right-4 bg-primary rounded-xl px-5 py-4 shadow-glow"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2 text-primary-foreground font-semibold">
                  <span>Get Started Free</span>
                  <ChevronRight size={18} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
