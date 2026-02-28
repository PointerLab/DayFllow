import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import dayflowLogo from '@/assets/dayflow-logo.png';

export const LandingNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-card/95 backdrop-blur-sm shadow-soft' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={dayflowLogo} 
            alt="Dayflow" 
            className="h-10 w-auto rounded-2xl object-contain"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('features')}
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('benefits')}
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            Benefits
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            About
          </button>
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          <button
            onClick={() => navigate('/login')}
            className="group inline-flex items-center gap-3 px-5 py-1 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-6 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
            >
              Benefits
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
            >
              About
            </button>
            <button
              onClick={() => navigate('/login')}
              className="block w-full text-left text-primary font-semibold py-2"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
