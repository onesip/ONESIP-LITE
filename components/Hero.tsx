
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
    <div id="hero" className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-brand-cream selection:bg-brand-green-medium selection:text-white">
      {/* Subtle Texture/Background */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[#F2F0E9] rounded-l-[120px] skew-x-[-2deg] translate-x-32 z-0"></div>
      
      {/* Organic Blur */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-brand-green-pale/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          
          {/* Left Content */}
          <div className="md:w-1/2 space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-brand-green-dark/10 text-brand-green-dark text-[11px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand-green-medium mr-2 animate-pulse"></span>
              <EditableText 
                value={hero.tagline} 
                onSave={(val) => updateHero('tagline', val)} 
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-brand-dark leading-[1.05] tracking-tighter">
              <EditableText 
                value={hero.titleLine1} 
                onSave={(val) => updateHero('titleLine1', val)} 
                tag="span"
                className="block"
              />
              <span className="text-brand-green-dark relative block">
                 <EditableText 
                  value={hero.titleLine2} 
                  onSave={(val) => updateHero('titleLine2', val)} 
                  tag="span"
                />
                {/* Underline decoration */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-green-medium opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>
            
            <div className="space-y-6 border-l-2 border-brand-green-dark/10 pl-6">
              <div className="text-xl md:text-2xl text-brand-dark font-bold tracking-tight flex flex-wrap gap-2">
                 <span>人人皆宜，时刻尽享</span>
                 <span className="text-brand-green-dark">
                   <EditableText value={hero.subtitle} onSave={(val) => updateHero('subtitle', val)} />
                 </span>
              </div>
              <div className="text-lg text-brand-green-medium/80 leading-relaxed max-w-lg font-light">
                 <EditableText 
                  value={hero.description} 
                  onSave={(val) => updateHero('description', val)} 
                  multiline={true}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button 
                onClick={() => scrollToSection('financials')}
                className="px-8 py-4 bg-brand-green-dark hover:bg-brand-dark text-brand-cream rounded-xl font-bold text-lg shadow-xl shadow-brand-green-dark/10 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
              >
                <Calculator size={20} className="text-brand-green-pale" /> 
                <EditableText value={hero.buttonText} onSave={(val) => updateHero('buttonText', val)} />
                <ArrowRight size={18} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </button>
              
              <div className="flex items-center px-6 py-4 rounded-xl border border-brand-green-dark/5 bg-white/50 backdrop-blur text-sm font-medium text-brand-green-dark">
                <CheckCircle2 size={18} className="mr-2 text-brand-green-medium"/> 
                <EditableText value={hero.trustText} onSave={(val) => updateHero('trustText', val)} />
              </div>
            </div>
          </div>

          {/* Right Visual (Mockup) */}
          <div className="md:w-1/2 relative flex justify-center md:justify-end perspective-1000">
            {/* The Device */}
            <div className="relative w-[340px] h-[600px] bg-brand-dark rounded-[48px] shadow-2xl border-[12px] border-brand-dark flex flex-col overflow-hidden transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out ring-1 ring-white/10">
              
              {/* Screen Content */}
              <div className="h-full bg-[#F9F9F7] relative flex flex-col">
                {/* Header UI */}
                <div className="p-8 pb-4 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-brand-green-dark flex items-center justify-center text-white">
                        <LogoSymbol className="w-5 h-5"/>
                     </div>
                     <div className="text-brand-dark font-black text-xl tracking-tight leading-none">ONE<span className="text-brand-green-medium">SIP</span></div>
                   </div>
                   <div className="flex gap-1.5">
                     <div className="w-1.5 h-1.5 bg-brand-dark rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-brand-dark/30 rounded-full"></div>
                   </div>
                </div>

                {/* Hero Product on Screen */}
                <div className="flex-1 px-6 py-4 flex flex-col relative">
                   {/* Abstract background on screen */}
                   <div className="absolute top-20 left-0 right-0 h-64 bg-gradient-to-b from-brand-green-pale/20 to-transparent -skew-y-12"></div>
                   
                   <div className="relative z-10 w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg mb-6 group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80" alt="Drink" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-dark shadow-sm">
                        TOP 1
                      </div>
                   </div>
                   
                   <div className="space-y-1">
                     <h3 className="text-2xl font-black text-brand-dark">泰奶咸法酪</h3>
                     <p className="text-xs text-brand-green-medium font-medium">Thai Tea Salty Cheese</p>
                   </div>
                   
                   <div className="mt-auto flex items-center justify-between pt-6 border-t border-brand-dark/5">
                      <span className="text-3xl font-black text-brand-dark tracking-tighter">€5.0</span>
                      <button className="h-12 w-12 bg-brand-green-dark rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition active:scale-95">
                        <ArrowRight size={20} />
                      </button>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Floating Statistic Card 1 */}
            <div className="absolute top-40 -left-16 bg-white p-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-brand-green-dark/5 animate-float flex items-center gap-4 max-w-[200px]">
               <div className="w-10 h-10 rounded-full bg-brand-green-pale/30 flex items-center justify-center text-brand-green-dark">
                 <Leaf size={20} />
               </div>
               <div>
                  <div className="text-[10px] text-brand-green-medium uppercase font-bold tracking-wider">Revenue</div>
                  <div className="text-2xl font-black text-brand-dark leading-none">+35%</div>
               </div>
            </div>

             {/* Floating Statistic Card 2 */}
            <div className="absolute bottom-32 -right-10 bg-brand-green-dark p-5 rounded-2xl shadow-xl animate-float animation-delay-2000 flex items-center gap-4 max-w-[200px]">
               <div>
                  <div className="text-[10px] text-brand-green-light uppercase font-bold tracking-wider text-right">Speed</div>
                  <div className="text-2xl font-black text-white leading-none">10s<span className="text-sm font-normal text-brand-green-light ml-1">/cup</span></div>
               </div>
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                 <Calculator size={20} />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
