
import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { useChat } from '../contexts/ChatContext';
import { fetchCloudContent, createCloudBin } from '../services/storageService'; 
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Edit3, 
  LogOut, 
  Search, 
  Bell, 
  Send,
  User,
  Bot,
  PlusCircle,
  TrendingUp,
  Users,
  ArrowRight,
  Eye,
  Settings,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Sparkles,
  ExternalLink,
  Copy,
  Rocket
} from 'lucide-react';
import { LogoSymbol } from './BrandLogo';

// --- Sub-Component: Dashboard Home (Launcher) ---
const DashboardHome = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
  const { closeDashboard, content, toggleSectionVisibility } = useContent();

  const modules = [
    {
      title: "CMS 页面装修",
      desc: "可视化编辑前台内容，管理菜单产品，新增业务模块。",
      icon: Edit3,
      color: "bg-blue-500",
      action: closeDashboard, // Exit to frontend
      label: "进入装修模式"
    },
    {
      title: "媒体图库",
      desc: "集中管理全站图片资源，支持快速替换与云端链接同步。",
      icon: ImageIcon,
      color: "bg-purple-500",
      action: () => onNavigate('media'),
      label: "管理图片"
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

      {/* Stats Summary */}
      <div className="pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
         <div className="bg-[#161618] rounded-2xl p-6 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-brand-green-medium/20 text-brand-green-medium flex items-center justify-center"><Users size={20}/></div>
            <div>
              <div className="text-2xl font-bold text-white">1,204</div>
              <div className="text-xs text-gray-500">今日访问</div>
            </div>
         </div>
         <div className="bg-[#161618] rounded-2xl p-6 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><TrendingUp size={20}/></div>
            <div>
              <div className="text-2xl font-bold text-white">8.5%</div>
              <div className="text-xs text-gray-500">转化率</div>
            </div>
         </div>
         {/* More stats... */}
      </div>

    </div>
  );
};

