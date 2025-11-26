import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Zap, Gift, Scale } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

export const ProcessSection = () => {
  const { content, updateSection, updateProcessPhase, updateProcessPhaseDetail, language } = useContent();
  const { process } = content;
  const [activeTab, setActiveTab] = useState(0);

  const phaseIcons = [Gift, Zap, ShieldCheck];

  return (
    <div id="process" className="py-24 md:py-32 bg-brand-cream border-t border-brand-green-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20 max-w-3xl">
           <div className="w-12 h-1 bg-brand-green-dark mb-8"></div>
           <span className="text-brand-green-dark font-bold tracking-widest text-xs uppercase mb-4 block">
              <EditableText value={process.tagline[language]} onSave={(val) => updateSection('process', 'tagline', val)} />
           </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-8 leading-tight">
              <EditableText value={process.title[language]} onSave={(val) => updateSection('process', 'title', val)} multiline />
          </h2>
          {/* Enhanced Contrast */}
          <div className="text-brand-green-dark text-lg leading-relaxed font-normal opacity-90">
              <EditableText value={process.description[language]} onSave={(val) => updateSection('process', 'description', val)} multiline />
          </div>
        </div>

        {/* Tab Navigation (Mobile/Desktop) */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
            {process.phases.map((phase, idx) => {
                const Icon = phaseIcons[idx] || ShieldCheck;
                const isActive = activeTab === idx;
                return (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-1 p-6 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group
                            ${isActive 
                                ? 'bg-white shadow-xl border-brand-green-dark/10 scale-100 opacity-100 z-10 ring-1 ring-brand-green-dark/5' 
                                : 'bg-white/50 border-transparent hover:bg-white opacity-70 hover:opacity-100 scale-[0.98]'
                            }
                        `}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${isActive ? 'bg-brand-green-dark text-white' : 'bg-brand-green-dark/10 text-brand-green-dark'}`}>
                                <EditableText value={phase.badge[language]} onSave={(val) => updateProcessPhase(idx, 'badge', val)} />
                            </span>
                            <Icon size={20} className={isActive ? 'text-brand-green-dark' : 'text-gray-500'}/>
                        </div>
                        <h3 className={`text-xl font-bold mb-1 ${isActive ? 'text-brand-dark' : 'text-gray-600'}`}>
                            <EditableText value={phase.title[language]} onSave={(val) => updateProcessPhase(idx, 'title', val)} />
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                             <EditableText value={phase.subtitle[language]} onSave={(val) => updateProcessPhase(idx, 'subtitle', val)} />
                        </p>
                    </button>
                )
            })}
        </div>

        {/* Detailed Content Card */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-brand-green-dark/5 min-h-[500px] relative transition-all duration-500">
             {process.phases.map((phase, idx) => {
                 if (activeTab !== idx) return null;
                 
                 return (
                     <div key={idx} className="animate-fade-in flex flex-col md:flex-row h-full">
                         {/* Left: Benefits (The "Good" Stuff) */}
                         <div className="md:w-3/5 p-8 md:p-14 bg-white">
                             <h4 className="flex items-center gap-3 text-2xl font-black text-brand-green-dark mb-10">
                                 <span className="w-8 h-8 rounded-full bg-brand-green-pale/50 flex items-center justify-center text-brand-green-dark">
                                     <Gift size={16}/>
                                 </span>
                                 <EditableText value={phase.benefitsTitle[language]} onSave={(val) => updateProcessPhase(idx, 'benefitsTitle', val)} />
                             </h4>
                             <ul className="space-y-6">
                                 {phase.benefits.map((benefit, bIdx) => (
                                     <li key={bIdx} className="flex items-start gap-4 group">
                                         <CheckCircle2 size={20} className="text-brand-green-medium mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                                         {/* Enhanced Text Color */}
                                         <span className="text-gray-800 leading-relaxed font-bold">
                                             <EditableText value={benefit[language]} onSave={(val) => updateProcessPhaseDetail(idx, 'benefits', bIdx, val)} />
                                         </span>
                                     </li>
                                 ))}
                             </ul>
                         </div>

                         {/* Right: Obligations (The "Rules") */}
                         <div className="md:w-2/5 p-8 md:p-14 bg-[#F2F0E9] border-t md:border-t-0 md:border-l border-brand-green-dark/5 relative overflow-hidden">
                             {/* Decorative Background */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green-medium/5 rounded-full blur-3xl pointer-events-none"></div>

                             <h4 className="flex items-center gap-3 text-xl font-bold text-gray-800 mb-8">
                                 <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                                     {idx === 2 ? <AlertTriangle size={16}/> : <Scale size={16}/>}
                                 </span>
                                 <EditableText value={phase.obligationsTitle[language]} onSave={(val) => updateProcessPhase(idx, 'obligationsTitle', val)} />
                             </h4>
                             <ul className="space-y-4">
                                 {phase.obligations.map((ob, oIdx) => (
                                     <li key={oIdx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0"></span>
                                         <span className="leading-relaxed">
                                             <EditableText value={ob[language]} onSave={(val) => updateProcessPhaseDetail(idx, 'obligations', oIdx, val)} />
                                         </span>
                                     </li>
                                 ))}
                             </ul>
                             
                             {idx === 0 && (
                                 <div className="mt-12 p-4 bg-brand-green-dark text-white rounded-xl text-xs leading-relaxed shadow-lg">
                                     <p className="font-bold mb-1">💡 为什么我们敢免费提供设备？</p>
                                     <p className="opacity-90">因为我们对 ONESIP 的产品力有绝对信心。试运行期是双方建立信任的最佳窗口。</p>
                                 </div>
                             )}
                             
                              {idx === 2 && (
                                 <div className="mt-12 p-4 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs leading-relaxed">
                                     <p className="font-bold mb-1">🛡️ 退出机制说明</p>
                                     <p className="opacity-90">我们承诺不设任何隐形门槛。生意有风险，我们愿意共同分担，但诚信是合作的基石。</p>
                                 </div>
                             )}
                         </div>
                     </div>
                 )
             })}
        </div>
      </div>
    </div>
  );
};