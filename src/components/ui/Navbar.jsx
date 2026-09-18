import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/ACG.png';
import { useAuth } from '../../AuthContext.jsx';

export default function Navbar({
  onSignIn = () => {},
  onDashboard = () => {},
  onGetStarted = () => {},
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAndRun = (action) => {
    setMobileMenuOpen(false);
    action?.();
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-[#05060A]/70 backdrop-blur-xl border-b border-white/[0.08]' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-[1224px] mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 cursor-pointer group" aria-label="ACG Funded home">
          <img src={logo} width={80} alt="ACG Funded" />
        </a>

        <div className="hidden md:flex items-center gap-6">
          {['Challenges', 'How It Works', 'Support'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[13px] font-medium text-[#888888] hover:text-white transition-all duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                type="button"
                onClick={onDashboard}
                className="text-[13px] font-medium text-[#888888] hover:text-white transition-all duration-300"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[13px] font-medium border border-white/10 bg-white/5 text-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onSignIn}
                className="text-[13px] font-medium text-[#888888] hover:text-white transition-all duration-300"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={onGetStarted}
                className="text-[13px] font-medium border border-white/10 bg-white/5 text-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-md text-white/70 hover:bg-white/[0.04] hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 max-h-[calc(100vh-3.5rem)] w-full overflow-y-auto bg-[#05060A]/95 backdrop-blur-lg border-b border-white/[0.08] p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 fade-in">
          {['Challenges', 'How It Works', 'Support'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-white font-medium hover:text-[#888888] transition-colors"
            >
              {link}
            </a>
          ))}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-4">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => closeAndRun(onDashboard)}
                  className="w-full text-left text-white font-medium"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full bg-white text-black py-2 rounded-full font-medium text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => closeAndRun(onSignIn)}
                  className="w-full text-left text-white font-medium"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => closeAndRun(onGetStarted)}
                  className="w-full bg-white text-black py-2 rounded-full font-medium text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
