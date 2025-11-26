
import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';
import { Check, X, Store, DollarSign, HelpCircle, AlertCircle } from 'lucide-react';

export const ComparisonSection = () => {
  const { content, updateSection } = useContent();
  const { comparison } = content;

  // Helper to render the status icon/text based on 'Y' | 'N' | 'S'
  const StatusCell = ({ status, isLite }: { status: 'Y' | 'N' | 'S', isLite?: boolean }) => {
    if (status === 'Y') {
      return (
        <div className="flex flex-col items-center justify-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLite ? 'bg-brand-green-dark text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Check size={16} strokeWidth={3} />
            </div>
            {isLite && <span className="text-[10px] font-bold text-brand-green-dark mt-1">品牌提供</span>}
        </div>
      );
    }
    if (status === 'S') {
        return (
            <div className="flex flex-col items-center justify-center text-brand-green-medium/70">
                <Store size={20} />
                <span className="text-[10px] font-medium mt-1">店家自备</span>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center">
            <span className="w-4 h-1 bg-gray-200 rounded-full"></span>
        </div>
    );
  };

  // Helper for boolean/DIY columns
  const BooleanCell = ({ isYes, isDIY }: { isYes: boolean, isDIY?: boolean }) => {
      if (isYes) {
           // For DIY, if it's "Yes", it usually means "You buy it yourself" ($$$)
           if (isDIY) {
                return (
                    <div className="flex flex-col items-center justify-center text-orange-500/70">
                        <DollarSign size={18} />
                        <span className="text-[10px] font-medium mt-1">自行购买</span>
                    </div>
                );
           }
           return (
            <div className="flex items-center justify-center">
                <Check size={18} className="text-gray-400" />
            </div>
           );
      }
      return (
        <div className="flex items-center justify-center">
             <span className="w-4 h-1 bg-gray-200 rounded-full"></span>
        </div>
      );
  };

  return (
    <div id="comparison" className="py-24 bg-white border-t border-brand-green-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
            <span className="text-brand-green-medium font-bold tracking-widest text-xs uppercase mb-4 block">
                <EditableText value={comparison.tagline} onSave={(val) => updateSection('comparison', 'tagline', val)} />
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 leading-tight">
                <EditableText value={comparison.title} onSave={(val) => updateSection('comparison', 'title', val)} multiline />
            </h2>
            <div className="max-w-2xl mx-auto text-lg text-brand-green-medium/80 font-light leading-relaxed">
                <EditableText value={comparison.description} onSave={(val) => updateSection('comparison', 'description', val)} multiline />
            </div>
        </div>

        {/* Matrix Container */}
        <div className="bg-[#F8F9FA] rounded-[32px] overflow-hidden shadow-xl border border-gray-100">
            
            {/* Sticky Table Header */}
            <div className="grid grid-cols-12 bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
                <div className="col-span-4 p-6 flex items-end">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">项目 / 权益</span>
                </div>
                <div className="col-span-2 p-4 flex flex-col items-center justify-end text-center pb-6 border-l border-gray-50">
                    <span className="text-sm font-bold text-gray-500">
                         <EditableText value={comparison.col1Title} onSave={(val) => updateSection('comparison', 'col1Title', val)} />
                    </span>
                </div>
                {/* Highlighted ONESIP Column */}
                <div className="col-span-4 bg-brand-green-dark p-6 flex flex-col items-center justify-center text-center relative -mt-4 pt-10 rounded-t-xl shadow-lg transform scale-105 z-10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-green-medium"></div>
                    <span className="text-xl font-black text-white tracking-tight">
                        <EditableText value={comparison.col2Title} onSave={(val) => updateSection('comparison', 'col2Title', val)} />
                    </span>
                    <span className="text-[10px] text-brand-green-light mt-1 font-medium tracking-widest uppercase">Best Choice</span>
                </div>
                <div className="col-span-2 p-4 flex flex-col items-center justify-end text-center pb-6 border-l border-gray-50 bg-gray-50/50">
                    <span className="text-sm font-bold text-gray-500">
                        <EditableText value={comparison.col3Title} onSave={(val) => updateSection('comparison', 'col3Title', val)} />
                    </span>
                </div>
            </div>

            {/* Matrix Body */}
            {comparison.categories.map((cat, catIdx) => (
                <div key={catIdx}>
                    {/* Category Header */}
                    <div className="grid grid-cols-12 bg-gray-100/50 py-3 px-6 border-y border-gray-100">
                        <div className="col-span-12 font-bold text-sm text-brand-dark uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-green-medium"></span>
                            {cat.title}
                        </div>
                    </div>

                    {/* Rows */}
                    {cat.items.map((item, rowIdx) => (
                         <div key={rowIdx} className="grid grid-cols-12 hover:bg-white transition-colors group">
                            {/* Name */}
                            <div className="col-span-4 p-4 pl-6 flex items-center text-sm font-medium text-gray-700 border-b border-gray-100 group-hover:text-brand-dark">
                                {item.name}
                            </div>
                            
                            {/* Rental */}
                            <div className="col-span-2 p-4 flex items-center justify-center border-l border-b border-gray-50">
                                <BooleanCell isYes={item.rental} />
                            </div>

                            {/* ONESIP LITE (Highlighted) */}
                            <div className="col-span-4 p-4 flex items-center justify-center border-x border-b border-brand-green-dark/5 bg-brand-cream/30 group-hover:bg-brand-cream/60 transition-colors">
                                <StatusCell status={item.lite} isLite />
                            </div>

                            {/* DIY */}
                            <div className="col-span-2 p-4 flex items-center justify-center border-l border-b border-gray-100 bg-gray-50/30">
                                <BooleanCell isYes={item.self} isDIY />
                            </div>
                         </div>
                    ))}
                </div>
            ))}

            {/* Footer Notes */}
            <div className="bg-[#F2F0E9] p-8 border-t border-brand-green-dark/10">
                <div className="flex items-start gap-3 mb-3">
                     <AlertCircle size={16} className="text-brand-green-dark mt-0.5 shrink-0" />
                     <p className="text-xs text-brand-green-dark font-medium leading-relaxed">
                         <EditableText value={comparison.note1} onSave={(val) => updateSection('comparison', 'note1', val)} />
                     </p>
                </div>
                <div className="flex items-start gap-3">
                     <HelpCircle size={16} className="text-brand-green-medium mt-0.5 shrink-0" />
                     <p className="text-xs text-brand-green-medium leading-relaxed">
                         <EditableText value={comparison.note2} onSave={(val) => updateSection('comparison', 'note2', val)} />
                     </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
