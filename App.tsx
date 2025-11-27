


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
import { LeadFormModal } from './components/LeadFormModal';
import { useContent } from './contexts/ContentContext';
import { Save, LogOut, EyeOff, Loader2 } from 'lucide-react';

const SectionWrapper = ({ isVisible, isAdmin, children }: { isVisible: boolean, isAdmin: boolean, children?: React.ReactNode }) => {
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
  const { isDashboardOpen, isAdmin, openDashboard, content, isLoading, isSyncing, saveChanges } = useContent();
  const [activeSection, setActiveSection] = useState('hero');
  const [showLoginScreen, setShowLoginScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        setShowLoginScreen(true);
      }
      // Global save shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          if (isAdmin) {
              saveChanges();
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, saveChanges]);

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
            {/* Minimalist Text Loading State */}
            <div className="relative flex flex-col items-center gap-6 animate-fade-in">
                <div className="font-sans font-black text-4xl tracking-tighter text-brand-dark">
                    ONESIP
                </div>
                {/* Subtle progress bar */}
                <div className="w-24 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-dark w-1/3 animate-[shimmer_1s_infinite_linear] rounded-full"></div>
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
    <div className="font-sans text-brand-dark bg-white selection:bg-brand-green-medium selection:text-white relative antialiased">
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        onOpenAdmin={() => setShowLoginScreen(true)}
      />
      
      <Hero scrollToSection={scrollToSection} />
      
      {/* Main Content Container with cleaner spacing */}
      <div className="flex flex-col w-full">
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
      <LeadFormModal />

      {/* Modern Sync Overlay */}
      {isSyncing && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10001] bg-white/90 backdrop-blur-xl text-brand-dark px-6 py-3 rounded-full flex items-center gap-3 shadow-glass animate-in slide-in-from-top-4 border border-gray-100">
              <Loader2 size={16} className="animate-spin text-brand-green-medium"/>
              <span className="text-xs font-bold tracking-wide">SYNCING...</span>
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
             disabled={isSyncing}
             className="bg-brand-green-medium hover:bg-brand-green-dark text-white w-14 h-14 rounded-full shadow-app flex items-center justify-center transition-all hover:scale-105 border-2 border-white/50 disabled:opacity-50 disabled:animate-pulse"
             title="Save Changes (Ctrl+S)"
           >
             {isSyncing ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />}
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
