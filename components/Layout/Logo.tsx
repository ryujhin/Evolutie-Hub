
import React from 'react';
import { Layers } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', collapsed = false }) => {
  const iconSize = {
    sm: 18,
    md: 24,
    lg: 42
  }[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`
        flex items-center justify-center 
        ${size === 'lg' ? 'w-16 h-16 rounded-2xl' : 'w-10 h-10 rounded-xl'} 
        bg-secondary text-white shadow-lg shadow-secondary/30 transition-transform hover:scale-105
      `}>
        <Layers size={iconSize} />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tighter text-white leading-none ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>
            EVOLUTIE<span className="text-secondary ml-0.5">HUB</span>
          </span>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">
            Dashboard Contábil
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
