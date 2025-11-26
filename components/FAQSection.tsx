
import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FAQSection = () => {
  const { content, updateSection, updateSectionItem } = useContent();
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="py-24 bg-brand-cream border-t border-brand-green-dark/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
            <span className="text-brand-green-medium font-bold tracking-widest text-xs uppercase mb-4 block">
                <EditableText value={faq.tagline} onSave={(val) => updateSection('faq', 'tagline', val)} />
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4 leading-tight">
                <EditableText value={faq.title} onSave={(val) => updateSection('faq', 'title', val)} multiline />
            </h2>
            <p className="text-brand-green-medium/80 font-light">
                <EditableText value={faq.description} onSave={(val) => updateSection('faq', 'description', val)} multiline />
            </p>
        </div>

        <div className="space-y-4">
            {faq.items.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                    <div 
                        key={i} 
                        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                        ${isOpen ? 'shadow-lg border-brand-green-dark/20' : 'border-brand-green-dark/5 hover:border-brand-green-dark/20'}`}
                    >
                        <button 
                            onClick={() => toggleIndex(i)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className={`font-bold text-lg flex gap-4 ${isOpen ? 'text-brand-green-dark' : 'text-brand-dark'}`}>
                                <span className="text-brand-green-medium/30 font-serif italic">Q{i+1}.</span>
                                <EditableText value={item.question} onSave={(val) => updateSectionItem('faq', i, 'question', val)} />
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-brand-green-dark text-white' : 'bg-brand-cream text-brand-green-dark'}`}>
                                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </div>
                        </button>
                        
                        <div 
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="px-6 pb-6 pl-14 text-brand-green-medium leading-relaxed font-light">
                                <EditableText value={item.answer} onSave={(val) => updateSectionItem('faq', i, 'answer', val)} multiline />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

      </div>
    </div>
  );
};
