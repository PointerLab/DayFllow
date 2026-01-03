import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';
import dayflowLogo from '@/assets/dayflow-logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-deep-purple py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <img 
              src={dayflowLogo} 
              alt="Dayflow" 
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </div>

          <p className="text-primary-foreground/70 text-sm">
            © 2026 Dayflow. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-full transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="p-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-full transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="p-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-full transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
