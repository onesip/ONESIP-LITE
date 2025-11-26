
import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, Globe } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useContent } from '../contexts/ContentContext';

interface NavbarProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, scrollToSection, onOpenAdmin }) => {
  const { content, isAdmin, openLeadForm, toggleLanguage, language } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allNavItems = [
    { id: 'model', label: language === 'zh' ? "模式" : "Model", isVisible: content.model.isVisible },
    { id: 'showcase', label: language === 'zh' ? "案例" : "Cases", isVisible: content.showcase.isVisible },
    { id: 'financials', label: language === 'zh' ? "测算" : "Profit", isVisible: content.financials.isVisible },
    { id: 'menu', label: language === 'zh' ? "产品" : "Menu", isVisible: content.menuSection.isVisible },
    { id: 'comparison', label: language === 'zh' ? "配置" : "Specs", isVisible: content.comparison.isVisible },
    { id: 'faq', label: language === 'zh' ? "问答" : "FAQ", isVisible: content.faq.isVisible },
  ];

  const navItems = allNavItems.filter(item => item.isVisible || isAdmin);

  return (
    <>
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-panel py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div onClick={() => scrollToSection('hero')} className="transform hover:opacity-80 transition-opacity cursor-pointer">
            <BrandLogo dark={true} />
          </div>

          {/* Desktop Nav - Pill Shape */}
          <div className="hidden md:flex items-center bg-white/50 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/20 shadow-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'text-brand-gray hover:text-brand-dark hover:bg-white'
                }`}
              >
                {isAdmin && !item.isVisible && (
                    <span className="absolute top-0 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                )}
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
             <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full hover:bg-white/50 transition-colors uppercase"
            >
              <Globe size={14} className="text-gray-500"/>
              {language === 'zh' ? 'EN' : '中'}
            </button>

            <button
              onClick={openLeadForm}
              className="bg-brand-green-medium text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-brand-green-dark transition-all shadow-lg shadow-brand-green-medium/20 active:scale-95 transform"
            >
              {language === 'zh' ? '立即加盟' : 'Join Now'}
            </button>
            
            <button 
              onClick={onOpenAdmin}
              className="w-8 h-8 rounded-full flex items-center justify-center text-brand-gray hover:text-brand-dark hover:bg-white transition-colors"
            >
              <Lock size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleLanguage} className="text-brand-dark px-2 font-bold text-xs uppercase">
                 {language === 'zh' ? 'EN' : '中'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition active:scale-95">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
    
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl animate-fade-in flex flex-col justify-center items-center space-y-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className="text-2xl font-bold text-brand-dark"
              >
                {item.label}
              </button>
            ))}
             <button
              onClick={() => {
                  setIsOpen(false);
                  openLeadForm();
              }}
              className="mt-8 bg-brand-green-medium text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl"
            >
              {language === 'zh' ? '立即加盟' : 'Join Now'}
            </button>
             <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100">
                <X size={24} />
             </button>
        </div>
      )}
    </>
  );
};
