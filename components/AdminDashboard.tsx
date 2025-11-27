import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { useChat } from '../contexts/ChatContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Edit3, 
  LogOut, 
  Search, 
  Bell, 
  Send,
  User,
  Bot,
  ArrowRight,
  ArrowLeft,
  Eye,
  Settings,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Rocket,
  ClipboardList,
  MapPin,
  Store,
  Clock,
  Calculator,
} from 'lucide-react';
import { LogoSymbol } from './BrandLogo';

// --- Sub-Component: Dashboard Home (Launcher) ---
const DashboardHome = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
  const { closeDashboard, content, toggleSectionVisibility, isCloudConfigured } = useContent();

  const modules = [
    {
      title: "加盟申请 (Leads)",
      desc: "查看并管理用户提交的意向表单，跟进销售线索。",
      icon: ClipboardList,
      color: "bg-orange-500",
      action: () => onNavigate('leads'),
      label: "查看线索"
    },
    {
      title: "CMS 页面装修",
      desc: "可视化编辑前台内容，管理菜单产品，新增业务模块。",
      icon: Edit3,
      color: "bg-blue-500",
      action: closeDashboard, // Exit to frontend
      label: "进入装修模式"
    },
    {
      title: "客服中心",
      desc: "实时接入访客咨询，人工接管 AI 对话，管理意向客户。",
      icon: MessageSquare,
      color: "bg-green-500",
      action: () => onNavigate('chat'),
      label: "进入会话"
    }
  ];

  // List of toggleable sections
  const sectionToggles = [
      { key: 'model', label: '商业模式 (Model)' },
      { key: 'process', label: '合作流程 (Process)' },
      { key: 'showcase', label: '成功案例 (Showcase)' },
      { key: 'financials', label: '财务测算 (Financials)' },
      { key: 'menuSection', label: '产品菜单 (Menu)' },
      { key: 'comparison', label: '配置清单 (Comparison)' },
      { key: 'faq', label: '常见问答 (FAQ)' },
      { key: 'partner', label: '合伙人招募 (Partner)' },
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto mt-10 pb-20">
      
      {!isCloudConfigured && (
        <div className="bg-red-900/50 border border-red-500/30 rounded-2xl p-6 text-center animate-fade-in mb-10">
            <div className="flex items-center justify-center gap-3">
                <AlertCircle className="text-red-400" size={24}/>
                <h3 className="text-xl font-bold text-white">云端未连接</h3>
            </div>
            <p className="text-red-300/80 text-sm mt-3 max-w-xl mx-auto">
                系统无法连接到云端数据库。请前往 <strong>系统设置</strong> 页面检查您的配置是否正确。
            </p>
            <button 
                onClick={() => onNavigate('settings')}
                className="mt-4 bg-white text-black px-5 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
            >
                检查设置
            </button>
        </div>
      )}

      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl font-black text-white">欢迎回到控制台</h2>
        <p className="text-gray-400">请选择您要管理的核心模块</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modules.map((mod, i) => (
          <div key={i} className="group relative bg-[#1C1C1E] border border-white/5 rounded-3xl p-8 hover:bg-[#252528] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 flex flex-col">
            <div className={`w-16 h-16 rounded-2xl ${mod.color} flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform`}>
              <mod.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{mod.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-8 flex-1">{mod.desc}</p>
            <button 
              onClick={mod.action}
              className="w-full py-4 rounded-xl bg-white/5 text-white font-bold border border-white/10 group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center gap-2"
            >
              {mod.label} <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Module Visibility Management */}
      <div className="pt-12 border-t border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <Eye size={20} className="text-brand-green-medium"/> 模块显示管理
             <span className="text-xs text-gray-500 font-normal ml-2">一键控制前台各个板块的显示/隐藏</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sectionToggles.map((sec) => {
                  const isVisible = (content[sec.key as keyof typeof content] as any)?.isVisible;
                  return (
                      <button 
                        key={sec.key}
                        onClick={() => toggleSectionVisibility(sec.key as any)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300
                            ${isVisible 
                                ? 'bg-[#2C2C2E] border-brand-green-medium/30 text-white' 
                                : 'bg-[#161618] border-white/5 text-gray-500 opacity-60 hover:opacity-100'}
                        `}
                      >
                          <span className="text-sm font-bold truncate mr-2">{sec.label}</span>
                          <div className={`w-8 h-4 rounded-full relative transition-colors ${isVisible ? 'bg-brand-green-medium' : 'bg-gray-600'}`}>
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${isVisible ? 'left-4.5' : 'left-0.5'}`} style={{left: isVisible ? '18px' : '2px'}}></div>
                          </div>
                      </button>
                  );
              })}
          </div>
      </div>

    </div>
  );
};

