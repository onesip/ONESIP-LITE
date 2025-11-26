import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { X, Send, MapPin, Store, User, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { LogoSymbol } from './BrandLogo';

export const LeadFormModal = () => {
  const { isLeadFormOpen, closeLeadForm, submitLead, language } = useContent();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    city: '',
    businessType: 'Restaurant/Bar',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLeadFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    await submitLead(formData);
    setIsSubmitting(false);
    setStep('success');
  };

  const handleClose = () => {
    closeLeadForm();
    // Reset form after closing animation
    setTimeout(() => {
        setStep('form');
        setFormData({
            name: '',
            contact: '',
            city: '',
            businessType: 'Restaurant/Bar',
            message: ''
        });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="bg-brand-dark p-6 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green-medium/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-green-medium">
                    <LogoSymbol className="w-6 h-6"/>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">
                        {language === 'zh' ? '申请加盟咨询' : 'Partnership Inquiry'}
                    </h3>
                    <p className="text-brand-green-light/70 text-xs">
                        {language === 'zh' ? 'ONESIP 招商顾问将为您提供 1v1 服务' : '1-on-1 consultation with our advisor'}
                    </p>
                </div>
            </div>
            
            <button onClick={handleClose} className="text-white/50 hover:text-white relative z-10">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="p-8">
            {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">
                                {language === 'zh' ? '您的称呼' : 'Name'}
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                                <input 
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-medium/20 focus:border-brand-green-medium transition-all"
                                    placeholder={language === 'zh' ? "姓名" : "Your Name"}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">
                                {language === 'zh' ? '所在城市' : 'City'}
                            </label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                                <input 
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({...formData, city: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-medium/20 focus:border-brand-green-medium transition-all"
                                    placeholder={language === 'zh' ? "例如: Rotterdam" : "e.g., Rotterdam"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            {language === 'zh' ? '联系方式 (电话/微信)' : 'Contact (Phone/WeChat)'}
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                            <input 
                                required
                                value={formData.contact}
                                onChange={e => setFormData({...formData, contact: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-medium/20 focus:border-brand-green-medium transition-all"
                                placeholder="+31 6 12345678"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            {language === 'zh' ? '现有店铺类型' : 'Business Type'}
                        </label>
                        <div className="relative">
                            <Store size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                            <select 
                                value={formData.businessType}
                                onChange={e => setFormData({...formData, businessType: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-medium/20 focus:border-brand-green-medium transition-all appearance-none"
                            >
                                <option>Restaurant/Bar (餐厅/食堂)</option>
                                <option>Retail/Market (零售/超市)</option>
                                <option>Cafe/Bakery (咖啡/烘焙)</option>
                                <option>Other (其他业态)</option>
                                <option>Planning (尚未开店)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            {language === 'zh' ? '您的问题或备注 (选填)' : 'Message (Optional)'}
                        </label>
                        <div className="relative">
                            <MessageSquare size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                            <textarea 
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-medium/20 focus:border-brand-green-medium transition-all min-h-[80px]"
                                placeholder={language === 'zh' ? "例如：我想了解具体的设备尺寸..." : "e.g., questions about machine size..."}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-brand-green-medium hover:bg-brand-green-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-green-medium/30 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">{language === 'zh' ? '提交中...' : 'Sending...'}</span>
                        ) : (
                            <>
                                {language === 'zh' ? '提交申请' : 'Submit Inquiry'} <Send size={18} />
                            </>
                        )}
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-400 mt-4">
                        {language === 'zh' ? '*您的信息仅用于商务联系，严格保密。' : '*Your info is kept confidential.'}
                    </p>

                </form>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 text-brand-green-medium rounded-full flex items-center justify-center mb-6 shadow-xl">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-brand-dark mb-2">
                        {language === 'zh' ? '申请已提交！' : 'Sent Successfully!'}
                    </h3>
                    <p className="text-gray-500 text-center max-w-xs mb-8">
                        {language === 'zh' ? '感谢您的信任。ONESIP 招商顾问将在 24 小时内通过电话或微信与您联系。' : 'Thank you. Our advisor will contact you within 24 hours.'}
                    </p>
                    <button 
                        onClick={handleClose}
                        className="bg-gray-100 text-brand-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {language === 'zh' ? '关闭窗口' : 'Close'}
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};