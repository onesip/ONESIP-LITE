
import React from 'react';
import { TrendingUp, Zap, Store, ArrowUpRight } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

interface FeatureCardProps {
  icon: any;
  title: string;
  desc: string;
  index: number;
  onSaveTitle: (val: string) => void;
  onSaveDesc: (val: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc, index, onSaveTitle, onSaveDesc }) => (
  <div className="group relative bg-white rounded-[32px] p-10 border border-brand-green-dark/5 shadow-sm hover:shadow-2xl hover:shadow-brand-green-dark/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
    {/* Decorative Number */}
    <div className="absolute -top-6 -right-6 text-[120px] font-black text-brand-green-pale/10 leading-none select-none group-hover:text-brand-green-pale/20 transition-colors">
      0{index + 1}
    </div>

    <div className="mb-8 w-16 h-16 rounded-2xl bg-brand-cream border border-brand-green-dark/5 flex items-center justify-center text-brand-green-dark group-hover:bg-brand-green-dark group-hover:text-brand-cream transition-colors duration-300 relative z-10">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-brand-dark mb-4 tracking-tight flex items-center gap-2">
        <EditableText value={title} onSave={onSaveTitle} />
        <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-green-medium"/>
      </h3>
      <div className="text-brand-green-medium/90 leading-relaxed font-light text-base">
         <EditableText value={desc} onSave={onSaveDesc} multiline />
      </div>
    </div>
    
    {/* Bottom Line Accent */}
    <div className="absolute bottom-0 left-0 w-0 h-1 bg-brand-green-dark transition-all duration-500 group-hover:w-full"></div>
  </div>
);

export const ModelSection = () => {
  const { content, updateSection, updateSectionItem } = useContent();
  const { model } = content;
  
  // Icons are still hardcoded as they affect layout structure, but text is dynamic
  const icons = [TrendingUp, Zap, Store];

  return (
    <div id="model" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-green-medium font-bold tracking-widest text-xs uppercase mb-4 block">
                <EditableText value={model.tagline} onSave={(val) => updateSection('model', 'tagline', val)} />
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight">
                <EditableText value={model.title} onSave={(val) => updateSection('model', 'title', val)} multiline />
            </h2>
          </div>
          <div className="text-lg text-brand-green-medium font-light max-w-md leading-relaxed pb-2">
             <EditableText value={model.description} onSave={(val) => updateSection('model', 'description', val)} multiline />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {model.items.map((item, i) => (
            <FeatureCard 
              key={i}
              index={i}
              icon={icons[i] || TrendingUp}
              title={item.title}
              desc={item.desc}
              onSaveTitle={(val) => updateSectionItem('model', i, 'title', val)}
              onSaveDesc={(val) => updateSectionItem('model', i, 'desc', val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