// --- Sub-Component: Leads ---
const DashboardLeads = () => {
    const { content, saveChanges } = useContent();
    const leads = content.leads || [];

    // Sort by newest first
    const sortedLeads = [...leads].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
             <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                     <ClipboardList className="text-orange-500" />
                     加盟申请列表
                     <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-gray-400">{leads.length}</span>
                 </h3>
                 <button onClick={saveChanges} className="bg-brand-green-medium hover:bg-brand-green-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                     刷新/保存状态
                 </button>
             </div>

             {leads.length === 0 ? (
                 <div className="text-center py-20 bg-[#1C1C1E] rounded-3xl border border-white/5">
                     <ClipboardList size={48} className="mx-auto text-gray-600 mb-4" />
                     <p className="text-gray-400">暂无申请数据。</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 gap-4">
                     {sortedLeads.map((lead) => (
                         <div key={lead.id} className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:bg-[#252528] transition-colors group relative overflow-hidden">
                             {/* New Indicator */}
                             {lead.status === 'new' && (
                                 <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">NEW</div>
                             )}

                             {/* Contact Info */}
                             <div className="w-full md:w-1/4 shrink-0">
                                 <div className="flex items-center gap-3 mb-2">
                                     <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-lg">
                                         {lead.name.charAt(0).toUpperCase()}
                                     </div>
                                     <div>
                                         <h4 className="text-white font-bold">{lead.name}</h4>
                                         <p className="text-xs text-gray-400 flex items-center gap-1">
                                             <Clock size={10} /> {new Date(lead.timestamp).toLocaleDateString()} {new Date(lead.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                         </p>
                                     </div>
                                 </div>
                                 <div className="space-y-2 mt-4">
                                     <div className="bg-black/20 px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-300">
                                         <MapPin size={14} className="text-gray-500"/> {lead.city}
                                     </div>
                                     <div className="bg-black/20 px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-brand-green-medium font-mono">
                                         <User size={14} className="text-gray-500"/> {lead.contact}
                                     </div>
                                 </div>
                             </div>

                             {/* Details */}
                             <div className="flex-1 border-t md:border-t-0 md:border-l border-white/5 md:pl-6 pt-4 md:pt-0">
                                 <div className="flex items-center gap-3 mb-4">
                                      <span className="text-xs font-bold text-gray-500 uppercase">店铺类型</span>
                                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold flex items-center gap-1">
                                          <Store size={12} /> {lead.businessType}
                                      </span>
                                 </div>
                                 <div className="bg-[#111211] rounded-xl p-4 text-sm text-gray-300 leading-relaxed border border-white/5">
                                     <span className="text-xs font-bold text-gray-500 block mb-1 uppercase">留言内容</span>
                                     {lead.message || "无留言"}
                                 </div>
                             </div>

                             {/* Actions (Mock) */}
                             <div className="flex md:flex-col justify-end gap-2 pt-4 md:pt-0">
                                 <button className="bg-brand-green-medium/20 text-brand-green-medium hover:bg-brand-green-medium hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                                     标记已联络
                                 </button>
                                 <button className="bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                                     复制信息
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
        </div>
    );
};

// --- Sub-Component: Settings (Cloud) - SIMPLIFIED ---
const DashboardSettings = () => {
    const { cloudConfig, isCloudConfigured } = useContent();

    const apiKeySource = process.env.REACT_APP_CLOUD_API_KEY ? 'Vercel Env' : 'config.ts';
    const binIdSource = process.env.REACT_APP_CLOUD_BIN_ID ? 'Vercel Env' : 'config.ts';

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
             {isCloudConfigured ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={18}/>
                    <div>
                        <h4 className="text-green-500 font-bold text-sm">云端同步已激活</h4>
                        <p className="text-green-500/70 text-xs mt-1">
                            系统已成功连接到云端数据库。所有更改都将自动保存。
                        </p>
                    </div>
                </div>
             ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-1 shrink-0" size={18}/>
                    <div>
                        <h4 className="text-red-500 font-bold text-sm">云端同步未激活</h4>
                        <p className="text-red-500/70 text-xs mt-1">
                            未能找到有效的 API Key 或 Bin ID。请检查您的 Vercel 环境变量或 `config.ts` 文件。
                        </p>
                    </div>
                </div>
             )}

             <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-8">
                 <div className="flex items-start gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                         <Cloud size={32} />
                     </div>
                     <div className="flex-1">
                         <h3 className="text-2xl font-bold text-white mb-2">云端数据同步</h3>
                         <p className="text-gray-400 leading-relaxed mb-6">
                             系统会优先使用 Vercel 环境变量，若未设置，则回退到 `config.ts` 文件。无需额外设置。
                         </p>
                         
                         <div className="bg-[#111211] p-6 rounded-xl border border-white/5 space-y-4">
                             <h4 className="text-sm font-bold text-white">当前配置来源：</h4>
                             <div className="space-y-2">
                                 <div className="flex items-center gap-2">
                                    <input value={`API Key: ${cloudConfig.apiKey ? cloudConfig.apiKey.substring(0, 15) + '...' : '未找到'}`} readOnly className="flex-1 bg-[#1C1C1E] border border-white/10 rounded-lg p-2 text-gray-500 font-mono text-xs cursor-not-allowed"/>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${apiKeySource === 'Vercel Env' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-400'}`}>{apiKeySource}</span>
                                 </div>
                                  <div className="flex items-center gap-2">
                                    <input value={`主Bin ID: ${cloudConfig.binId || '未找到'}`} readOnly className="flex-1 bg-[#1C1C1E] border border-white/10 rounded-lg p-2 text-gray-500 font-mono text-xs cursor-not-allowed"/>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${binIdSource === 'Vercel Env' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-400'}`}>{binIdSource}</span>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
             
             <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-8">
                 <div className="flex items-start gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                         <Rocket size={32} />
                     </div>
                     <div className="flex-1">
                         <h3 className="text-2xl font-bold text-white mb-2">如何发布上线？</h3>
                         <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                            <p className="text-blue-300 text-sm font-bold flex items-center gap-2">
                                <CheckCircle2 size={16}/> 推荐使用 Vercel 环境变量
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                将您的 API Key 和主 Bin ID 设置为 Vercel 项目的环境变量，变量名分别为 `REACT_APP_CLOUD_API_KEY` 和 `REACT_APP_CLOUD_BIN_ID`。
                            </p>
                         </div>
                         <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                             发布成功后，您的网站就拥有了“云端记忆”。您在后台做的任何修改，都会即时同步给所有访问者，**无需再次 Deploy**。
                         </p>
                     </div>
                 </div>
             </div>
        </div>
    );
}

// --- Sub-Component: Chat ---
const DashboardChat = () => {
  const { messages, sendAdminReply } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendAdminReply(input);
      setInput("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-[#1C1C1E] rounded-2xl border border-white/5 overflow-hidden animate-fade-in">
      {/* Left Sidebar: Contact List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-[#161618]">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input className="w-full bg-[#2C2C2E] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-medium" placeholder="搜索用户..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Mock User Item */}
          <div className="p-4 bg-brand-green-dark/20 border-l-4 border-brand-green-medium cursor-pointer hover:bg-white/5 transition">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-white text-sm">访客 #8821</span>
              <span className="text-xs text-gray-500">刚刚</span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-1">{messages[messages.length-1]?.text}</p>
          </div>
          {/* Past Users */}
          <div className="p-4 hover:bg-white/5 cursor-pointer opacity-50">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-gray-300 text-sm">访客 #7710</span>
              <span className="text-xs text-gray-600">3小时前</span>
            </div>
            <p className="text-xs text-gray-500">好的，谢谢您的解答。</p>
          </div>
        </div>
      </div>

      {/* Right Content: Chat Area */}
      <div className="flex-1 flex flex-col bg-[#1C1C1E]">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center shadow-sm z-10">
          <div>
             <h3 className="font-bold text-white">正在对话: 访客 #8821</h3>
             <p className="text-xs text-brand-green-medium flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 在线
               <span className="text-gray-600">|</span>
               来源: 首页 - 收益测算
             </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
             <div key={msg.id} className={`flex gap-4 ${msg.sender === 'ai' || msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                 ${msg.sender === 'user' ? 'bg-gray-700' : (msg.sender === 'admin' ? 'bg-brand-green-medium' : 'bg-brand-green-dark')}`}>
                 {msg.sender === 'user' ? <User size={18} className="text-gray-300"/> : (msg.sender === 'admin' ? <span className="text-xs font-bold text-white">人工</span> : <Bot size={18} className="text-white"/>)}
               </div>
               <div className={`max-w-[60%] p-4 rounded-2xl text-sm leading-relaxed
                 ${msg.sender === 'user' 
                   ? 'bg-[#2C2C2E] text-gray-200 rounded-tl-none' 
                   : 'bg-brand-green-dark/20 text-brand-green-light border border-brand-green-dark/30 rounded-tr-none'}`}>
                 {msg.text}
                 <div className="text-[10px] opacity-40 mt-2 text-right">
                   {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </div>
               </div>
             </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5 bg-[#161618]">
          <form onSubmit={handleSend} className="relative">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full bg-[#2C2C2E] text-white rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-brand-green-medium placeholder:text-gray-600"
              placeholder="输入人工回复 (将暂停 AI 接管)..."
            />
            <button type="submit" className="absolute right-2 top-2 p-2 bg-brand-green-medium text-white rounded-lg hover:bg-brand-green-dark transition">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Calculator Config ---
const DashboardCalculatorConfig = () => {
    const { content, updateCalculatorParam, updateCalculatorLaborLevel } = useContent();
    const { calculatorParams } = content;

    const models = [
        { id: 'A', name: '传统自制 (DIY)' },
        { id: 'B', name: '租赁小机器' },
        { id: 'C', name: '传统自营店' },
        { id: 'D', name: 'ONESIP LITE' },
    ];
    
    const ParamInput = ({ label, value, prefix, suffix, step, onChange }: any) => (
        <div className="flex items-center justify-between py-2 border-b border-white/5">
            <label className="text-sm text-gray-400">{label}</label>
            <div className="flex items-center gap-2">
                {prefix && <span className="text-gray-500 text-xs">{prefix}</span>}
                <input
                    type="number"
                    value={value || 0}
                    step={step || 1}
                    onChange={e => onChange(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-[#111211] text-white text-right font-mono rounded-md px-2 py-1 border border-white/10 focus:outline-none focus:ring-1 focus:ring-brand-green-medium"
                />
                {suffix && <span className="text-gray-500 text-xs">{suffix}</span>}
            </div>
        </div>
    );
    
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
             <div className="mb-8">
                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                     <Calculator className="text-purple-400" />
                     利润计算器参数配置
                 </h3>
                 <p className="text-sm text-gray-500 mt-1">修改这里的数值会实时影响前台计算器的结果。请谨慎操作。</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {models.map(model => (
                     <div key={model.id} className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-6 space-y-1">
                         <h4 className="text-lg font-bold text-white mb-2">{model.name}</h4>
                         <ParamInput label="单杯售价" value={calculatorParams[model.id as keyof typeof calculatorParams].price} prefix="€" step="0.1" onChange={(val: number) => updateCalculatorParam(model.id as any, 'price', val)} />
                         <ParamInput label="原料成本" value={(calculatorParams[model.id as keyof typeof calculatorParams].cogsRate || 0) * 100} suffix="%" step="1" onChange={(val: number) => updateCalculatorParam(model.id as any, 'cogsRate', val / 100)} />
                         <ParamInput label="杂项成本/月" value={calculatorParams[model.id as keyof typeof calculatorParams].misc} prefix="€" step="10" onChange={(val: number) => updateCalculatorParam(model.id as any, 'misc', val)} />
                         <ParamInput label="房租成本/月" value={calculatorParams[model.id as keyof typeof calculatorParams].rent} prefix="€" step="100" onChange={(val: number) => updateCalculatorParam(model.id as any, 'rent', val)} />
                         
                         <div className="pt-2"></div>
                         
                         {model.id === 'D' ? (
                             <>
                                <ParamInput label="系统服务费/月" value={calculatorParams.D.systemFee} prefix="€" step="10" onChange={(val: number) => updateCalculatorParam('D', 'systemFee', val)} />
                                <ParamInput label="品牌管理费率" value={(calculatorParams.D.brandFeeRate || 0) * 100} suffix="%" step="0.5" onChange={(val: number) => updateCalculatorParam('D', 'brandFeeRate', val / 100)} />
                                <div className="space-y-2 pt-4">
                                     <label className="text-sm text-gray-400 block mb-2">弹性人工成本</label>
                                     {(calculatorParams.D.laborLevels || []).map((level, i) => (
                                         <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                             日均销量低于 <input type="number" value={level.maxCups} onChange={e => updateCalculatorLaborLevel(i, 'maxCups', parseInt(e.target.value) || 0)} className="w-16 bg-[#111211] text-center text-white font-mono rounded-md px-1 py-0.5 border border-white/10" /> 杯,
                                             人工成本为 € <input type="number" value={level.cost} onChange={e => updateCalculatorLaborLevel(i, 'cost', parseInt(e.target.value) || 0)} className="w-20 bg-[#111211] text-center text-white font-mono rounded-md px-1 py-0.5 border border-white/10" />
                                         </div>
                                     ))}
                                </div>
                             </>
                         ) : (
                             <>
                                <ParamInput label="固定人工/月" value={calculatorParams[model.id as keyof typeof calculatorParams].laborFixed} prefix="€" step="100" onChange={(val: number) => updateCalculatorParam(model.id as any, 'laborFixed', val)} />
                                <ParamInput label="固定设备/月" value={calculatorParams[model.id as keyof typeof calculatorParams].equipFixed} prefix="€" step="50" onChange={(val: number) => updateCalculatorParam(model.id as any, 'equipFixed', val)} />
                                <ParamInput label="产能上限" value={calculatorParams[model.id as keyof typeof calculatorParams].capCups} suffix="杯/天" step="5" onChange={(val: number) => updateCalculatorParam(model.id as any, 'capCups', val)} />
                             </>
                         )}
                     </div>
                 ))}
             </div>
        </div>
    )
}


// --- Main Layout ---

export const AdminDashboard = () => {
  const { logout, closeDashboard } = useContent();
  const [activeTab, setActiveTab] = useState<'home' | 'cms' | 'chat' | 'settings' | 'leads' | 'calculator'>('home');

  return (
    <div className="flex h-screen w-full bg-[#111211] text-gray-200 font-sans selection:bg-brand-green-medium selection:text-white overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-white/5">
             <LogoSymbol className="w-6 h-6 text-brand-green-medium mr-3" />
             <span className="font-bold text-white tracking-wider text-lg">ONESIP<span className="text-brand-green-medium text-xs ml-1">ADMIN</span></span>
          </div>

          <div className="p-4 space-y-2 mt-4">
             {/* --- NEW: Exit Button --- */}
            <button 
                onClick={closeDashboard}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-2 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回前台应用
            </button>
            
            <div className="h-px bg-white/5 my-2 mx-4"></div>
            {/* ------------------------ */}

            <button 
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <LayoutDashboard size={18} /> 概览 / 模块
            </button>
            <button 
                onClick={() => setActiveTab('leads')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'leads' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <ClipboardList size={18} /> 加盟申请 (Leads)
            </button>
            <button 
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <MessageSquare size={18} /> 客服中心
            </button>
            <button 
                onClick={() => setActiveTab('calculator')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calculator' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <Calculator size={18} /> 测算器配置
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <Settings size={18} /> 系统设置
            </button>
          </div>
          
          <div className="px-4 mt-8">
            <div className="text-xs font-bold text-gray-600 uppercase tracking-widest px-4 mb-2">CMS 装修</div>
            <button 
                onClick={closeDashboard}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 border border-white/10 hover:border-brand-green-medium hover:text-brand-green-medium transition-all group"
            >
                <Edit3 size={18} className="group-hover:rotate-12 transition-transform"/> 进入可视化编辑
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
           <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} /> 退出登录
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#111211]/80 backdrop-blur z-20">
          <h2 className="text-2xl font-bold text-white capitalize">
             {activeTab === 'home' && "控制台 / 模块显示管理"}
             {activeTab === 'leads' && "加盟申请 (Leads)"}
             {activeTab === 'chat' && "客服中心 (Live Chat)"}
             {activeTab === 'calculator' && "利润测算器配置"}
             {activeTab === 'settings' && "系统设置 (System Settings)"}
          </h2>
          <div className="flex items-center gap-4">
             <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition">
                <Bell size={18} />
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden md:block">
                   <div className="text-sm font-bold text-white">Admin User</div>
                   <div className="text-xs text-gray-500">Super Administrator</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green-medium to-brand-green-dark"></div>
             </div>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-8 bg-[#0F0F10]">
            {activeTab === 'home' && <DashboardHome onNavigate={setActiveTab} />}
            {activeTab === 'leads' && <DashboardLeads />}
            {activeTab === 'chat' && <DashboardChat />}
            {activeTab === 'calculator' && <DashboardCalculatorConfig />}
            {activeTab === 'settings' && <DashboardSettings />}
        </div>
      </div>
    </div>
  );
};