// --- Sub-Component: Settings (Cloud) ---
const DashboardSettings = () => {
    const { cloudConfig, updateCloudConfig, content } = useContent();
    const [localBinId, setLocalBinId] = useState(cloudConfig.binId);
    const [localApiKey, setLocalApiKey] = useState(cloudConfig.apiKey);
    const [isEnabled, setIsEnabled] = useState(cloudConfig.enabled);
    const [isTesting, setIsTesting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleTestConnection = async () => {
        if (!localBinId || !localApiKey) {
            alert("请先填写 Bin ID 和 API Key");
            return;
        }
        setIsTesting(true);
        try {
            await fetchCloudContent(localBinId, localApiKey);
            alert("✅ 连接成功！云端配置有效，可以使用。");
        } catch (e) {
            alert("❌ 连接失败。请检查您的 Bin ID 和 API Key 是否正确。");
        } finally {
            setIsTesting(false);
        }
    };

    const handleAutoCreate = async () => {
        if (!localApiKey) {
            alert("请先在下方填入 X-Master-Key (API Key)");
            return;
        }
        setIsCreating(true);
        try {
            const newBinId = await createCloudBin(localApiKey, content);
            setLocalBinId(newBinId);
            setIsEnabled(true);
            
            // Save immediately
            updateCloudConfig({
                enabled: true,
                binId: newBinId,
                apiKey: localApiKey
            });
            
            alert(`🎉 成功！\n\n已自动创建仓库 ID: ${newBinId}\n配置已自动保存并开启。\n\n您现在可以去前台编辑内容了，所有修改点击保存后都会同步到云端。`);
        } catch (e) {
            alert("❌ 自动创建失败。\n请检查您的 API Key 是否正确（不要有多余空格）。\n请确保复制的是 'Master Key' 而不是 'Access Key'。");
            console.error(e);
        } finally {
            setIsCreating(false);
        }
    }

    const handleSave = () => {
        updateCloudConfig({
            enabled: isEnabled,
            binId: localBinId,
            apiKey: localApiKey
        });
        alert("设置已保存！请刷新页面以加载云端数据。");
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("已复制到剪贴板");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
             <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-8">
                 <div className="flex items-start gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                         <Cloud size={32} />
                     </div>
                     <div className="flex-1">
                         <h3 className="text-2xl font-bold text-white mb-2">云端数据同步 (JSONBin)</h3>
                         <p className="text-gray-400 leading-relaxed mb-6">
                             配置后，您在后台的修改将自动推送到云端。
                         </p>
                         
                         <div className="bg-[#111211] p-6 rounded-xl border border-white/5 space-y-6">
                             
                             {/* API KEY INPUT */}
                             <div>
                                 <label className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 block flex justify-between items-center">
                                     <span>1. 填入 X-Master-Key (API 密钥)</span>
                                     <a 
                                        href="https://jsonbin.io/app/api-keys" 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-indigo-400 hover:text-white underline text-xs flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-full transition-colors"
                                     >
                                         <ExternalLink size={10}/> 点击这里去复制 Key
                                     </a>
                                 </label>
                                 <input 
                                    value={localApiKey}
                                    onChange={(e) => setLocalApiKey(e.target.value)}
                                    placeholder="以 $2a$10$ 开头..."
                                    type="password"
                                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg p-3 text-white focus:border-brand-green-medium outline-none transition-colors font-mono text-sm"
                                 />
                                 <p className="text-[10px] text-gray-600 mt-1">请确保复制的是黄色的 "Master Key"。</p>
                             </div>

                             {/* BIN ID INPUT WITH AUTO CREATE */}
                             <div>
                                 <label className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 block">2. 生成/填入 Bin ID</label>
                                 <div className="flex flex-col sm:flex-row gap-2">
                                     <input 
                                        value={localBinId}
                                        onChange={(e) => setLocalBinId(e.target.value)}
                                        placeholder="e.g. 65f8a..."
                                        className="flex-1 bg-[#1C1C1E] border border-white/10 rounded-lg p-3 text-white focus:border-brand-green-medium outline-none transition-colors font-mono text-sm"
                                     />
                                     <button
                                        onClick={handleAutoCreate}
                                        disabled={isCreating || !localApiKey}
                                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-gray-700 text-white px-5 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                                        title="只需填好 Key，点击此按钮帮您自动生成 Bin ID"
                                     >
                                         {isCreating ? <span className="animate-spin">⏳</span> : <Sparkles size={14} />}
                                         {isCreating ? "创建中..." : "一键自动生成"}
                                     </button>
                                 </div>
                             </div>
                             
                             <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                 <label className="text-sm font-bold text-white">启用云端同步</label>
                                 <button 
                                    onClick={() => setIsEnabled(!isEnabled)}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${isEnabled ? 'bg-brand-green-medium' : 'bg-gray-700'}`}
                                 >
                                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`}></div>
                                 </button>
                             </div>
                         </div>

                         <div className="mt-8 flex gap-4">
                             <button 
                                onClick={handleSave}
                                className="px-6 py-3 bg-brand-green-medium hover:bg-brand-green-dark text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-brand-green-medium/20"
                             >
                                 <CheckCircle2 size={18} /> 保存配置
                             </button>
                             <button 
                                onClick={handleTestConnection}
                                disabled={isTesting}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors flex items-center gap-2 border border-white/10"
                             >
                                 {isTesting ? <span className="animate-spin">⏳</span> : <Wifi size={18} />} 
                                 {isTesting ? "测试中..." : "测试连接"}
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
             
             {/* --- DEPLOYMENT GUIDE (UPDATED FOR CONFIG.TS) --- */}
             <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-8">
                 <div className="flex items-start gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                         <Rocket size={32} />
                     </div>
                     <div className="flex-1">
                         <h3 className="text-2xl font-bold text-white mb-2">如何发布上线？</h3>
                         <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                            <p className="text-green-400 text-sm font-bold flex items-center gap-2">
                                <CheckCircle2 size={16}/> 您的发布流程已简化！
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                因为您已经配置了 <code>config.ts</code> 文件，您不需要在 Vercel 后台手动设置任何环境变量。
                            </p>
                         </div>
                         
                         <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                             1. 将代码推送到 GitHub。<br/>
                             2. 在 Vercel 中导入项目。<br/>
                             3. <strong>直接点击 Deploy</strong> 即可！<br/><br/>
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

// --- Sub-Component: Media Library ---
const DashboardMedia = () => {
  const { content } = useContent();
  const images = [
      { id: 'hero', src: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80", name: "Hero Product" },
      ...content.menu.map(m => ({ id: `menu-${m.id}`, src: m.image, name: m.name }))
  ];

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto animate-fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="aspect-square bg-[#1C1C1E] rounded-2xl border border-white/5 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition group">
                <PlusCircle size={40} className="text-gray-600 group-hover:text-brand-green-medium mb-2"/>
                <span className="text-sm text-gray-500 font-medium">上传新图片</span>
            </div>
            {images.map((img, i) => (
                <div key={i} className="group relative aspect-square bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/5">
                    <img src={img.src} alt={img.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button className="bg-white text-black p-2 rounded-full text-xs font-bold hover:scale-110 transition">替换</button>
                        <button className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/40 transition"><LogOut size={14}/></button>
                    </div>
                    <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur p-2 text-xs text-center text-gray-300 truncate">
                        {img.name}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

// --- Main Layout ---

export const AdminDashboard = () => {
  const { logout, closeDashboard } = useContent();
  const [activeTab, setActiveTab] = useState<'home' | 'cms' | 'media' | 'chat' | 'settings'>('home');

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
            <button 
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <LayoutDashboard size={18} /> 概览 / 模块
            </button>
            <button 
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <MessageSquare size={18} /> 客服中心
            </button>
            <button 
                onClick={() => setActiveTab('media')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'media' ? 'bg-brand-green-medium text-white shadow-lg shadow-brand-green-medium/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
                <ImageIcon size={18} /> 媒体图库
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
             {activeTab === 'chat' && "客服中心 (Live Chat)"}
             {activeTab === 'media' && "媒体图库 (Media Library)"}
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
            {activeTab === 'chat' && <DashboardChat />}
            {activeTab === 'media' && <DashboardMedia />}
            {activeTab === 'settings' && <DashboardSettings />}
        </div>
      </div>
    </div>
  );
};
