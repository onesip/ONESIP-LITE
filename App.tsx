
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModelSection } from './components/ModelSection';
import { ProcessSection } from './components/ProcessSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { ComparisonSection } from './components/ComparisonSection';
import { FinancialsSection } from './components/FinancialsSection';
import { MenuSection } from './components/MenuSection';
import { FAQSection } from './components/FAQSection';
import { PartnerSection } from './components/PartnerSection';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { useContent } from './contexts/ContentContext';
import { Save, LogOut, EyeOff, Loader2 } from 'lucide-react';
import { LogoSymbol } from './components/BrandLogo';

const SectionWrapper = ({ isVisible, isAdmin, children }: { isVisible: boolean, isAdmin: boolean, children: React.ReactNode }) => {
    if (!isVisible && !isAdmin) return null;
    
    return (
        <div className={`relative transition-opacity duration-300 ${!isVisible && isAdmin ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}>
            {!isVisible && isAdmin && (
                <div className="absolute top-0 inset-x-0 z-20 flex justify-center -translate-y-1/2 pointer-events-none">
                    <div className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border-2 border-white">
                        <EyeOff size={12} />
                        已隐藏 (仅管理员可见)
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

const App: React.FC = () => {
  const { isDashboardOpen, isAdmin, openDashboard, saveChanges, content, isLoading, isSyncing } = useContent();
  const [activeSection, setActiveSection] = useState('hero');
  const [showLoginScreen, setShowLoginScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        setShowLoginScreen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  if (isLoading) {
    return (
        <div className="fixed inset-0 z-[99999] bg-[#F5F5F7] flex flex-col items-center justify-center">
            {/* Elegant Loading State */}
            <div className="relative">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-brand-green-medium shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] animate-float">
                    <LogoSymbol className="w-10 h-10"/>
                </div>
                <div className="absolute -bottom-12 left-0 w-full flex justify-center">
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-brand-green-medium/20 animate-bounce delay-0"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-green-medium/20 animate-bounce delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-green-medium/20 animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (isDashboardOpen && isAdmin) {
    return <AdminDashboard />;
  }

  if (showLoginScreen && !isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="font-sans text-brand-dark bg-brand-surface selection:bg-brand-green-medium selection:text-white relative antialiased pb-20">
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        onOpenAdmin={() => setShowLoginScreen(true)}
      />
      
      <Hero scrollToSection={scrollToSection} />
      
      {/* Main Content Container with spacing */}
      <div className="space-y-6 md:space-y-8 pb-12">
          <SectionWrapper isVisible={content.model.isVisible} isAdmin={isAdmin}>
             <ModelSection />
          </SectionWrapper>

          <SectionWrapper isVisible={content.process.isVisible} isAdmin={isAdmin}>
             <ProcessSection />
          </SectionWrapper>

          <SectionWrapper isVisible={content.showcase.isVisible} isAdmin={isAdmin}>
             <ShowcaseSection /> 
          </SectionWrapper>
          
          <SectionWrapper isVisible={content.financials.isVisible} isAdmin={isAdmin}>
             <FinancialsSection />
          </SectionWrapper>

          <SectionWrapper isVisible={content.menuSection.isVisible} isAdmin={isAdmin}>
             <MenuSection />
          </SectionWrapper>

          <SectionWrapper isVisible={content.comparison.isVisible} isAdmin={isAdmin}>
             <ComparisonSection />
          </SectionWrapper>

          <SectionWrapper isVisible={content.faq.isVisible} isAdmin={isAdmin}>
             <FAQSection />
          </SectionWrapper>

          <SectionWrapper isVisible={content.partner.isVisible} isAdmin={isAdmin}>
             <PartnerSection />
          </SectionWrapper>
      </div>

      <Footer onOpenAdmin={() => setShowLoginScreen(true)} />
      
      {!isAdmin && <ChatWidget />}

      {/* Modern Sync Overlay */}
      {isSyncing && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10001] bg-white/80 backdrop-blur-xl text-brand-dark px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-top-4 border border-white/20">
              <Loader2 size={16} className="animate-spin text-brand-green-medium"/>
              <span className="text-xs font-bold tracking-wide">同步云端数据中...</span>
          </div>
      )}

      {/* Admin Floating Controls */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-[10000] flex flex-col gap-3 animate-fade-in">
           <div className="bg-black/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full text-center shadow-lg mb-1 border border-white/10">
             ADMIN MODE
           </div>
           
           <button 
             onClick={saveChanges}
             className="bg-brand-green-medium hover:bg-brand-green-dark text-white w-14 h-14 rounded-full shadow-app flex items-center justify-center transition-transform hover:scale-105"
             title="Save Changes"
           >
             <Save size={22} />
           </button>

           <button 
             onClick={openDashboard}
             className="bg-white hover:bg-gray-50 text-black w-14 h-14 rounded-full shadow-app flex items-center justify-center transition-transform hover:scale-105 border border-gray-100"
             title="Back to Dashboard"
           >
             <LogOut size={18} className="rotate-180" />
           </button>
        </div>
      )}
    </div>
  );
}

export default App;
