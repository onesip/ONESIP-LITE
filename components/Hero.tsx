
import React from 'react';
import { Leaf, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import { LogoSymbol } from './BrandLogo';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const { content, updateHero } = useContent();
  const { hero } = content;

  return (
    <div id="hero" className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-brand-cream selection:bg-brand-green-light selection:text-brand-green-dark">
      {/* Abstract Geometric Background (Vercel Style) */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-brand-surface to-white opacity-80"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          
          {/* Left Content */}
          <div className="md:w-1/2 space-y-8 animate-fade-in-up">
            
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-dark text-[11px] font-bold uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green-medium mr-2 animate-pulse"></span>
              <EditableText 
                value={hero.tagline} 
                onSave={(val) => updateHero('tagline', val)} 
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-brand-dark leading-[1.05] tracking-tight">
              <EditableText 
                value={hero.titleLine1} 
                onSave={(val) => updateHero('titleLine1', val)} 
                tag="span"
                className="block"
              />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-dark to-brand-green-medium block relative pb-2">
                 <EditableText 
                  value={hero.titleLine2} 
                  onSave={(val) => updateHero('titleLine2', val)} 
                  tag="span"
                />
              </span>
            </h1>
            
            <div className="space-y-6">
              <div className="text-xl md:text-2xl text-brand-gray font-semibold tracking-tight">
                 <span>人人皆宜，时刻尽享</span>
                 <span className="mx-2 text-brand-border">|</span>
                 <span className="text-brand-dark">
                   <EditableText value={hero.subtitle} onSave={(val) => updateHero('subtitle', val)} />
                 </span>
              </div>
              <div className="text-lg text-brand-gray leading-relaxed max-w-lg font-light">
                 <EditableText 
                  value={hero.description} 
                  onSave={(val) => updateHero('description', val)} 
                  multiline={true}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => scrollToSection('financials')}
                className="px-8 py-3.5 bg-brand-dark text-white rounded-lg font-bold text-sm hover:bg-black transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ring-1 ring-transparent group"
              >
                <Calculator size={16} className="text-brand-green-light" /> 
                <EditableText value={hero.buttonText} onSave={(val) => updateHero('buttonText', val)} />
                <ArrowRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </button>
              
              <div className="flex items-center px-6 py-3.5 rounded-lg border border-brand-border bg-white text-sm font-medium text-brand-dark shadow-sm">
                <CheckCircle2 size={16} className="mr-2 text-brand-green-medium"/> 
                <EditableText value={hero.trustText} onSave={(val) => updateHero('trustText', val)} />
              </div>
            </div>
          </div>

          {/* Right Visual (Mockup - Clean Style) */}
          <div className="md:w-1/2 relative flex justify-center md:justify-end perspective-1000">
            {/* The Device */}
            <div className="relative w-[340px] h-[620px] bg-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border-[8px] border-brand-dark flex flex-col overflow-hidden transform rotate-y-[-5deg] hover:rotate-0 transition-transform duration-700 ease-out z-10">
              
              {/* Screen Content */}
              <div className="h-full bg-brand-surface relative flex flex-col">
                {/* Header UI */}
                <div className="p-6 pb-2 flex justify-between items-center bg-white/50 backdrop-blur border-b border-brand-border">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-md bg-brand-green-dark flex items-center justify-center text-white">
                        <LogoSymbol className="w-4 h-4"/>
                     </div>
                     <div className="text-brand-dark font-bold text-sm tracking-tight">ONESIP</div>
                   </div>
                </div>

                {/* Hero Product on Screen */}
                <div className="flex-1 px-6 py-4 flex flex-col relative">
                   <div className="relative z-10 w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm mb-6 border border-brand-border bg-white">
                      <img src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80" alt="Drink" className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-[10px] font-bold text-brand-dark border border-brand-border shadow-sm">
                        TOP 1
                      </div>
                   </div>
                   
                   <div className="space-y-1">
                     <h3 className="text-xl font-bold text-brand-dark">泰奶咸法酪</h3>
                     <p className="text-xs text-brand-gray font-medium">Thai Tea Salty Cheese</p>
                   </div>
                   
                   <div className="mt-auto flex items-center justify-between pt-6 border-t border-brand-border">
                      <span className="text-2xl font-bold text-brand-dark tracking-tighter">€5.0</span>
                      <button className="h-10 w-10 bg-brand-dark rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition active:scale-95">
                        <ArrowRight size={16} />
                      </button>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Floating Statistic Card 1 (Clean) */}
            <div className="absolute top-32 -left-10 bg-white p-4 rounded-xl shadow-glass border border-brand-border animate-float flex items-center gap-3 z-20">
               <div className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-brand-green-dark border border-brand-border">
                 <Leaf size={14} />
               </div>
               <div>
                  <div className="text-[9px] text-brand-gray uppercase font-bold tracking-wider">Revenue</div>
                  <div className="text-xl font-bold text-brand-dark leading-none">+35%</div>
               </div>
            </div>

             {/* Floating Statistic Card 2 (Clean) */}
            <div className="absolute bottom-24 -right-6 bg-brand-green-dark p-4 rounded-xl shadow-xl animate-float animation-delay-2000 flex items-center gap-3 z-20">
               <div>
                  <div className="text-[9px] text-brand-green-light/70 uppercase font-bold tracking-wider text-right">Speed</div>
                  <div className="text-xl font-bold text-white leading-none">10s<span className="text-xs font-normal text-brand-green-light ml-1">/cup</span></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
