
import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { EditableText, EditableImage } from './ui/Editable';
import { MapPin, ArrowUpRight } from 'lucide-react';

export const ShowcaseSection = () => {
  const { content, updateSection, updateSectionItem } = useContent();
  const { showcase } = content;

  return (
    <div id="showcase" className="py-32 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-cream skew-x-12 translate-x-32"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-green-medium font-bold tracking-widest text-xs uppercase mb-4 block">
                <EditableText value={showcase.tagline} onSave={(val) => updateSection('showcase', 'tagline', val)} />
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight">
                <EditableText value={showcase.title} onSave={(val) => updateSection('showcase', 'title', val)} multiline />
            </h2>
          </div>
          <div className="text-lg text-brand-green-medium font-light max-w-md leading-relaxed pb-2">
             <EditableText value={showcase.description} onSave={(val) => updateSection('showcase', 'description', val)} multiline />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {showcase.items.map((item, i) => (
                <div key={i} className="group relative rounded-[32px] overflow-hidden aspect-[3/4] md:aspect-[4/5] shadow-lg cursor-pointer">
                    {/* Image Layer */}
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                         <EditableImage 
                            src={item.image || "https://images.unsplash.com/photo-1579027989536-b7b1f875659b"} 
                            alt={item.title} 
                            onSave={(url) => updateSectionItem('showcase', i, 'image', url)}
                            className="w-full h-full object-cover"
                         />
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                    {/* Top Location Tag */}
                    <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={12} />
                        <EditableText value={item.tag || "Location"} onSave={(val) => updateSectionItem('showcase', i, 'tag', val)} />
                    </div>

                    {/* Floating Stat Card (Hover Effect) */}
                    <div className="absolute top-6 right-6 translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                         <div className="bg-brand-green-dark text-white p-3 rounded-xl shadow-xl">
                             <div className="text-xl font-black leading-none">
                                <EditableText value={item.statValue} onSave={(val) => updateSectionItem('showcase', i, 'statValue', val)} />
                             </div>
                             <div className="text-[10px] text-brand-green-light mt-1">
                                <EditableText value={item.statLabel} onSave={(val) => updateSectionItem('showcase', i, 'statLabel', val)} />
                             </div>
                         </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                             <EditableText value={item.title} onSave={(val) => updateSectionItem('showcase', i, 'title', val)} />
                             <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-green-medium"/>
                        </h3>
                        <div className="text-gray-300 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none group-hover:text-white transition-colors">
                             <EditableText value={item.desc} onSave={(val) => updateSectionItem('showcase', i, 'desc', val)} multiline />
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};
