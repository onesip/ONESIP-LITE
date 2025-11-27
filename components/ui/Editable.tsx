import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { Edit2, Image as ImageIcon } from 'lucide-react';

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
  const { isAdmin } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(src);

  const handleSave = () => {
    onSave(url);
    setIsEditing(false);
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
          <p className="text-white text-xs font-bold">粘贴新的图片 URL</p>
          
          <div className="flex gap-2 w-full">
               <input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 text-xs p-2 rounded text-black outline-none"
                placeholder="https://..."
              />
          </div>
          
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-brand-cream text-brand-green-dark px-3 py-1.5 rounded text-xs font-bold">保存</button>
            <button onClick={() => setIsEditing(false)} className="bg-transparent border border-white text-white px-3 py-1.5 rounded text-xs">取消</button>
          </div>
        </div>
      )}
    </div>
  );
};