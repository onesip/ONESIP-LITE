import React from 'react';

// Exporting the raw SVG symbol for use in other components (like the Hero mockup)
// This path is reconstructed to match the "Real" ONESIP logo: A clean circular fruit, a stylized leaf, and a smile with a dot.
export const LogoSymbol = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Leaf: Stylized tea/fruit leaf on top, organic but geometric */}
    <path 
      d="M12 9.5C12 9.5 13.5 3.5 17.5 4.5C19.5 5 17.5 8.5 12 9.5Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Body: Perfect circle for the fruit/cup view */}
    <circle cx="12" cy="14" r="7.5" stroke="currentColor" strokeWidth="2" />
    
    {/* Smile: Balanced upward curve */}
    <path 
      d="M8.5 15.5C8.5 15.5 10.5 17.5 14 17" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
    
    {/* Dot/Beauty Mark: A solid dot near the smile */}
    <circle cx="15.5" cy="16" r="1" fill="currentColor" />
  </svg>
);

interface BrandLogoProps {
  dark?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ dark = false }) => (
  <div className="flex items-center gap-3 cursor-pointer select-none group">
    <div className={`
      relative w-11 h-11 flex items-center justify-center rounded-xl transform transition-transform duration-500 group-hover:rotate-12
      ${dark ? 'bg-brand-cream text-brand-green-dark shadow-sm' : 'bg-brand-green-dark text-brand-cream shadow-md'}
    `}>
      <LogoSymbol className="w-7 h-7" />
    </div>
    <div className="flex flex-col justify-center">
      <div className={`font-sans font-black text-2xl tracking-tighter leading-none flex items-center ${dark ? 'text-brand-cream' : 'text-brand-green-dark'}`}>
        ONE<span className={`transition-colors ${dark ? 'text-brand-green-light' : 'text-brand-green-medium'}`}>SIP</span>
      </div>
      <div className={`text-[0.6rem] font-bold tracking-[0.35em] uppercase ${dark ? 'text-brand-green-light/80' : 'text-brand-green-medium/80'} mt-0.5 ml-0.5`}>
        LITE
      </div>
    </div>
  </div>
);