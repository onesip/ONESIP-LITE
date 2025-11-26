import React, { useState, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip } from 'recharts';
import { Bot, TrendingUp, DollarSign, Activity, AlertCircle, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { analyzeProfitability } from '../services/geminiService';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

interface DetailedModelData {
  revenue: number;
  costMaterials: number;
  costLabor: number;
  costRent: number;
  costEquip: number; // Includes Brand Fee or Equipment Installment
  costMisc: number;
  totalCost: number;
  profit: number;
}

// --- Configuration Parameters ---
// Adjusted structure to easily match external spreadsheets
const MODEL_PARAMS = {
  A: { // Model A: DIY (Traditional Self-made)
    price: 5.0,
    cogsRate: 0.35,      // Material Cost % (Higher due to waste)
    laborFixed: 2500,    // Full time staff needed
    rent: 0,             // Existing space
    equipFixed: 100,     // Minimal maintenance
    misc: 200,
    capCups: 45          // Max capacity limit for manual process
  },
  B: { // Model B: Rental Machine
    price: 4.5,          // Lower perceived value
    cogsRate: 0.30,      // Material Cost %
    laborFixed: 1200,    // Part time
    rent: 0,
    equipFixed: 650,     // Fixed Rental Fee
    misc: 200,
    capCups: 60          // Machine speed limit
  },
  C: { // Model C: Franchise Store
    price: 6.0,          // Premium pricing
    cogsRate: 0.25,      // Material Cost % (Bulk efficiency)
    laborFixed: 5000,    // High labor (2 Full + 1 Part)
    rent: 2500,          // Dedicated space rent
    equipFixed: 800,     // Equipment depreciation
    misc: 1000           // Marketing & Utilities
  },
  D: { // Model D: ONESIP LITE
    price: 5.0,
    cogsRate: 0.28,      // Competitive supply chain
    rent: 0,             // Existing space
    systemFee: 899,      // Monthly SaaS/Machine Fee
    brandFeeRate: 0.07,  // Revenue Share
    misc: 100,
    // Dynamic Labor: Depends on volume (Elastic)
    laborLevels: [
      { maxCups: 30, cost: 0 },    // Idle staff handles it
      { maxCups: 80, cost: 900 },  // Slight extra help
      { maxCups: Infinity, cost: 1800 } // Busy
    ]
  }
};

export const FinancialsSection = () => {
  const { content, updateSection, updateFinancialModel, updateFinancialModelDetail, language } = useContent();
  const { financials } = content;
  const { models } = financials;

  const [dailyCups, setDailyCups] = useState(60);
  const [activeModelId, setActiveModelId] = useState<string>('D'); // Default to ONESIP
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const daysPerMonth = 30;

  // --- Comprehensive Calculation Logic for EACH Model ---
  const calculateDetails = (modelId: string, cups: number): DetailedModelData => {
      let revenue = 0;
      let costMaterials = 0;
      let costLabor = 0;
      let costRent = 0;
      let costEquip = 0;
      let costMisc = 0;

      if (modelId === 'A') {
          const params = MODEL_PARAMS.A;
          // Apply capacity cap
          const effectiveCups = Math.min(cups, params.capCups);
          
          revenue = effectiveCups * daysPerMonth * params.price;
          costMaterials = revenue * params.cogsRate;
          costLabor = params.laborFixed;
          costRent = params.rent;
          costEquip = params.equipFixed;
          costMisc = params.misc;
      }
      else if (modelId === 'B') {
          const params = MODEL_PARAMS.B;
          const effectiveCups = Math.min(cups, params.capCups);

          revenue = effectiveCups * daysPerMonth * params.price;
          costMaterials = revenue * params.cogsRate;
          costLabor = params.laborFixed;
          costRent = params.rent;
          costEquip = params.equipFixed;
          costMisc = params.misc;
      }
      else if (modelId === 'C') {
          const params = MODEL_PARAMS.C;
          revenue = cups * daysPerMonth * params.price;

          costMaterials = revenue * params.cogsRate;
          costLabor = params.laborFixed;
          costRent = params.rent;
          costEquip = params.equipFixed;
          costMisc = params.misc;
      }
      else if (modelId === 'D') {
          const params = MODEL_PARAMS.D;
          revenue = cups * daysPerMonth * params.price;

          costMaterials = revenue * params.cogsRate;
          
          // Calculate Dynamic Labor
          const laborLevel = params.laborLevels.find(l => cups <= l.maxCups) || params.laborLevels[params.laborLevels.length - 1];
          costLabor = laborLevel.cost;

          costRent = params.rent;
          
          // Formula: System Fee + (Revenue * Brand %)
          costEquip = params.systemFee + (revenue * params.brandFeeRate);
          costMisc = params.misc;
      }

      const totalCost = costMaterials + costLabor + costRent + costEquip + costMisc;
      
      return {
          revenue,
          costMaterials,
          costLabor,
          costRent,
          costEquip,
          costMisc,
          totalCost,
          profit: revenue - totalCost
      };
  };

  useEffect(() => {
    const data = models.map(m => {
        const details = calculateDetails(m.id, dailyCups);
        return {
            name: m.name[language], // Localized name
            profit: details.profit,
            id: m.id
        };
    });
    setChartData(data);
  }, [dailyCups, models, language]);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeProfitability(dailyCups, language === 'zh' ? "商业中心" : "Commercial Center");
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const onesipData = calculateDetails('D', dailyCups);
  const activeModelData = calculateDetails(activeModelId, dailyCups);
  const activeModelInfo = models.find(m => m.id === activeModelId);

  return (
    <div id="financials" className="py-24 md:py-32 bg-[#0A0A0A] text-white relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-green-dark/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
                <span className="text-brand-green-medium font-bold tracking-widest text-xs uppercase mb-3 block opacity-80">
                    <EditableText value={financials.tagline[language]} onSave={(val) => updateSection('financials', 'tagline', val)} />
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    <EditableText value={financials.title[language]} onSave={(val) => updateSection('financials', 'title', val)} />
                </h2>
            </div>
            <div className="text-gray-400 max-w-md text-sm font-normal leading-relaxed">
                <EditableText value={financials.description[language]} onSave={(val) => updateSection('financials', 'description', val)} multiline />
            </div>
        </div>

        {/* --- MAIN CONTROLLER AREA --- */}
        <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 md:p-10 mb-8 shadow-2xl">
            {/* Slider Section */}
            <div className="flex flex-col md:flex-row gap-10 items-center mb-10">
                 <div className="w-full md:w-1/3">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <EditableText value={financials.labelSales[language]} onSave={(val) => updateSection('financials', 'labelSales', val)} />
                        </label>
                        <div className="text-3xl font-mono font-bold text-brand-green-medium">
                            {dailyCups} <span className="text-sm text-gray-500">{language === 'zh' ? '杯/天' : 'cups/day'}</span>
                        </div>
                    </div>
                    <input 
                        type="range" min="15" max="150" step="5" value={dailyCups} 
                        onChange={(e) => setDailyCups(Number(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-brand-green-medium hover:accent-brand-green-light transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 font-mono uppercase mt-2">
                        <span>Min (15)</span>
                        <span>Target (60+)</span>
                        <span>Max (150)</span>
                    </div>
                 </div>

                 {/* Bar Chart Section */}
                 <div className="w-full md:w-2/3 h-48 md:h-40">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={40}>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#888', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff'}}
                                formatter={(value: number) => [`€${value.toLocaleString()}`, language === 'zh' ? '净利润' : 'Net Profit']}
                            />
                            <Bar dataKey="profit" radius={[6, 6, 6, 6]}>
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.id === 'D' ? '#06C167' : (entry.profit > 0 ? '#333' : '#EF4444')} 
                                        className="transition-all duration-500"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                 </div>
            </div>
        </div>

        {/* --- DETAILED CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((model, idx) => {
                const isActive = activeModelId === model.id;
                const data = calculateDetails(model.id, dailyCups);
                const isLoss = data.profit < 0;

                return (
                    <button
                        key={model.id}
                        onClick={() => setActiveModelId(model.id)}
                        className={`text-left relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group
                            ${isActive 
                                ? 'bg-[#1C1C1E] border-brand-green-medium/50 shadow-xl scale-[1.02] z-10 ring-1 ring-brand-green-medium/20' 
                                : 'bg-[#111211] border-white/5 hover:bg-[#1C1C1E] opacity-70 hover:opacity-100 hover:border-white/10'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                             <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                 <EditableText value={model.name[language]} onSave={(val) => updateFinancialModel(idx, 'name', val)} />
                             </h3>
                             {isActive && <div className="w-2 h-2 rounded-full bg-brand-green-medium animate-pulse"></div>}
                        </div>

                        {/* Big Number */}
                        <div className={`text-2xl md:text-3xl font-black mb-6 tracking-tight font-mono
                            ${isLoss ? 'text-red-500' : (isActive ? 'text-brand-green-medium' : 'text-gray-300')}
                        `}>
                            {isLoss ? '-' : '+'}€{Math.abs(data.profit).toLocaleString()}
                        </div>

                        {/* Expanded Details */}
                        <div className="space-y-2 text-xs border-t border-white/5 pt-4 w-full">
                            <div className="flex justify-between text-gray-400">
                                <span>{language === 'zh' ? '营业额' : 'Revenue'}</span>
                                <span className="text-white font-mono">€{data.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-red-400/70">
                                <span>{language === 'zh' ? '总成本' : 'Costs'}</span>
                                <span className="font-mono">-€{data.totalCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                            </div>
                        </div>
                        
                        {isActive && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green-dark text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-brand-green-medium/30">
                                {language === 'zh' ? '当前查看' : 'Viewing'}
                            </div>
                        )}
                    </button>
                )
            })}
        </div>

        {/* --- DEEP DIVE PANEL (FOR SELECTED MODEL) --- */}
        {activeModelInfo && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                
                {/* Cost Breakdown Detail */}
                <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8">
                     <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                         <DollarSign size={20} className="text-brand-green-medium"/>
                         {language === 'zh' ? '费用明细' : 'Cost Breakdown'}
                     </h4>
                     <div className="space-y-4">
                         <Row label={financials.breakdownRevenue[language]} value={activeModelData.revenue} isTotal />
                         <div className="h-px bg-white/10 my-2"></div>
                         <Row label={financials.breakdownMaterials[language]} value={-activeModelData.costMaterials} />
                         <Row label={financials.breakdownLabor[language]} value={-activeModelData.costLabor} />
                         <Row label={financials.breakdownRent[language]} value={-activeModelData.costRent} />
                         <Row label={financials.breakdownEquip[language]} value={-activeModelData.costEquip} />
                         <Row label={financials.breakdownMisc[language]} value={-activeModelData.costMisc} />
                         <div className="h-px bg-white/10 my-2"></div>
                         <div className="flex justify-between items-center text-xl font-bold pt-2">
                             <span className="text-white">{financials.breakdownNet[language]}</span>
                             <span className={activeModelData.profit > 0 ? 'text-brand-green-medium' : 'text-red-500'}>
                                 €{activeModelData.profit.toLocaleString(undefined, {maximumFractionDigits: 0})}
                             </span>
                         </div>
                     </div>
                </div>

                {/* Pros & Cons */}
                <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 flex flex-col">
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                         <Activity size={20} className="text-blue-400"/>
                         {language === 'zh' ? '模式分析' : 'Analysis'}
                    </h4>
                    
                    <div className="flex-1 space-y-8">
                        <div>
                            <span className="text-xs font-bold text-brand-green-medium uppercase tracking-widest mb-3 block">PROS ({language === 'zh' ? '优势' : 'Advantages'})</span>
                            <ul className="space-y-3">
                                {activeModelInfo.pros.map((p, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check size={16} className="text-brand-green-medium shrink-0 mt-0.5" />
                                        <EditableText value={p[language]} onSave={(val) => updateFinancialModelDetail(models.indexOf(activeModelInfo), 'pros', i, val)} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 block">CONS ({language === 'zh' ? '劣势' : 'Disadvantages'})</span>
                             <ul className="space-y-3">
                                {activeModelInfo.cons.map((c, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                                        <EditableText value={c[language]} onSave={(val) => updateFinancialModelDetail(models.indexOf(activeModelInfo), 'cons', i, val)} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        )}
        
        {/* AI Analysis Button */}
        <div className="mt-8">
             <button 
                onClick={handleAiAnalysis}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-green-dark to-[#0A2A1A] border border-white/5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 hover:brightness-110"
            >
                <Bot size={18} className={isAnalyzing ? 'animate-pulse' : ''}/>
                {isAnalyzing ? financials.aiButtonLoading[language] : (language === 'zh' ? `获取 AI 对【${activeModelInfo?.name.zh}】模式的点评` : `Get AI Analysis for ${activeModelInfo?.name.en}`)}
            </button>
            {aiAnalysis && (
                <div className="mt-4 p-6 bg-[#1C1C1E] border border-white/5 rounded-2xl animate-fade-in text-gray-300 leading-relaxed text-sm">
                    {aiAnalysis}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

const Row = ({ label, value, isTotal = false }: { label: string, value: number, isTotal?: boolean }) => (
    <div className={`flex justify-between items-center text-sm ${isTotal ? 'text-white font-bold' : 'text-gray-400'}`}>
        <span>{label}</span>
        <span className={`font-mono ${!isTotal && value < 0 ? 'text-red-400/80' : ''}`}>
            {value < 0 ? '-' : ''}€{Math.abs(value).toLocaleString(undefined, {maximumFractionDigits: 0})}
        </span>
    </div>
);