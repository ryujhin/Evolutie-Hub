
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
  // Extract base color name from Tailwind class bg-primary or bg-secondary
  const isBordeaux = color.includes('secondary');
  const iconColorClass = isBordeaux ? 'text-secondary' : color.includes('emerald') ? 'text-emerald-600' : 'text-primary';
  const bgColorClass = isBordeaux ? 'bg-secondary/10' : color.includes('emerald') ? 'bg-emerald-50' : 'bg-primary/10';

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex items-start justify-between group hover:border-secondary/30 transition-all">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-primary tracking-tighter">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 font-bold mt-1">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-2xl ${bgColorClass} ${iconColorClass} transition-colors group-hover:bg-secondary group-hover:text-white`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default MetricCard;
