
import React, { useRef, useState } from 'react';
import { TrendingUp, Zap, Store, Trash2, GripVertical, PlusCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

interface FeatureItemProps {
  icon: any;
  title: string;
  desc: string;
  index: number;
  item: any;
  onSaveTitle: (val: string) => void;
  onSaveDesc: (val: string) => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, desc, index, onSaveTitle, onSaveDesc }) => (
  <div className="flex flex-col gap-6 p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 h-full">
    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-brand-dark shadow-sm">
      <Icon size={24} strokeWidth={2} />
    </div>
    
    <div className="flex-grow">
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
  const { content, isAdmin, updateSection, updateSectionItem, addSectionItem, deleteSectionItem, reorderSectionItems, language } = useContent();
  const { model } = content;
  
  const icons = [TrendingUp, Zap, Store];

  // Drag and Drop State
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    reorderSectionItems('model', dragItem.current, dragOverItem.current);
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedOverIndex(null);
  };


  return (
    <div id="model" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 md:mb-24 items-end">
          <div>
            <div className="flex items-center gap-3 mb-6">
                 <span className="h-px w-8 bg-brand-dark"></span>
                 <span className="text-xs font-bold tracking-widest uppercase text-brand-dark">
                    <EditableText value={model.tagline[language]} onSave={(val) => updateSection('model', 'tagline', val)} />
                 </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight tracking-tight">
                <EditableText value={model.title[language]} onSave={(val) => updateSection('model', 'title', val)} multiline />
            </h2>
          </div>
          <div className="text-lg text-gray-700 font-normal leading-relaxed md:pl-10 border-l-2 border-gray-100">
             <EditableText value={model.description[language]} onSave={(val) => updateSection('model', 'description', val)} multiline />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {model.items.map((item, i) => (
            <div
              key={item.id}
              draggable={isAdmin}
              onDragStart={() => dragItem.current = i}
              onDragEnter={() => { dragOverItem.current = i; setDraggedOverIndex(i); }}
              onDragEnd={handleDragSort}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDraggedOverIndex(null)}
              className={`relative group transition-all duration-300 ${draggedOverIndex === i ? 'transform scale-105 bg-brand-green-medium/10 rounded-3xl' : ''}`}
            >
              {isAdmin && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-500 hover:text-black hover:bg-white rounded-full cursor-grab active:cursor-grabbing"><GripVertical size={16} /></button>
                      <button onClick={() => deleteSectionItem('model', item.id)} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-full"><Trash2 size={16} /></button>
                  </div>
              )}
              <FeatureItem 
                item={item}
                index={i}
                icon={icons[i] || TrendingUp}
                title={item.title[language]}
                desc={item.desc[language]}
                onSaveTitle={(val) => updateSectionItem('model', i, 'title', val)}
                onSaveDesc={(val) => updateSectionItem('model', i, 'desc', val)}
              />
            </div>
          ))}
          
          {isAdmin && (
              <button 
                onClick={() => addSectionItem('model')}
                className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-brand-green-medium/30 rounded-3xl cursor-pointer hover:bg-brand-green-medium/5 hover:border-brand-green-medium transition-all group"
              >
                  <PlusCircle size={32} className="text-brand-green-medium/50 group-hover:text-brand-green-medium transition-colors mb-2" />
                  <span className="text-sm font-bold text-brand-green-medium/70 group-hover:text-brand-green-medium">增加新模块</span>
              </button>
          )}
        </div>
      </div>
    </div>
  );
};
