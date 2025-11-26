
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

  // Define all possible nav items
  const allNavItems = [
    { id: 'model', label: "模式", isVisible: content.model.isVisible },
    { id: 'showcase', label: "案例", isVisible: content.showcase.isVisible },
    { id: 'financials', label: "测算", isVisible: content.financials.isVisible },
    { id: 'menu', label: "产品", isVisible: content.menuSection.isVisible },
    { id: 'comparison', label: "配置", isVisible: content.comparison.isVisible },
    { id: 'faq', label: "问答", isVisible: content.faq.isVisible },
  ];

  const navItems = allNavItems.filter(item => item.isVisible || isAdmin);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-brand-border py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div onClick={() => scrollToSection('hero')} className="transform hover:opacity-80 transition-opacity">
            <BrandLogo dark={true} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-brand-dark font-bold'
                    : 'text-brand-gray hover:text-brand-dark hover:bg-brand-surface'
                }`}
              >
                {isAdmin && !item.isVisible && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" title="Hidden"></span>
                )}
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button & Admin Lock */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-brand-dark text-white px-5 py-2 rounded-md font-bold text-xs hover:bg-black transition-all shadow-subtle border border-transparent hover:border-gray-800"
            >
              立即加盟
            </button>
            
            <button 
              onClick={onOpenAdmin}
              className="w-8 h-8 rounded-md flex items-center justify-center text-brand-gray hover:text-brand-dark hover:bg-brand-surface transition-colors"
              title="Admin Login"
            >
              <Lock size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark p-2 hover:bg-brand-surface rounded-md transition">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute w-full border-b border-brand-border shadow-lg animate-fade-in-up">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-brand-dark hover:bg-brand-surface w-full text-left transition-all"
              >
                {item.label}
                {isAdmin && !item.isVisible && (
                    <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded font-bold">Hidden</span>
                )}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full bg-brand-dark text-white px-6 py-3.5 rounded-lg font-bold text-center mt-6 text-sm shadow-md"
            >
              立即加盟
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
