
import React, { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useContent } from '../contexts/ContentContext';

interface NavbarProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, scrollToSection, onOpenAdmin }) => {
  const { content, isAdmin } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define all possible nav items with their corresponding visibility state
  const allNavItems = [
    { id: 'model', label: "模式", isVisible: content.model.isVisible },
    { id: 'showcase', label: "案例", isVisible: content.showcase.isVisible },
    { id: 'financials', label: "测算", isVisible: content.financials.isVisible },
    { id: 'menu', label: "产品", isVisible: content.menuSection.isVisible },
    { id: 'comparison', label: "配置", isVisible: content.comparison.isVisible },
    { id: 'faq', label: "问答", isVisible: content.faq.isVisible },
  ];

  // Admins see all items (to access/edit hidden sections), Visitors only see visible ones
  const navItems = allNavItems.filter(item => item.isVisible || isAdmin);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-brand-cream/80 backdrop-blur-md border-b border-brand-green-dark/5 py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div onClick={() => scrollToSection('hero')} className="transform hover:scale-105 transition-transform duration-300">
            <BrandLogo />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-brand-green-dark/5 shadow-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-brand-cream bg-brand-green-dark shadow-md'
                    : 'text-brand-green-medium hover:text-brand-green-dark hover:bg-white/50'
                }`}
              >
                {/* Visual indicator for Admin if item is hidden from public */}
                {isAdmin && !item.isVisible && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" title="该板块已隐藏"></span>
                )}
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button & Admin Lock */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-brand-dark text-brand-cream px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-green-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-transparent"
            >
              立即加盟
            </button>
            
            {/* Admin Entry - Navbar Icon */}
            <button 
              onClick={onOpenAdmin}
              className="w-10 h-10 rounded-full flex items-center justify-center text-brand-green-light hover:text-brand-green-dark hover:bg-brand-green-dark/5 transition-colors"
              title="Admin Login"
            >
              <Lock size={16} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-green-dark p-2 hover:bg-brand-green-pale/20 rounded-lg transition">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream absolute w-full border-b border-brand-green-light shadow-2xl animate-fade-in-up">
          <div className="px-4 pt-4 pb-8 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-bold text-brand-green-dark hover:bg-white hover:shadow-sm w-full text-left transition-all border border-transparent hover:border-brand-green-dark/5"
              >
                {item.label}
                {isAdmin && !item.isVisible && (
                    <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full border border-red-200">
                        隐藏中
                    </span>
                )}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full bg-brand-green-dark text-white px-6 py-4 rounded-2xl font-bold text-center mt-6 text-lg shadow-xl"
            >
              立即加盟
            </button>
            
            {/* Mobile Admin Entry */}
            <button
              onClick={() => {
                onOpenAdmin();
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 text-brand-green-light hover:text-brand-green-dark"
            >
               <Lock size={16} />
               <span className="text-sm font-bold">Admin Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
