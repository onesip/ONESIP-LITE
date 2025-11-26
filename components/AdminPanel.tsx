
import React, { useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { Settings, Save, RotateCcw, X, Edit3, Lock, LogIn, ChevronRight } from 'lucide-react';

export const AdminPanel = () => {
  const { isAdmin, toggleAdmin, saveChanges, resetContent } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // 监听 isAdmin 状态，如果外部变为 false (例如刷新)，需重置认证
  useEffect(() => {
    if (!isAdmin && isAuthenticated) {
        // Optional: Keep session active or strict reset? 
        // For now, let's keep it simple: if you are admin, you are authenticated.
    }
  }, [isAdmin]);

  const handleTriggerClick = () => {
    if (isAuthenticated) {
        setIsOpen(!isOpen);
    } else {
        setShowLogin(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0117") {
        setIsAuthenticated(true);
        setShowLogin(false);
        setIsOpen(true);
        if (!isAdmin) toggleAdmin(); // Auto-enable edit mode on login
        setPassword("");
        setError(false);
    } else {
        setError(true);
        // Shake animation logic could go here
    }
  };

  return (
    <>
      {/* Password Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[10000] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs border border-brand-green-dark/10 relative overflow-hidden">
                <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                </button>
                <div className="text-center mb-6">
                    <div className="w-10 h-10 bg-brand-green-dark text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Lock size={18} />
                    </div>
                    <h3 className="text-brand-dark font-bold">管理员验证</h3>
                    <p className="text-xs text-brand-green-medium/70 mt-1">请输入访问密码</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            className={`w-full bg-brand-cream border text-center text-lg tracking-widest font-bold text-brand-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-brand-green-dark/10 focus:ring-brand-green-dark/20'}`}
                            placeholder="••••"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-[10px] text-center mt-2 font-medium">密码错误</p>}
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-brand-dark text-brand-cream font-bold py-3 rounded-xl hover:bg-brand-green-dark transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        验证 <ChevronRight size={14} />
                    </button>
                </form>
            </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-4">
        
        {/* Admin Menu */}
        {isOpen && isAuthenticated && (
          <div className="bg-brand-dark text-brand-cream p-4 rounded-2xl shadow-2xl w-64 animate-in slide-in-from-bottom-5 border border-white/10 mb-2">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <h3 className="font-bold text-sm flex items-center gap-2"><Settings size={16}/> 后台管理</h3>
              <button onClick={() => setIsOpen(false)} className="hover:text-white/50"><X size={16}/></button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">编辑模式</span>
                <button 
                  onClick={toggleAdmin}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isAdmin ? 'bg-brand-green-medium' : 'bg-gray-600'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isAdmin ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {isAdmin && (
                  <>
                      <button 
                          onClick={saveChanges}
                          className="w-full flex items-center justify-center gap-2 bg-brand-cream text-brand-dark py-2 rounded-lg text-xs font-bold hover:bg-white transition-colors"
                      >
                          <Save size={14} /> 保存更改 (发布)
                      </button>
                      
                      <button 
                          onClick={resetContent}
                          className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-colors"
                      >
                          <RotateCcw size={14} /> 重置所有内容
                      </button>
                  </>
              )}
            </div>
          </div>
        )}

        {/* Discreet Floating Trigger Button */}
        <button 
          onClick={handleTriggerClick}
          className={`group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-sm
              ${isOpen || showLogin 
                  ? 'bg-brand-dark text-white opacity-100 shadow-xl scale-110' 
                  : 'bg-black/5 text-brand-dark/20 opacity-20 hover:opacity-100 hover:bg-brand-dark hover:text-white hover:scale-110'
              }`}
          title="Admin Access"
        >
          {isOpen ? <X size={14} /> : <Lock size={14} />}
        </button>
      </div>
    </>
  );
};
