import React from 'react';
import { motion } from 'framer-motion';
import dayflowLogo from '@/assets/dayflow-logo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  quote: string;
  author: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, quote, author }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>

      {/* Right Side - Brand Panel */}
      <div className="hidden lg:flex flex-1 gradient-hero relative overflow-hidden items-center justify-center p-12">
        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-primary-foreground/5 rounded-full"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-32 right-16 w-24 h-24 bg-primary-foreground/5 rounded-full"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-10 w-16 h-16 border border-primary-foreground/10 rotate-45"
            animate={{ rotate: [45, 55, 45] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-12 h-12 bg-primary-foreground/5"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src={dayflowLogo} 
              alt="Dayflow" 
              className="h-16 w-auto mx-auto mb-8 brightness-0 invert"
            />
          </motion.div>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-primary-foreground/90 text-xl italic font-light leading-relaxed"
          >
            "{quote}"
          </motion.blockquote>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-primary-foreground/60 mt-4 text-sm"
          >
            — {author}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
