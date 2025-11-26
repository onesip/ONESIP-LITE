
import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { EditableText, EditableImage } from './ui/Editable';
import { MapPin, ArrowUpRight } from 'lucide-react';

export const ShowcaseSection = () => {
  const { content, updateSection, updateSectionItem } = useContent();
  const { showcase } = content;

  return (
    <div id="showcase" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
                 <span className="h-px w-8 bg-brand-dark"></span>
                 <span className="text-xs font-bold tracking-widest uppercase text-brand-dark">
                    <EditableText value={showcase.tagline} onSave={(val) => updateSection('showcase', 'tagline', val)} />
                 </span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
             <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight tracking-tight max-w-2xl">
                <EditableText value={showcase.title} onSave={(val) => updateSection('showcase', 'title', val)} multiline />
            </h2>
            <div className="text-gray-500 max-w-sm leading-relaxed font-light text-sm">
                 <EditableText value={showcase.description} onSave={(val) => updateSection('showcase', 'description', val)} multiline />
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showcase.items.map((item, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                    {/* Image */}
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                         <EditableImage 
                            src={item.image || ""} 
                            alt={item.title} 
                            onSave={(url) => updateSectionItem('showcase', i, 'image', url)}
                            className="w-full h-full object-cover"
                         />
                    </div>
                    
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    {/* Content */}
                    <div className="absolute top-6 left-6">
                        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/20">
                             <MapPin size={10} />
                             <EditableText value={item.tag || "Location"} onSave={(val) => updateSectionItem('showcase', i, 'tag', val)} />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="text-white mb-1 font-bold text-xl flex items-center justify-between">
                             <EditableText value={item.title} onSave={(val) => updateSectionItem('showcase', i, 'title', val)} />
                             <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </div>
                        <div className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-4 group-hover:text-white">
                             <EditableText value={item.desc} onSave={(val) => updateSectionItem('showcase', i, 'desc', val)} multiline />
                        </div>
                        
                        {/* Stat Pill */}
                        <div className="inline-flex flex-col bg-brand-green-dark/90 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                             <span className="text-lg font-black text-white leading-none">
                                <EditableText value={item.statValue} onSave={(val) => updateSectionItem('showcase', i, 'statValue', val)} />
                             </span>
                             <span className="text-[9px] text-brand-green-light uppercase tracking-wider">
                                <EditableText value={item.statLabel} onSave={(val) => updateSectionItem('showcase', i, 'statLabel', val)} />
                             </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};
