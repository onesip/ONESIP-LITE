
import React from 'react';
import { TrendingUp, Zap, Store } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

interface FeatureItemProps {
  icon: any;
  title: string;
  desc: string;
  index: number;
  onSaveTitle: (val: string) => void;
  onSaveDesc: (val: string) => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, desc, index, onSaveTitle, onSaveDesc }) => (
  <div className="flex flex-col gap-6 p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-brand-dark shadow-sm">
      <Icon size={24} strokeWidth={2} />
    </div>
    
    <div>
      <h3 className="text-xl font-bold text-brand-dark mb-3 tracking-tight">
        <EditableText value={title} onSave={onSaveTitle} />
      </h3>
      {/* High Contrast Gray */}
      <div className="text-gray-700 leading-relaxed text-sm font-medium">
         <EditableText value={desc} onSave={onSaveDesc} multiline />
      </div>
    </div>
    
    <div className="mt-auto pt-6 border-t border-gray-200 text-xs font-bold text-gray-400 font-mono">
        0{index + 1}
    </div>
  </div>
);

export const ModelSection = () => {
  const { content, updateSection, updateSectionItem } = useContent();
  const { model } = content;
  
  const icons = [TrendingUp, Zap, Store];

  return (
    <div id="model" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 md:mb-24 items-end">
          <div>
            <div className="flex items-center gap-3 mb-6">
                 <span className="h-px w-8 bg-brand-dark"></span>
                 <span className="text-xs font-bold tracking-widest uppercase text-brand-dark">
                    <EditableText value={model.tagline} onSave={(val) => updateSection('model', 'tagline', val)} />
                 </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight tracking-tight">
                <EditableText value={model.title} onSave={(val) => updateSection('model', 'title', val)} multiline />
            </h2>
          </div>
          <div className="text-lg text-gray-700 font-normal leading-relaxed md:pl-10 border-l-2 border-gray-100">
             <EditableText value={model.description} onSave={(val) => updateSection('model', 'description', val)} multiline />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {model.items.map((item, i) => (
            <FeatureItem 
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
