import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { EditableText, EditableImage } from './ui/Editable';
import { Plus, Trash2 } from 'lucide-react';

export const MenuSection = () => {
  const { content, updateMenuItem, addMenuItem, deleteMenuItem, isAdmin, updateSection, language } = useContent();
  const { menu, menuSection } = content;

  return (
    <div id="menu" className="py-32 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-brand-green-medium font-bold tracking-widest text-xs uppercase mb-3 block">
             <EditableText value={menuSection.tagline[language]} onSave={(val) => updateSection('menuSection', 'tagline', val)} />
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6">
             <EditableText value={menuSection.title[language]} onSave={(val) => updateSection('menuSection', 'title', val)} />
          </h2>
          <div className="w-16 h-1 bg-brand-green-medium mx-auto rounded-full mb-6 opacity-30"></div>
          <div className="text-brand-green-medium/80 max-w-2xl mx-auto text-lg font-light leading-relaxed">
             <EditableText value={menuSection.description[language]} onSave={(val) => updateSection('menuSection', 'description', val)} multiline />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {menu.map((item) => (
            <div key={item.id} className="group relative flex flex-col h-full bg-transparent hover:bg-white rounded-3xl p-4 transition-all duration-500 hover:shadow-xl hover:shadow-brand-green-dark/5 border border-transparent hover:border-brand-green-dark/5">
              
              {/* Admin: Delete Button */}
              {isAdmin && (
                <button 
                  onClick={() => deleteMenuItem(item.id)}
                  className="absolute -top-3 -right-3 z-50 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:scale-110"
                  title="删除此产品"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative mb-6 rounded-2xl overflow-hidden aspect-[4/5] bg-[#F2F0E9]">
                 <EditableImage 
                   src={item.image} 
                   alt={item.name[language]} 
                   className="w-full h-full"
                   onSave={(newUrl) => updateMenuItem(item.id, 'image', newUrl)}
                 />
                 
                 {/* Badge */}
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-dark text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    <EditableText value={item.tag[language]} onSave={(val) => updateMenuItem(item.id, 'tag', val)} />
                 </div>
              </div>

              <div className="px-2 flex flex-col flex-grow">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-green-dark transition-colors">
                      <EditableText value={item.name[language]} onSave={(val) => updateMenuItem(item.id, 'name', val)} />
                    </h3>
                    <span className="text-lg font-serif italic text-brand-dark">
                      <EditableText value={item.price} onSave={(val) => updateMenuItem(item.id, 'price', val)} />
                    </span>
                  </div>
                  
                  <div className="text-brand-green-light text-[10px] font-bold uppercase tracking-wider mb-3">
                    <EditableText value={item.eng} onSave={(val) => updateMenuItem(item.id, 'eng', val)} />
                  </div>
                  
                  <div className="text-brand-green-medium/80 text-sm leading-relaxed mb-4 flex-grow line-clamp-3 font-light">
                    <EditableText value={item.desc[language]} onSave={(val) => updateMenuItem(item.id, 'desc', val)} multiline />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-brand-green-dark/5 group-hover:border-transparent transition-colors">
                    {item.ingredients.map((ing, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-[#F2F0E9] rounded text-brand-green-medium/70 font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
              </div>
            </div>
          ))}

          {/* Admin: Add New Product Card */}
          {isAdmin && (
            <div 
              onClick={addMenuItem}
              className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-brand-green-medium/30 rounded-3xl cursor-pointer hover:bg-brand-green-medium/5 hover:border-brand-green-medium transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-green-medium group-hover:scale-110 transition-transform mb-4">
                 <Plus size={32} />
              </div>
              <h3 className="font-bold text-brand-green-dark">新增产品</h3>
              <p className="text-xs text-brand-green-medium/70 mt-1">点击添加卡片</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};