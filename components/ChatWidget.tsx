import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { LogoSymbol } from './BrandLogo';
import { useContent } from '../contexts/ContentContext';

export const ChatWidget = () => {
  const { isOpen, toggleChat, messages, sendMessage, isTyping, unreadCount } = useChat();
  const { language } = useContent();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-brand-green-dark/10 overflow-hidden transition-all duration-300 origin-bottom-right mb-4 flex flex-col
        ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[500px]' : 'opacity-0 scale-95 translate-y-10 h-0'}
        `}
      >
        {/* Header */}
        <div className="bg-brand-green-dark p-4 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-3">
              <div className="bg-brand-cream/10 p-1.5 rounded-lg text-brand-cream">
                 <LogoSymbol className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-white font-bold text-sm">
                     {language === 'zh' ? 'ONESIP 助手' : 'ONESIP Assistant'}
                 </h3>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-brand-green-light text-[10px]">
                        {language === 'zh' ? '在线 · 自动回复中' : 'Online · Auto-reply'}
                    </span>
                 </div>
              </div>
           </div>
           <button onClick={toggleChat} className="text-brand-green-light hover:text-white transition">
              <X size={20} />
           </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-cream/30">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border 
                   ${msg.sender === 'user' ? 'bg-brand-cream border-brand-green-dark/10' : 'bg-brand-green-dark border-transparent text-white'}`}>
                   {msg.sender === 'user' ? <User size={14} className="text-brand-dark"/> : (msg.sender === 'admin' ? <span className="text-[10px] font-bold">{language === 'zh' ? '人工' : 'Staff'}</span> : <Bot size={14}/>)}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                   ${msg.sender === 'user' 
                     ? 'bg-brand-dark text-white rounded-tr-none' 
                     : 'bg-white text-brand-dark rounded-tl-none border border-brand-green-dark/5'
                   }`}>
                   {msg.text.split('\n').map((line, i) => (
                     <React.Fragment key={i}>
                       {line}
                       {i < msg.text.split('\n').length - 1 && <br />}
                     </React.Fragment>
                   ))}
                </div>
             </div>
           ))}
           
           {isTyping && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-green-dark flex items-center justify-center shrink-0 text-white">
                  <Bot size={14}/>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-brand-green-dark/5 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-brand-green-medium/40 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-brand-green-medium/40 rounded-full animate-bounce delay-150"></span>
                   <span className="w-1.5 h-1.5 bg-brand-green-medium/40 rounded-full animate-bounce delay-300"></span>
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-brand-green-dark/5 shrink-0">
           <form onSubmit={handleSend} className="relative">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={language === 'zh' ? "输入您的问题..." : "Type your question..."}
                className="w-full bg-brand-cream/50 border border-brand-green-dark/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark/10 transition-all placeholder:text-brand-green-medium/50"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim()}
                className="absolute right-2 top-2 p-1.5 bg-brand-green-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-green-medium transition-all"
              >
                <Send size={16} />
              </button>
           </form>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button 
        onClick={toggleChat}
        className={`pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white
          ${isOpen ? 'bg-brand-cream text-brand-green-dark rotate-90' : 'bg-brand-green-dark text-white rotate-0'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        
        {/* Unread Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
            {unreadCount}
          </span>
        )}

        {/* Hover Label */}
        {!isOpen && (
           <span className="absolute right-16 bg-white text-brand-dark text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
             {language === 'zh' ? '咨询加盟顾问' : 'Talk to us'}
           </span>
        )}
      </button>

    </div>
  );
};