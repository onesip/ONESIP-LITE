
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip } from 'recharts';
import { Bot, CheckCircle2, XCircle, AlertOctagon, TrendingUp } from 'lucide-react';
import { analyzeProfitability } from '../services/geminiService';
import { useContent } from '../contexts/ContentContext';
import { EditableText } from './ui/Editable';

interface ModelData {
  revenue: number;
  materials: number;
  labor: number;
  rent: number;
  equip: number;
  misc: number;
  profit: number;
  isCapped: boolean;
}

export const FinancialsSection = () => {
  const { content, updateSection, updateFinancialModel, updateFinancialModelDetail } = useContent();
  const { financials } = content;
  const { models } = financials; // Use models from content, not local constant

  const [dailyCups, setDailyCups] = useState(60);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const daysPerMonth = 30;

  // Calculation logic remains hardcoded as it is business logic, but it maps via ID
  const getModelData = (modelId: string): ModelData => {
    const cups = dailyCups;
    if (modelId === 'A') { 
        const price = 5.0;
        const cap = 45;
        const effectiveCups = Math.min(cups, cap);
        const revenue = effectiveCups * daysPerMonth * price;
        const materials = effectiveCups * daysPerMonth * 1.1;
        const labor = 2250; 
        const profit = revenue - materials - labor;
        return { revenue, materials, labor, rent: 0, equip: 0, misc: 0, profit, isCapped: cups > cap };
    }
    if (modelId === 'B') { 
        const price = 5.0;
        const cap = 60;
        const effectiveCups = Math.min(cups, cap);
        const revenue = effectiveCups * daysPerMonth * price;
        const materials = effectiveCups * daysPerMonth * 1.1;
        const labor = 1125; 
        const equip = 450;
        const profit = revenue - materials - labor - equip;
        return { revenue, materials, labor, rent: 0, equip, misc: 0, profit, isCapped: cups > cap };
    }
    if (modelId === 'C') { 
        const price = 6.0;
        const revenue = cups * daysPerMonth * price;
        const materials = cups * daysPerMonth * 1.0; 
        const labor = 9000; 
        const rent = 2500;
        const misc = 1000;
        const profit = revenue - materials - labor - rent - misc;
        return { revenue, materials, labor, rent, equip: 0, misc, profit, isCapped: false };
    }
    if (modelId === 'D') { 
        const price = 5.0;
        const revenue = cups * daysPerMonth * price;
        const materials = cups * daysPerMonth * 1.1;
        let labor = 0;
        if (cups > 30) labor = 1500;
        if (cups > 70) labor = 3000;
        const equip = 899 + (revenue * 0.07);
        const profit = revenue - materials - labor - equip;
        return { revenue, materials, labor, rent: 0, equip, misc: 0, profit, isCapped: false };
    }
    return { revenue: 0, materials: 0, labor: 0, rent: 0, equip: 0, misc: 0, profit: 0, isCapped: false };
  };

  useEffect(() => {
    const data = models.map(m => ({
      name: m.name,
      profit: getModelData(m.id).profit,
      id: m.id
    }));
    setChartData(data);
  }, [dailyCups, models]);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeProfitability(dailyCups, "商业中心");
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const onesipData = getModelData('D');
  const lowSalesWarning = dailyCups < 25;

  return (
    <div id="financials" className="py-32 bg-brand-green-dark text-white relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(#929E95 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
                <span className="text-brand-green-light font-bold tracking-widest text-xs uppercase mb-3 block">
                    <EditableText value={financials.tagline} onSave={(val) => updateSection('financials', 'tagline', val)} />
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-brand-cream leading-tight">
                    <EditableText value={financials.title} onSave={(val) => updateSection('financials', 'title', val)} />
                </h2>
            </div>
            <div className="text-brand-green-light/80 max-w-md text-right md:text-left text-sm font-light">
                <EditableText value={financials.description} onSave={(val) => updateSection('financials', 'description', val)} multiline />
                <br/>
                <span className="text-white font-medium">
                    <EditableText value={financials.disclaimer} onSave={(val) => updateSection('financials', 'disclaimer', val)} />
                </span>
            </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-8 md:p-12 shadow-2xl ring-1 ring-white/5">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Left Column: Interactive Controls */}
            <div className="w-full lg:w-5/12 space-y-10 sticky top-32">
              
              {/* Slider Component */}
              <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                <div className="flex justify-between items-end mb-8">
                  <label className="text-brand-green-pale font-medium text-sm uppercase tracking-wider">
                      <EditableText value={financials.labelSales} onSave={(val) => updateSection('financials', 'labelSales', val)} />
                  </label>
                  <div className="text-5xl font-black text-white tabular-nums tracking-tight">
                    {dailyCups} <span className="text-lg font-medium text-brand-green-light/50">
                        <EditableText value={financials.labelCups} onSave={(val) => updateSection('financials', 'labelCups', val)} />
                    </span>
                  </div>
                </div>
                
                <div className="relative h-12 flex items-center">
                    <input 
                    type="range" min="15" max="150" step="5" value={dailyCups} 
                    onChange={(e) => setDailyCups(Number(e.target.value))}
                    className="w-full h-2 bg-brand-green-medium/30 rounded-full appearance-none cursor-pointer accent-brand-cream hover:accent-white transition-all z-20 relative focus:outline-none focus:ring-2 focus:ring-brand-cream/50"
                    />
                    {/* Tick marks */}
                    <div className="absolute w-full flex justify-between px-1 pointer-events-none top-1/2 -translate-y-1/2 z-10">
                        <div className="w-1 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-1 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-1 h-3 bg-white/20 rounded-full"></div>
                    </div>
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-brand-green-light/50 font-medium font-mono uppercase">
                  <span><EditableText value={financials.labelMin} onSave={(val) => updateSection('financials', 'labelMin', val)} /></span>
                  <span><EditableText value={financials.labelTarget} onSave={(val) => updateSection('financials', 'labelTarget', val)} /></span>
                  <span><EditableText value={financials.labelMax} onSave={(val) => updateSection('financials', 'labelMax', val)} /></span>
                </div>
              </div>

              {/* Main Result Card */}
              <div className={`rounded-3xl p-8 border transition-all duration-500 relative overflow-hidden ${lowSalesWarning ? 'bg-red-500/10 border-red-500/30' : 'bg-brand-cream text-brand-green-dark border-brand-cream'}`}>
                 
                 {/* Decorative background circle */}
                 {!lowSalesWarning && <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-green-medium/10 rounded-full blur-3xl"></div>}

                {lowSalesWarning ? (
                    <div className="flex flex-col items-center justify-center text-red-300 py-6 text-center">
                      <AlertOctagon size={40} className="mb-3"/>
                      <span className="font-bold text-lg">
                          <EditableText value={financials.alertTitle} onSave={(val) => updateSection('financials', 'alertTitle', val)} />
                      </span>
                      <span className="text-xs mt-1 opacity-70">
                          <EditableText value={financials.alertDesc} onSave={(val) => updateSection('financials', 'alertDesc', val)} />
                      </span>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-green-dark text-white flex items-center justify-center">
                                    <TrendingUp size={16} />
                                </div>
                                <span className="text-brand-green-dark font-bold text-sm tracking-wide">
                                    <EditableText value={financials.labelProfit} onSave={(val) => updateSection('financials', 'labelProfit', val)} />
                                </span>
                            </div>
                            <span className="text-5xl font-black tracking-tighter tabular-nums">
                            €{onesipData.profit.toLocaleString(undefined, {maximumFractionDigits:0})}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                             <div className="flex justify-between items-center py-3 border-b border-brand-green-dark/10">
                                <span className="text-xs font-bold text-brand-green-medium uppercase">
                                    <EditableText value={financials.labelRevenue} onSave={(val) => updateSection('financials', 'labelRevenue', val)} />
                                </span>
                                <span className="font-bold font-mono">€{onesipData.revenue.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between items-center py-3 border-b border-brand-green-dark/10">
                                <span className="text-xs font-bold text-brand-green-medium uppercase">
                                    <EditableText value={financials.labelCost} onSave={(val) => updateSection('financials', 'labelCost', val)} />
                                </span>
                                <span className="font-bold font-mono">€{onesipData.equip.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                             </div>
                        </div>

                        {/* AI Section */}
                        <div className="mt-8">
                            {!aiAnalysis ? (
                                <button 
                                    onClick={handleAiAnalysis}
                                    disabled={isAnalyzing}
                                    className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-brand-green-dark text-white px-4 py-4 rounded-xl hover:bg-brand-green-medium transition-colors"
                                >
                                    <Bot size={16} />
                                    {isAnalyzing ? financials.aiButtonLoading : financials.aiButton}
                                </button>
                            ) : (
                                <div className="bg-white/50 backdrop-blur rounded-xl p-4 border border-brand-green-dark/5">
                                    <div className="flex items-center gap-2 mb-2 text-brand-green-dark font-bold text-xs uppercase"><Bot size={14}/> {financials.aiResultTitle}</div>
                                    <p className="text-xs text-brand-green-medium leading-relaxed">{aiAnalysis}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* Right Column: Comparative List */}
            <div className="w-full lg:w-7/12">
               <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-brand-cream">
                      <EditableText value={financials.comparisonTitle} onSave={(val) => updateSection('financials', 'comparisonTitle', val)} />
                  </h3>
                  <div className="h-px flex-1 bg-white/10 ml-6"></div>
               </div>

              <div className="space-y-4">
                {models.map((m, mIndex) => {
                    const data = getModelData(m.id);
                    const isProfitable = data.profit > 0;
                    const isHighlight = m.id === 'D';
                    const isExpanded = expandedCard === m.id;
                    const isModelCRisk = m.id === 'C' && data.profit < 0;

                    return (
                    <div 
                        key={m.id} 
                        className={`relative rounded-2xl transition-all duration-300 overflow-hidden group
                        ${isHighlight 
                            ? (lowSalesWarning ? 'bg-white/5 border border-white/10 opacity-50' : 'bg-brand-green-medium text-white shadow-2xl ring-1 ring-white/20') 
                            : 'bg-white/5 border border-white/5 hover:bg-white/10'}
                        `}
                    >
                        <div className="p-6 cursor-pointer" onClick={() => setExpandedCard(isExpanded ? null : m.id)}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${isHighlight ? 'bg-brand-cream' : (isProfitable ? 'bg-brand-green-light/30' : 'bg-red-500/50')}`}></div>
                                    <div>
                                        <div className={`text-base font-bold ${isHighlight ? 'text-white' : 'text-brand-green-pale'}`}>
                                            <EditableText value={m.name} onSave={(val) => updateFinancialModel(mIndex, 'name', val)} />
                                        </div>
                                        <div className={`text-xs mt-1 font-mono ${isHighlight ? 'text-brand-green-light' : 'text-brand-green-light/50'}`}>
                                            Avg Price: €{m.id === 'C' ? '6.0' : '5.0'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className={`text-2xl font-black tabular-nums tracking-tight ${isHighlight ? 'text-white' : (isProfitable ? 'text-brand-green-light' : 'text-red-400')}`}>
                                        {data.profit > 0 ? '+' : ''}€{data.profit.toLocaleString(undefined, {maximumFractionDigits:0})}
                                    </div>
                                    <div className="flex justify-end gap-2 mt-1">
                                         {data.isCapped && <span className="text-[9px] uppercase tracking-wider font-bold text-yellow-500">产能上限</span>}
                                         {isModelCRisk && <span className="text-[9px] uppercase tracking-wider font-bold text-red-400">高风险</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <div className="p-6 pt-0 border-t border-white/10 bg-black/10">
                                    <div className="grid grid-cols-2 gap-8 py-6">
                                        <div className="space-y-3">
                                            <span className="text-[10px] uppercase font-bold text-brand-green-light/50 tracking-widest block mb-2">核心优势</span>
                                            {m.pros.map((p,i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-brand-green-pale">
                                                    <CheckCircle2 size={12} className="mt-0.5 text-brand-green-medium shrink-0"/> 
                                                    <EditableText value={p} onSave={(val) => updateFinancialModelDetail(mIndex, 'pros', i, val)} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[10px] uppercase font-bold text-brand-green-light/50 tracking-widest block mb-2">潜在风险</span>
                                            {m.cons.map((c,i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-brand-green-pale/80">
                                                    <XCircle size={12} className="mt-0.5 text-red-400 shrink-0"/> 
                                                    <EditableText value={c} onSave={(val) => updateFinancialModelDetail(mIndex, 'cons', i, val)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Detailed Bill Breakdown */}
                                    <div className="bg-black/20 rounded-xl p-4 font-mono text-xs space-y-2">
                                        <div className="flex justify-between text-brand-green-light/70">
                                            <span><EditableText value={financials.breakdownRevenue} onSave={(val) => updateSection('financials', 'breakdownRevenue', val)} /></span>
                                            <span className="font-bold text-white">€{data.revenue.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-red-300/80">
                                            <span><EditableText value={financials.breakdownMaterials} onSave={(val) => updateSection('financials', 'breakdownMaterials', val)} /></span>
                                            <span>€{data.materials.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between text-red-300/80">
                                            <span><EditableText value={financials.breakdownLabor} onSave={(val) => updateSection('financials', 'breakdownLabor', val)} /></span>
                                            <span>€{data.labor}</span>
                                        </div>
                                        <div className="flex justify-between text-red-300/80">
                                            <span><EditableText value={financials.breakdownRent} onSave={(val) => updateSection('financials', 'breakdownRent', val)} /></span>
                                            <span>€{data.rent}</span>
                                        </div>
                                        <div className="flex justify-between text-red-300/80">
                                            <span><EditableText value={financials.breakdownEquip} onSave={(val) => updateSection('financials', 'breakdownEquip', val)} /></span>
                                            <span>€{data.equip.toFixed(0)}</span>
                                        </div>
                                        {data.misc > 0 && (
                                            <div className="flex justify-between text-red-300/80">
                                                <span><EditableText value={financials.breakdownMisc} onSave={(val) => updateSection('financials', 'breakdownMisc', val)} /></span>
                                                <span>€{data.misc}</span>
                                            </div>
                                        )}
                                        <div className="h-px bg-white/10 my-2"></div>
                                        <div className="flex justify-between font-bold text-white text-sm">
                                            <span><EditableText value={financials.breakdownNet} onSave={(val) => updateSection('financials', 'breakdownNet', val)} /></span>
                                            <span>{data.profit > 0 ? '+' : ''}€{data.profit.toFixed(0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                })}
              </div>

              {/* Chart */}
              <div className="mt-12 h-64 w-full">
                  <h3 className="text-xs font-bold text-brand-green-light/50 uppercase tracking-widest mb-6">
                      <EditableText value={financials.chartTitle} onSave={(val) => updateSection('financials', 'chartTitle', val)} />
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#929E95', fontSize: 10 }}
                        dy={10}
                      />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{backgroundColor: '#465D4E', border: 'none', borderRadius: '8px', color: '#F8F6EF'}}
                        itemStyle={{color: '#F8F6EF'}}
                      />
                      <Bar dataKey="profit" radius={[4, 4, 4, 4]}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.id === 'D' ? '#F8F6EF' : (entry.profit > 0 ? '#607A69' : '#EF4444')} 
                            opacity={entry.id === 'D' ? 1 : 0.6}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
