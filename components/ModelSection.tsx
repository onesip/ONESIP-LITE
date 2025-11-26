
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
  <div className="group relative bg-white rounded-2xl p-8 border border-brand-border shadow-subtle hover:shadow-glass hover:border-brand-dark/10 transition-all duration-300 flex flex-col h-full">
    {/* Minimalist Index */}
    <div className="absolute top-8 right-8 text-4xl font-black text-brand-surface leading-none select-none">
      0{index + 1}
    </div>

    <div className="mb-6 w-12 h-12 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-colors duration-300 relative z-10">
      <Icon size={20} strokeWidth={2} />
    </div>
    
    <div className="relative z-10">
      <h3 className="text-xl font-bold text-brand-dark mb-3 tracking-tight flex items-center gap-2">
        <EditableText value={title} onSave={onSaveTitle} />
      </h3>
      <div className="text-brand-gray leading-relaxed font-normal text-sm">
         <EditableText value={desc} onSave={onSaveDesc} multiline />
      </div>
    </div>
  </div>
);

export const ModelSection = () => {
  const { content, updateSection, updateSectionItem } = useContent();
  const { model } = content;
  
  const icons = [TrendingUp, Zap, Store];

  return (
    <div id="model" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 pb-8 border-b border-brand-border">
          <div className="max-w-2xl">
            <span className="text-brand-dark font-bold tracking-widest text-xs uppercase mb-3 block opacity-40">
                <EditableText value={model.tagline} onSave={(val) => updateSection('model', 'tagline', val)} />
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark leading-tight">
                <EditableText value={model.title} onSave={(val) => updateSection('model', 'title', val)} multiline />
            </h2>
          </div>
          <div className="text-base text-brand-gray font-normal max-w-md leading-relaxed pb-2">
             <EditableText value={model.description} onSave={(val) => updateSection('model', 'description', val)} multiline />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
