
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
        <div className={`relative ${!isVisible && isAdmin ? 'opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0' : ''}`}>
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

  // Keyboard shortcut (Ctrl+Shift+L)
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
        <div className="h-screen w-full bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center text-white animate-pulse shadow-xl">
                <LogoSymbol className="w-6 h-6"/>
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
    <div className="font-sans text-brand-dark bg-white selection:bg-brand-green-light selection:text-brand-green-dark relative antialiased">
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        onOpenAdmin={() => setShowLoginScreen(true)}
      />
      
      <Hero scrollToSection={scrollToSection} />
      
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

      <Footer onOpenAdmin={() => setShowLoginScreen(true)} />
      
      {!isAdmin && <ChatWidget />}

      {/* Modern Sync Overlay */}
      {isSyncing && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10001] bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl animate-in slide-in-from-top-4 border border-white/20">
              <Loader2 size={14} className="animate-spin text-brand-green-light"/>
              <span className="text-xs font-bold tracking-wide">Syncing changes...</span>
          </div>
      )}

      {/* Admin Floating Controls */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-[10000] flex flex-col gap-3 animate-fade-in">
           <div className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full text-center shadow-lg opacity-80 mb-1 border border-white/20">
             EDITOR ACTIVE
           </div>
           
           <button 
             onClick={saveChanges}
             className="bg-brand-green-medium hover:bg-brand-green-dark text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 border border-white/20"
             title="Save Changes"
           >
             <Save size={20} />
           </button>

           <button 
             onClick={openDashboard}
             className="bg-black hover:bg-gray-900 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 border border-white/20"
             title="Back to Dashboard"
           >
             <LogOut size={16} className="rotate-180" />
           </button>
        </div>
      )}
    </div>
  );
}

export default App;
