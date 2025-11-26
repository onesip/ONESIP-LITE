
import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { LogoSymbol } from './BrandLogo';
import { ArrowRight, Lock } from 'lucide-react';

export const AdminLogin = () => {
  const { login } = useContent();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0117") {
      login();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000); // Reset shake
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-green-dark/20 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-green-medium/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-green-dark/20">
            <LogoSymbol className="w-8 h-8 text-brand-green-medium" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">ONESIP <span className="text-brand-green-medium">ADMIN</span></h1>
          <p className="text-gray-500 text-sm">请输入管理密钥以访问控制台</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className={`absolute inset-0 bg-brand-green-medium/20 rounded-xl blur transition duration-500 ${error ? 'bg-red-500/30' : 'opacity-0 group-focus-within:opacity-100'}`}></div>
            <div className="relative bg-[#161618] border border-white/10 rounded-xl flex items-center p-1 focus-within:border-brand-green-medium/50 transition-colors">
               <div className="w-12 h-12 flex items-center justify-center text-gray-500">
                  <Lock size={18} />
               </div>
               <input 
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="bg-transparent w-full h-12 text-white placeholder:text-gray-700 outline-none font-mono text-lg tracking-widest"
                 placeholder="••••"
                 autoFocus
               />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-brand-green-medium hover:bg-brand-green-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-brand-green-medium/20 flex items-center justify-center gap-2 group"
          >
            解锁控制台 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </form>

        {error && (
            <p className="text-center text-red-500 text-xs font-bold mt-6 animate-pulse">
                密码无效，请重试
            </p>
        )}
      </div>

      <div className="absolute bottom-8 text-xs text-gray-700 font-mono">
        SECURE SYSTEM V2.5.0
      </div>
    </div>
  );
};
