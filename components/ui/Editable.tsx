
import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { Edit2, Image as ImageIcon, Grid, X, Check } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  multiline?: boolean;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onSave, 
  className = "", 
  multiline = false,
  tag: Tag = 'span' 
}) => {
  const { isAdmin } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const inputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onSave(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
  };

  const safeValue = value || "";

  if (!isAdmin) {
    return <Tag className={className} dangerouslySetInnerHTML={{__html: safeValue.replace(/\n/g, '<br/>')}} />;
  }

  if (isEditing) {
    const commonClasses = `bg-white text-brand-dark outline-none border-2 border-brand-green-medium rounded px-1 w-full ${className}`;
    
    if (multiline) {
      return (
        <textarea
          ref={inputRef as any}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          className={commonClasses}
          rows={4}
        />
      );
    }
    return (
      <input
        ref={inputRef as any}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={commonClasses}
      />
    );
  }

  return (
    <Tag 
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:bg-brand-green-medium/10 hover:outline-dashed hover:outline-2 hover:outline-brand-green-medium/50 rounded transition-all relative`}
      title="点击编辑"
    >
      {safeValue.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < safeValue.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
      <span className="absolute -top-3 -right-3 bg-brand-green-dark text-white p-1 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none scale-75">
        <Edit2 size={10} />
      </span>
    </Tag>
  );
};

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (newUrl: string) => void;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({ src, alt, onSave, className }) => {
  const { isAdmin, content } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [url, setUrl] = useState(src);

  const handleSave = () => {
    onSave(url);
    setIsEditing(false);
  };

  const handleSelectFromLibrary = (selectedUrl: string) => {
      setUrl(selectedUrl);
      setShowLibrary(false);
  };

  if (!isAdmin) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className={`relative group ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      
      {/* Overlay for Admin */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 z-20">
         <button 
           onClick={() => setIsEditing(true)}
           className="bg-brand-cream text-brand-dark px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform"
         >
           <ImageIcon size={14} /> 更换图片
         </button>
      </div>

      {isEditing && (
        <div className="absolute inset-0 z-50 bg-brand-green-dark/95 p-4 flex flex-col justify-center items-center gap-3 animate-fade-in">
          <p className="text-white text-xs font-bold">更换图片 (URL 或 媒体库)</p>
          
          <div className="flex gap-2 w-full">
               <input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 text-xs p-2 rounded text-black outline-none"
                placeholder="https://..."
              />
              <button 
                onClick={() => setShowLibrary(true)}
                className="bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded flex items-center justify-center"
                title="从媒体库选择"
              >
                  <Grid size={16} />
              </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-brand-cream text-brand-green-dark px-3 py-1.5 rounded text-xs font-bold">保存</button>
            <button onClick={() => setIsEditing(false)} className="bg-transparent border border-white text-white px-3 py-1.5 rounded text-xs">取消</button>
          </div>
        </div>
      )}

      {/* FULL SCREEN LIBRARY PICKER MODAL */}
      {showLibrary && (
          <div className="fixed inset-0 z-[10000] bg-black/90 flex flex-col animate-fade-in p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-xl flex items-center gap-2">
                      <Grid size={24} className="text-brand-green-medium"/> 选择一张图片
                  </h3>
                  <button onClick={() => setShowLibrary(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white">
                      <X size={24} />
                  </button>
              </div>
              
              <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
                   {/* Fallback if library is empty */}
                   {(!content.library || content.library.length === 0) && (
                       <div className="col-span-full text-center text-gray-500 py-20">
                           媒体库是空的。请先去【控制台 - 媒体图库】上传图片。
                       </div>
                   )}

                   {(content.library || []).map((libImg, idx) => (
                       <div 
                         key={idx} 
                         onClick={() => handleSelectFromLibrary(libImg)}
                         className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${url === libImg ? 'border-brand-green-medium ring-2 ring-brand-green-medium/50' : 'border-white/10 hover:border-white'}`}
                       >
                           <img src={libImg} alt={`Lib ${idx}`} className="w-full h-full object-cover" />
                           {url === libImg && (
                               <div className="absolute top-2 right-2 bg-brand-green-medium text-white rounded-full p-1 shadow-lg">
                                   <Check size={12} strokeWidth={4} />
                               </div>
                           )}
                       </div>
                   ))}
              </div>
          </div>
      )}
    </div>
  );
};
