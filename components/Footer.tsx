
import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Lock, Cloud, HardDrive, AlertCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

export const Footer = ({ onOpenAdmin }: { onOpenAdmin?: () => void }) => {
  const { content, updateSection, dataSource } = useContent();
  const { footer } = content;

  return (
    <footer id="contact" className="bg-brand-cream pt-20 pb-10 border-t border-brand-green-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-8">
              <BrandLogo />
            </div>
            <div className="text-brand-green-medium text-lg font-light max-w-md leading-relaxed">
              <EditableText value={footer.aboutText} onSave={(val) => updateSection('footer', 'aboutText', val)} multiline />
            </div>
          </div>
          
          <div>
            <h4 className="text-brand-dark font-bold mb-6">
                 <EditableText value={footer.contactTitle} onSave={(val) => updateSection('footer', 'contactTitle', val)} />
            </h4>
            <ul className="space-y-4 text-brand-green-medium font-light">
              <li><EditableText value={footer.email} onSave={(val) => updateSection('footer', 'email', val)} /></li>
              <li><EditableText value={footer.address} onSave={(val) => updateSection('footer', 'address', val)} /></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-brand-dark font-bold mb-6">
                <EditableText value={footer.resourceTitle} onSave={(val) => updateSection('footer', 'resourceTitle', val)} />
            </h4>
            <ul className="space-y-4 text-brand-green-medium font-light">
              {["招商手册", "设备参数表", "隐私政策"].map((link, i) => (
                <li key={i} className="hover:text-brand-green-dark cursor-pointer transition underline decoration-transparent hover:decoration-brand-green-dark">{link}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-green-light/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-green-light">
          <div className="flex flex-col md:flex-row items-center gap-4">
             <p><EditableText value={footer.copyright} onSave={(val) => updateSection('footer', 'copyright', val)} /></p>
             
             {/* CONNECTION STATUS INDICATOR (Enhanced Visibility) */}
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-green-dark/10 shadow-sm" title={`当前数据源: ${dataSource}`}>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status:</span>
                {dataSource === 'cloud' && (
                    <div className="flex items-center gap-1.5 text-green-600">
                        <Cloud size={12} fill="currentColor" className="opacity-20"/>
                        <span className="text-[10px] font-bold">ONLINE</span>
                    </div>
                )}
                {dataSource === 'local' && (
                    <div className="flex items-center gap-1.5 text-orange-500">
                        <HardDrive size={12} />
                        <span className="text-[10px] font-bold">LOCAL</span>
                    </div>
                )}
                {dataSource === 'default' && (
                    <div className="flex items-center gap-1.5 text-red-400">
                        <AlertCircle size={12} />
                        <span className="text-[10px] font-bold">OFFLINE</span>
                    </div>
                )}
             </div>
          </div>
          
          {/* Admin Entry Point */}
          <button 
            onClick={onOpenAdmin}
            className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity mt-4 md:mt-0"
          >
            <Lock size={12} />
            <span>Admin Access</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
