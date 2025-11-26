
import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';

interface ChatContextType {
  isOpen: boolean;
  toggleChat: () => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  sendAdminReply: (text: string) => void;
  isTyping: boolean;
  unreadCount: number;
  clearUnread: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      text: "👋 您好！我是 ONESIP 智能助手。\n对“店中店”模式感兴趣吗？我可以为您解答关于【收益】、【设备】或【加盟流程】的问题。",
      sender: 'ai',
      timestamp: Date.now(),
      isRead: false
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      clearUnread();
    }
  };

  const clearUnread = () => setUnreadCount(0);

  const sendMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
      isRead: true
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Simulate AI Response
    const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));

    try {
        const responseText = await getChatResponse(history, text);
        
        // Check if admin interrupted? (Simplified logic: AI always replies for now unless admin jumps in quickly, 
        // but for this demo, we assume AI replies immediately).
        
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'ai',
            timestamp: Date.now(),
            isRead: isOpen 
        };

        setMessages(prev => [...prev, aiMsg]);
        if (!isOpen) {
            setUnreadCount(prev => prev + 1);
        }
    } catch (e) {
        console.error("Chat error", e);
    } finally {
        setIsTyping(false);
    }
  };

  // New: Admin Reply Function (Does not trigger AI)
  const sendAdminReply = (text: string) => {
      const adminMsg: ChatMessage = {
          id: Date.now().toString(),
          text,
          sender: 'admin',
          timestamp: Date.now(),
          isRead: true
      };
      setMessages(prev => [...prev, adminMsg]);
  };

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, messages, sendMessage, sendAdminReply, isTyping, unreadCount, clearUnread }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
