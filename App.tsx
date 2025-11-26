
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
import { Save, LogOut, EyeOff, Loader2, Cloud, HardDrive, AlertCircle, Wifi } from 'lucide-react';
import { LogoSymbol } from './components/BrandLogo';

// Wrapper component to handle visibility logic
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

// Floating Status Indicator (To ensure user sees it)
const ConnectionStatusPill = () => {
    const { dataSource } = useContent();
    
    // Don't show if cloud synced to keep UI clean, OR show small dot?
    // User requested to see it, so we show it always for now.
    
    return (
        <div className="fixed bottom-6 left-6 z-[9900] pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
            <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg text-[10px] font-bold uppercase tracking-wider
                ${dataSource === 'cloud' ? 'bg-green-500/10 border-green-500/20 text-green-700' : ''}
                ${dataSource === 'local' ? 'bg-orange-500/10 border-orange-500/20 text-orange-700' : ''}
                ${dataSource === 'default' ? 'bg-red-500/10 border-red-500/20 text-red-600' : ''}
            `}>
                {dataSource === 'cloud' && <><Cloud size={12} /> Cloud Synced</>}
                {dataSource === 'local' && <><HardDrive size={12} /> Local / Admin</>}
                {dataSource === 'default' && <><Wifi size={12} className="opacity-50"/> Offline Mode</>}
            </div>
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

  // --- Initial Loading Screen ---
  if (isLoading) {
    return (
        <div className="h-screen w-full bg-brand-cream flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-brand-green-dark rounded-2xl flex items-center justify-center text-white animate-pulse">
                <LogoSymbol className="w-8 h-8"/>
            </div>
            <p className="text-brand-green-dark font-bold tracking-widest text-xs uppercase animate-pulse">Loading Content...</p>
        </div>
    );
  }

  // --- View Routing Logic ---

  // 1. If Dashboard is active and user is admin, show the full screen Dashboard
  if (isDashboardOpen && isAdmin) {
    return <AdminDashboard />;
  }

  // 2. If Login Screen is triggered (but not yet admin), show Login
  if (showLoginScreen && !isAdmin) {
    return <AdminLogin />;
  }

  // 3. Default: Show Frontend Website
  return (
    <div className="font-sans text-brand-dark bg-brand-cream selection:bg-brand-green-light/30 selection:text-brand-green-dark relative">
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        onOpenAdmin={() => setShowLoginScreen(true)}
      />
      
      {/* FORCE VISIBLE STATUS INDICATOR */}
      <ConnectionStatusPill />

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
      
      {/* Floating Chat for Visitors */}
      {!isAdmin && <ChatWidget />}

      {/* Syncing Indicator Overlay */}
      {isSyncing && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10001] bg-black/80 text-white px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur shadow-2xl animate-in slide-in-from-top-10">
              <Loader2 size={18} className="animate-spin text-brand-green-medium"/>
              <span className="text-xs font-bold">正在同步云端数据...</span>
          </div>
      )}

      {/* Admin Controls Overlay (When in 'CMS Edit Mode') */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 animate-fade-in">
           <div className="bg-brand-dark text-white text-xs px-3 py-1 rounded-full text-center shadow-lg opacity-80 mb-1">
             CMS 编辑模式已开启
           </div>
           
           <button 
             onClick={saveChanges}
             className="bg-brand-green-medium hover:bg-brand-green-dark text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
             title="保存更改"
           >
             <Save size={24} />
           </button>

           <button 
             onClick={openDashboard}
             className="bg-brand-dark hover:bg-black text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
             title="返回控制台"
           >
             <LogOut size={20} className="rotate-180" />
           </button>
        </div>
      )}
    </div>
  );
}

export default App;
