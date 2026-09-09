import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/ACG.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-[#05060A]/70 backdrop-blur-xl border-b border-white/[0.08]' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-[1224px] mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Logo - Minimalist */}
        <div className="flex items-center gap-2 cursor-pointer group">
            <img src={logo} width={80} />
        </div>

        {/* Desktop Links - Subtle Grayscale */}
        <div className="hidden md:flex items-center gap-6">
          {['Challenges', 'How It Works', 'Support'].map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="text-[13px] font-medium text-[#888888] hover:text-white transition-all duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Auth Actions - Professional "Ghost" Style */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-[13px] font-medium text-[#888888] hover:text-white transition-all duration-300">
            Sign In
          </button>
          <button className="text-[13px] font-medium border border-white/10 bg-white/5 text-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white/70 hover:text-white transition-colors" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu - High-End Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-[#05060A]/95 backdrop-blur-lg border-b border-white/[0.08] p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 fade-in">
          {['Dashboard', 'Markets', 'Pricing', 'API'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-base text-white font-medium hover:text-[#888888] transition-colors">
              {link}
            </a>
          ))}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-4">
            <button className="w-full text-left text-white font-medium">Sign In</button>
            <button className="w-full bg-white text-black py-2 rounded-full font-medium text-sm">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
}