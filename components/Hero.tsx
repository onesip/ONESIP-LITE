
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { LogoSymbol } from './BrandLogo';
import { useContent } from '../contexts/ContentContext';
import { EditableText, EditableImage } from './ui/Editable';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const { content, updateHero } = useContent();
  const { hero } = content;

  return (
    <div id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-[#F5F5F7]">
      {/* Refined Gradient Background - Very Subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-green-100/40 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full h-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 h-full">
          
          {/* Left Content - Typography First */}
          <div className="lg:w-1/2 flex flex-col justify-center animate-fade-in-up text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 mb-8 opacity-0 animate-fade-in justify-center lg:justify-start" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green-medium opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green-medium"></span>
                </span>
               <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-600">
                  <EditableText value={hero.tagline} onSave={(val) => updateHero('tagline', val)} />
               </span>
            </div>
            
            {/* Mobile: text-5xl, Desktop: text-8xl */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-brand-dark leading-[1.1] md:leading-[0.95] tracking-tighter mb-8">
              <span className="block">
                  <EditableText value={hero.titleLine1} onSave={(val) => updateHero('titleLine1', val)} tag="span"/>
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-brand-dark to-gray-600">
                  <EditableText value={hero.titleLine2} onSave={(val) => updateHero('titleLine2', val)} tag="span"/>
              </span>
            </h1>
            
            <div className="space-y-6 md:space-y-8 max-w-lg mx-auto lg:mx-0">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight">
                 <EditableText value={hero.subtitle} onSave={(val) => updateHero('subtitle', val)} />
              </h2>
              {/* Increased contrast for description */}
              <div className="text-base md:text-lg text-gray-700 leading-relaxed font-normal">
                 <EditableText 
                  value={hero.description} 
                  onSave={(val) => updateHero('description', val)} 
                  multiline={true}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 justify-center lg:justify-start">
              <button 
                onClick={() => scrollToSection('financials')}
                className="w-full sm:w-auto px-10 py-4 bg-brand-dark text-white rounded-full font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 group"
              >
                <EditableText value={hero.buttonText} onSave={(val) => updateHero('buttonText', val)} />
                <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
              </button>
              
              <div className="flex items-center px-6 py-4 rounded-full border border-gray-300 bg-white/50 backdrop-blur-sm text-sm font-bold text-gray-700">
                 <EditableText value={hero.trustText} onSave={(val) => updateHero('trustText', val)} />
              </div>
            </div>
          </div>

          {/* Right Visual - Ultra Clean Device Mockup */}
          <div className="lg:w-1/2 relative flex justify-center lg:justify-end perspective-1000 mt-8 lg:mt-0">
            {/* The Device Frame - Scaled down slightly on mobile */}
            <div className="relative w-[280px] h-[560px] md:w-[320px] md:h-[640px] bg-black rounded-[55px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[8px] border-gray-900 ring-1 ring-gray-700/50 flex flex-col overflow-hidden transform hover:scale-[1.02] transition-transform duration-700 ease-out z-10">
              
              {/* Dynamic Island Area */}
              <div className="absolute top-0 w-full h-8 bg-black z-20 flex justify-center">
                 <div className="w-24 h-6 bg-black rounded-b-2xl"></div>
              </div>

              {/* Screen Content */}
              <div className="h-full bg-white relative flex flex-col">
                 <EditableImage 
                    src={hero.image} 
                    alt="Hero Product" 
                    className="w-full h-full object-cover"
                    onSave={(val) => updateHero('image', val)}
                  />
                  
                  {/* Overlay UI on Phone Screen */}
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-32 text-white">
                      <div className="flex items-center gap-2 mb-2">
                          <LogoSymbol className="w-4 h-4 text-white"/>
                          <span className="text-xs font-bold tracking-widest uppercase opacity-80">Signature</span>
                      </div>
                      <h3 className="text-3xl font-bold leading-none mb-1">Thai Tea</h3>
                      <p className="text-lg opacity-80 font-serif italic">Salty Cheese</p>
                      <div className="mt-4 flex justify-between items-end">
                          <span className="text-2xl font-bold">€5.0</span>
                          <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center">
                              <ArrowDown size={18} className="-rotate-90"/>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            
            {/* Minimalist Floating Elements - Hidden on small mobile to avoid clutter */}
            <div className="absolute top-1/3 -right-4 lg:-right-4 bg-white p-4 rounded-2xl shadow-glass border border-gray-100 z-20 animate-float hidden sm:block">
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Revenue</div>
               <div className="text-3xl font-black text-brand-dark">+35%</div>
            </div>

             <div className="absolute bottom-24 -left-4 lg:-left-8 bg-brand-green-dark p-4 rounded-2xl shadow-2xl z-20 animate-float animation-delay-2000 hidden sm:block">
               <div className="text-xs font-bold text-brand-green-light/60 uppercase tracking-wider mb-1">Efficiency</div>
               <div className="text-3xl font-black text-white">10s<span className="text-sm font-normal text-white/60 ml-1">/cup</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
