import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';
import { Check, Minus, ArrowRight, AlertCircle } from 'lucide-react';
import { LocalizedText } from '../types';

export const ComparisonSection = () => {
  const { content, updateSection, language } = useContent();
  const { comparison } = content;

  // Modern Check Icon
  const IconCheck = ({ active = false }: { active?: boolean }) => (
      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${active ? 'bg-brand-dark text-white' : 'bg-gray-200 text-gray-400'}`}>
          <Check size={12} strokeWidth={3} />
      </div>
  );

  // Modern DIY Icon
  const IconDIY = () => (
      <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 border border-gray-200">
          {language === 'zh' ? '自备' : 'Self-prep'}
      </span>
  );

  return (
    <div id="comparison" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4 block">
                <EditableText value={comparison.tagline[language]} onSave={(val) => updateSection('comparison', 'tagline', val)} />
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight">
                <EditableText value={comparison.title[language]} onSave={(val) => updateSection('comparison', 'title', val)} multiline />
            </h2>
            <div className="max-w-2xl mx-auto text-lg text-gray-700 font-normal leading-relaxed">
                <EditableText value={comparison.description[language]} onSave={(val) => updateSection('comparison', 'description', val)} multiline />
            </div>
        </div>

        {/* Comparison Table Container */}
        <div className="relative">
            {/* Mobile Scroll Hint */}
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 flex items-center justify-end">
                <ArrowRight size={16} className="text-brand-dark opacity-20 animate-pulse"/>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-[800px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 mb-6 px-4">
                        <div className="col-span-4"></div> {/* Spacer */}
                        <div className="col-span-2 text-center pb-4">
                            <span className="text-sm font-bold text-gray-600">
                                <EditableText value={comparison.col1Title[language]} onSave={(val) => updateSection('comparison', 'col1Title', val)} />
                            </span>
                        </div>
                        {/* Highlighted Header */}
                        <div className="col-span-4 text-center pb-4 relative">
                            <div className="absolute top-0 left-0 right-0 -bottom-4 bg-[#F5F5F7] rounded-t-2xl -z-10 transform scale-x-105 scale-y-110 origin-bottom shadow-sm"></div>
                            <span className="text-lg font-black text-brand-dark block">
                                <EditableText value={comparison.col2Title[language]} onSave={(val) => updateSection('comparison', 'col2Title', val)} />
                            </span>
                            <span className="text-[10px] font-bold text-brand-green-medium uppercase tracking-wider">
                                {language === 'zh' ? '推荐' : 'Recommended'}
                            </span>
                        </div>
                        <div className="col-span-2 text-center pb-4">
                            <span className="text-sm font-bold text-gray-600">
                                <EditableText value={comparison.col3Title[language]} onSave={(val) => updateSection('comparison', 'col3Title', val)} />
                            </span>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="space-y-12">
                        {comparison.categories.map((cat, catIdx) => (
                            <div key={catIdx}>
                                {/* Category Title */}
                                <div className="flex items-center gap-4 mb-6 px-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-dark bg-white pr-4 z-10">
                                        {cat.title[language]}
                                    </h4>
                                    <div className="h-px flex-1 bg-gray-200"></div>
                                </div>

                                {/* Rows */}
                                <div className="space-y-1">
                                    {cat.items.map((item, rowIdx) => {
                                        // Safely extract Chinese name for logic checks, handling legacy string data
                                        const itemNameZh = typeof item.name === 'string' 
                                            ? item.name 
                                            : (item.name?.zh || "");

                                        return (
                                        <div key={rowIdx} className="grid grid-cols-12 items-center py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors group relative">
                                            
                                            {/* Highlight Background for Middle Column */}
                                            <div className="absolute inset-y-0 left-[50%] right-[16.66%] bg-[#F5F5F7] -z-10 group-hover:bg-[#EBEBEF] transition-colors"></div>

                                            {/* Item Name */}
                                            <div className="col-span-4 text-sm font-bold text-gray-800 group-hover:text-black">
                                                {item.name[language]}
                                            </div>
                                            
                                            {/* Rental */}
                                            <div className="col-span-2 flex justify-center">
                                                {item.rental ? <IconCheck /> : <Minus size={14} className="text-gray-300"/>}
                                            </div>

                                            {/* ONESIP LITE (Middle) */}
                                            <div className="col-span-4 flex justify-center">
                                                {item.lite === 'Y' && <IconCheck active />}
                                                {item.lite === 'S' && <IconDIY />}
                                                {item.lite === 'N' && <Minus size={14} className="text-gray-300"/>}
                                            </div>

                                            {/* DIY */}
                                            <div className="col-span-2 flex justify-center">
                                                {item.self ? (
                                                    (itemNameZh.includes("机器") || itemNameZh.includes("机") || itemNameZh.includes("Machine")) 
                                                        ? <span className="text-[10px] text-gray-500 font-medium">{language === 'zh' ? '需购买' : 'Purchase'}</span> 
                                                        : <IconCheck />
                                                ) : <Minus size={14} className="text-gray-300"/>}
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Footer Notes */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl flex flex-col md:flex-row gap-6 text-xs text-gray-600 font-medium border border-gray-200">
             <div className="flex gap-2">
                 <AlertCircle size={14} className="shrink-0 mt-0.5" />
                 <EditableText value={comparison.note1[language]} onSave={(val) => updateSection('comparison', 'note1', val)} />
             </div>
             <div className="flex gap-2">
                 <AlertCircle size={14} className="shrink-0 mt-0.5" />
                 <EditableText value={comparison.note2[language]} onSave={(val) => updateSection('comparison', 'note2', val)} />
             </div>
        </div>

      </div>
    </div>
  );
};