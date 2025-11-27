
import React, { useRef, useState } from 'react';
import { CheckCircle2, Trash2, GripVertical, PlusCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

export const PartnerSection = () => {
  const { content, isAdmin, updateSection, updateSectionItem, addSectionItem, deleteSectionItem, reorderSectionItems, openLeadForm, language } = useContent();
  const { partner } = content;

  // Drag and Drop State
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    reorderSectionItems('partner', dragItem.current, dragOverItem.current);
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedOverIndex(null);
  };

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-green-dark rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-brand-cream mb-8">
                <EditableText value={partner.title[language]} onSave={(val) => updateSection('partner', 'title', val)} />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-12">
              {partner.items.map((req, i) => (
                <div 
                  key={req.id}
                  draggable={isAdmin}
                  onDragStart={() => dragItem.current = i}
                  onDragEnter={() => { dragOverItem.current = i; setDraggedOverIndex(i); }}
                  onDragEnd={handleDragSort}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={() => setDraggedOverIndex(null)}
                  className={`relative group bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all
                    ${draggedOverIndex === i ? 'ring-2 ring-brand-green-medium' : ''}
                  `}
                >
                  {isAdmin && (
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/30 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-300 hover:text-white hover:bg-white/20 rounded-full cursor-grab active:cursor-grabbing"><GripVertical size={16} /></button>
                          <button onClick={() => deleteSectionItem('partner', req.id)} className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-full"><Trash2 size={16} /></button>
                      </div>
                  )}
                  <div className="flex items-start">
                    <CheckCircle2 className="text-brand-green-pale mr-4 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <div className="text-white font-bold text-sm">
                          <EditableText value={req.title[language]} onSave={(val) => updateSectionItem('partner', i, 'title', val)} />
                      </div>
                      <div className="text-brand-green-pale text-xs mt-1">
                          <EditableText value={req.desc[language]} onSave={(val) => updateSectionItem('partner', i, 'desc', val)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
               {isAdmin && (
                  <button 
                    onClick={() => addSectionItem('partner')}
                    className="flex flex-col items-center justify-center min-h-[100px] border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all group"
                  >
                      <PlusCircle size={24} className="text-white/30 group-hover:text-white transition-colors mb-1" />
                      <span className="text-xs font-bold text-white/50 group-hover:text-white">增加新要求</span>
                  </button>
              )}
            </div>

            <button 
                onClick={openLeadForm}
                className="bg-brand-cream text-brand-green-dark text-lg px-12 py-5 rounded-2xl font-bold shadow-2xl hover:bg-white transition transform hover:scale-105"
            >
               <EditableText value={partner.buttonText[language]} onSave={(val) => updateSection('partner', 'buttonText', val)} />
            </button>
            <p className="text-brand-green-light text-xs mt-6 opacity-70">
               <EditableText value={partner.disclaimer[language]} onSave={(val) => updateSection('partner', 'disclaimer', val)} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
