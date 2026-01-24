import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip } from 'recharts';
import { TrendingUp, DollarSign, Activity, AlertCircle, ChevronDown, ChevronUp, Check, X, PlusCircle, GripVertical, Trash2 } from 'lucide-react';
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

const DraggableDetailList = ({ modelIndex, type, items, onAdd, onDelete, onReorder, onUpdate }: any) => {
    const { isAdmin, language } = useContent();
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        onReorder(modelIndex, type, dragItem.current, dragOverItem.current);
        dragItem.current = null;
        dragOverItem.current = null;
    };
    
    const isPros = type === 'pros';

    return (
        <div>
            <span className={`text-xs font-bold ${isPros ? 'text-brand-green-medium' : 'text-red-400'} uppercase tracking-widest mb-3 block`}>
                {isPros ? `PROS (${language === 'zh' ? '优势' : 'Advantages'})` : `CONS (${language === 'zh' ? '劣势' : 'Disadvantages'})`}
            </span>
            <ul className="space-y-3">
                {items.map((p: any, i: number) => (
                    <li 
                        key={i} 
                        draggable={isAdmin}
                        onDragStart={() => dragItem.current = i}
                        onDragEnter={() => dragOverItem.current = i}
                        onDragEnd={handleDragSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex items-start gap-3 text-sm text-gray-300 group relative pr-12"
                    >
                        {isAdmin && (
                            <div className="absolute top-1 right-0 flex items-center gap-0.5 bg-black/50 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing"><GripVertical size={14} /></button>
                                <button onClick={() => onDelete(modelIndex, type, i)} className="p-1 text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                        )}
                        {isPros ? <Check size={16} className="text-brand-green-medium shrink-0 mt-0.5" /> : <X size={16} className="text-red-400 shrink-0 mt-0.5" />}
                        <EditableText value={p[language]} onSave={(val) => onUpdate(modelIndex, type, i, val)} />
                    </li>
                ))}
            </ul>
            {isAdmin && <button onClick={() => onAdd(modelIndex, type)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white mt-3 ml-7"><PlusCircle size={14}/> 添加一项</button>}
        </div>
    );
};


export const FinancialsSection = () => {
  const { content, isAdmin, updateSection, updateFinancialModel, updateFinancialModelDetail, addFinancialModelDetail, deleteFinancialModelDetail, reorderFinancialModelDetails, language } = useContent();
  const { financials, calculatorParams } = content;
  const { models } = financials;

  const [dailyCups, setDailyCups] = useState(60);
  const [activeModelId, setActiveModelId] = useState<string>('D'); 
  const [chartData, setChartData] = useState<any[]>([]);

  const daysPerMonth = 30;

  // --- 核心数据校准 (源自 Excel: 商业模式营收对比 & 加盟政策) ---
  const EXCEL_CONSTANTS = {
    // A模式: 传统原料自营 (Competitor)
    modelA: { 
      price: 5,               // 均价 5
      cap: 30,                // 客流上限 30杯/日 (忙不过来/口味一般)
      materialRate: 1.1 / 5,  // 原料成本率 (1.1/5 = 22%)
      labor: 2250,            // 固定人工
      rent: 0,
      misc: 0
    },
    // B模式: 租赁小型机器 (Competitor)
    modelB: { 
      price: 5,               // 均价 5
      cap: 35,                // 客流上限 35杯/日 (客户群体局限)
      materialRate: 1.1 / 5,  // 原料成本率
      labor: 1125,            // 固定人工
      rent: 450,              // 机器租金
      misc: 0
    },
    // C模式: 传统自营奶茶店 (Competitor - High Risk)
    modelC: { 
      price: 6,               // 均价 6 (Excel明确注明)
      cap: 120,               // 自营店理论上限较高，但成本极高
      materialRate: 1.1 / 6,  // 原料成本率 (1.1/6 ≈ 18%)
      labor: 9900,            // 极高人工 (3人x3300)
      rent: 2000,             // 房租
      utilities: 1000,        // 水电气
      misc: 500               // 其他
    },
    // D模式: ONESIP LITE (Our Product)
    modelD: { 
      price: 5,               // 均价 5
      // 核心政策: 加盟商净利 1.5欧元/杯 (30% Margin)
      // 这里的成本是倒推的：营收 - 1.5*杯数 = 品牌服务费/供应链成本
      profitPerCup: 1.5       
    }
  };

  // --- 重写的精准计算逻辑 (Calculate Logic) ---
  const calculateDetails = (modelId: string, inputCups: number): DetailedModelData => {
      let revenue = 0;
      let costMaterials = 0;
      let costLabor = 0;
      let costRent = 0;
      let costEquip = 0;
      let costMisc = 0;

      // Model A: 传统自营 (受限于 Cap 30杯)
      if (modelId === 'A') {
          const actualCups = Math.min(inputCups, EXCEL_CONSTANTS.modelA.cap); // 限制客流
          const monthlyCups = actualCups * daysPerMonth;
          
          revenue = monthlyCups * EXCEL_CONSTANTS.modelA.price;
          costMaterials = revenue * EXCEL_CONSTANTS.modelA.materialRate;
          costLabor = EXCEL_CONSTANTS.modelA.labor;
          costRent = EXCEL_CONSTANTS.modelA.rent;
          costMisc = EXCEL_CONSTANTS.modelA.misc;
      }
      // Model B: 租赁机器 (受限于 Cap 35杯)
      else if (modelId === 'B') {
          const actualCups = Math.min(inputCups, EXCEL_CONSTANTS.modelB.cap); // 限制客流
          const monthlyCups = actualCups * daysPerMonth;

          revenue = monthlyCups * EXCEL_CONSTANTS.modelB.price;
          costMaterials = revenue * EXCEL_CONSTANTS.modelB.materialRate;
          costLabor = EXCEL_CONSTANTS.modelB.labor;
          costRent = EXCEL_CONSTANTS.modelB.rent; // 机器租金 450
          costMisc = EXCEL_CONSTANTS.modelB.misc;
      }
      // Model C: 自营奶茶店 (Price 6, High Cost)
      else if (modelId === 'C') {
          const actualCups = Math.min(inputCups, EXCEL_CONSTANTS.modelC.cap);
          const monthlyCups = actualCups * daysPerMonth;

          revenue = monthlyCups * EXCEL_CONSTANTS.modelC.price; // 均价 6
          costMaterials = revenue * EXCEL_CONSTANTS.modelC.materialRate;
          costLabor = EXCEL_CONSTANTS.modelC.labor; // 9900
          costRent = EXCEL_CONSTANTS.modelC.rent;   // 2000
          costMisc = EXCEL_CONSTANTS.modelC.utilities + EXCEL_CONSTANTS.modelC.misc; // 1500
      }
      // Model D: ONESIP LITE (Policy Logic)
      else if (modelId === 'D') {
          // Onesip 理论上无硬性客流上限，或上限很高
          const monthlyCups = inputCups * daysPerMonth;
          revenue = monthlyCups * EXCEL_CONSTANTS.modelD.price;

          // 核心逻辑：加盟商净拿 1.5 欧元/杯
          const franchiseeProfit = monthlyCups * EXCEL_CONSTANTS.modelD.profitPerCup;
          
          // 倒推品牌服务费/供应链成本 (用于饼图显示支出)
          const totalBrandCost = revenue - franchiseeProfit;
          
          costMaterials = 0; // 政策显示无额外原料费
          costLabor = 0;     // 政策显示无额外人工费
          costRent = 0;
          costEquip = totalBrandCost; // 归类为品牌服务与供应链支出
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
  }, [dailyCups, models, language, calculatorParams]);

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
                                formatter={(value: number) => [`€${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, language === 'zh' ? '净利润' : 'Net Profit']}
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
                            {isLoss ? '-' : '+'}€{Math.abs(data.profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>

                        {/* Expanded Details */}
                        <div className="space-y-2 text-xs border-t border-white/5 pt-4 w-full">
                            <div className="flex justify-between text-gray-400">
                                <span>{language === 'zh' ? '营业额' : 'Revenue'}</span>
                                <span className="text-white font-mono">€{data.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
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
                        <DraggableDetailList 
                            modelIndex={models.indexOf(activeModelInfo)}
                            type="pros"
                            items={activeModelInfo.pros}
                            onAdd={addFinancialModelDetail}
                            onDelete={deleteFinancialModelDetail}
                            onReorder={reorderFinancialModelDetails}
                            onUpdate={updateFinancialModelDetail}
                        />
                         <DraggableDetailList 
                            modelIndex={models.indexOf(activeModelInfo)}
                            type="cons"
                            items={activeModelInfo.cons}
                            onAdd={addFinancialModelDetail}
                            onDelete={deleteFinancialModelDetail}
                            onReorder={reorderFinancialModelDetails}
                            onUpdate={updateFinancialModelDetail}
                        />
                    </div>
                </div>

            </div>
        )}

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