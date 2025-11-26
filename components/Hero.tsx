
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
    <div id="hero" className="relative min-h-[95vh] flex items-center pt-24 pb-20 overflow-hidden bg-brand-surface">
      {/* Soft Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-green-medium/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          
          {/* Left Content */}
          <div className="md:w-1/2 space-y-8 animate-fade-in-up">
            
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-brand-border text-brand-dark text-[10px] font-bold uppercase tracking-widest shadow-sm">
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
              <div className="text-lg text-brand-gray leading-relaxed max-w-lg font-normal">
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
                className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-sm hover:bg-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl ring-1 ring-transparent group"
              >
                <Calculator size={18} className="text-brand-green-medium" /> 
                <EditableText value={hero.buttonText} onSave={(val) => updateHero('buttonText', val)} />
                <ArrowRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </button>
              
              <div className="flex items-center px-6 py-4 rounded-full border border-brand-border bg-white text-sm font-medium text-brand-dark shadow-sm">
                <CheckCircle2 size={18} className="mr-2 text-brand-green-medium"/> 
                <EditableText value={hero.trustText} onSave={(val) => updateHero('trustText', val)} />
              </div>
            </div>
          </div>

          {/* Right Visual (Mockup - Apple Style) */}
          <div className="md:w-1/2 relative flex justify-center md:justify-end perspective-1000">
            {/* The Device */}
            <div className="relative w-[340px] h-[640px] bg-white rounded-[50px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-[8px] border-black flex flex-col overflow-hidden transform rotate-y-[-5deg] hover:rotate-0 transition-transform duration-700 ease-out z-10 ring-1 ring-black/5">
              
              {/* Screen Content */}
              <div className="h-full bg-brand-surface relative flex flex-col">
                {/* Header UI */}
                <div className="p-6 pb-2 flex justify-between items-center bg-white/80 backdrop-blur border-b border-brand-border pt-10">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-brand-green-dark flex items-center justify-center text-white">
                        <LogoSymbol className="w-4 h-4"/>
                     </div>
                     <div className="text-brand-dark font-bold text-base tracking-tight">ONESIP</div>
                   </div>
                </div>

                {/* Hero Product on Screen */}
                <div className="flex-1 px-6 py-4 flex flex-col relative">
                   <div className="relative z-10 w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-card mb-6 bg-white">
                      <img src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80" alt="Drink" className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-dark shadow-sm">
                        TOP 1
                      </div>
                   </div>
                   
                   <div className="space-y-1">
                     <h3 className="text-2xl font-bold text-brand-dark">泰奶咸法酪</h3>
                     <p className="text-sm text-brand-gray font-medium">Thai Tea Salty Cheese</p>
                   </div>
                   
                   <div className="mt-auto flex items-center justify-between pt-6 border-t border-brand-border">
                      <span className="text-3xl font-bold text-brand-dark tracking-tighter">€5.0</span>
                      <button className="h-12 w-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition active:scale-95">
                        <ArrowRight size={20} />
                      </button>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Floating Statistic Card 1 */}
            <div className="absolute top-40 -left-10 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-glass border border-white/40 animate-float flex items-center gap-4 z-20">
               <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-green-dark">
                 <Leaf size={18} />
               </div>
               <div>
                  <div className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">Daily Revenue</div>
                  <div className="text-2xl font-black text-brand-dark leading-none">+35%</div>
               </div>
            </div>

             {/* Floating Statistic Card 2 */}
            <div className="absolute bottom-32 -right-8 bg-black/90 backdrop-blur p-5 rounded-2xl shadow-2xl animate-float animation-delay-2000 flex items-center gap-4 z-20">
               <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-right">Avg Speed</div>
                  <div className="text-2xl font-bold text-white leading-none">10s<span className="text-xs font-normal text-gray-500 ml-1">/cup</span></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
