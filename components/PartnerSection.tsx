
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

export const PartnerSection = () => {
  const { content, updateSection, updateSectionItem, openLeadForm } = useContent();
  const { partner } = content;

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-green-dark rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-brand-cream mb-8">
                <EditableText value={partner.title} onSave={(val) => updateSection('partner', 'title', val)} />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-12">
              {partner.items.map((req, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-start hover:bg-white/10 transition-colors">
                  <CheckCircle2 className="text-brand-green-pale mr-4 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-white font-bold text-sm">
                        <EditableText value={req.title} onSave={(val) => updateSectionItem('partner', i, 'title', val)} />
                    </div>
                    <div className="text-brand-green-pale text-xs mt-1">
                        <EditableText value={req.desc} onSave={(val) => updateSectionItem('partner', i, 'desc', val)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
                onClick={openLeadForm}
                className="bg-brand-cream text-brand-green-dark text-lg px-12 py-5 rounded-2xl font-bold shadow-2xl hover:bg-white transition transform hover:scale-105"
            >
               <EditableText value={partner.buttonText} onSave={(val) => updateSection('partner', 'buttonText', val)} />
            </button>
            <p className="text-brand-green-light text-xs mt-6 opacity-70">
               <EditableText value={partner.disclaimer} onSave={(val) => updateSection('partner', 'disclaimer', val)} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
