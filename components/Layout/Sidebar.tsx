
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Encerrar sessão administrativa?')) {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard Geral', path: '/' },
    { icon: Building2, label: 'Empresas', path: '/empresas' },
    { icon: DollarSign, label: 'Faturamento', path: '/faturamento', disabled: true },
    { icon: SettingsIcon, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-primary text-white transition-all duration-300 z-50 flex flex-col border-r border-white/5
        ${isCollapsed ? 'w-20' : 'w-72'}`}
    >
      <div className="p-8 h-24 flex items-center overflow-hidden border-b border-white/5">
        <Logo collapsed={isCollapsed} />
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-secondary p-1 rounded-full text-white shadow-xl hover:scale-110 transition-transform z-[60]"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="flex-1 mt-10 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.disabled ? '#' : item.path}
            className={({ isActive }) => `
              flex items-center gap-4 p-4 rounded-2xl transition-all group relative
              ${isActive && !item.disabled ? 'bg-secondary text-white shadow-lg shadow-secondary/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon size={22} className="shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {item.disabled && (
                  <span className="text-[8px] font-black bg-white/10 text-white/50 px-1.5 py-0.5 rounded uppercase tracking-tighter ml-2">
                    Em Breve
                  </span>
                )}
              </div>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-primary text-[10px] font-black uppercase rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] border border-white/10">
                {item.label} {item.disabled ? '(Em Breve)' : ''}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-4 py-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-black text-lg shrink-0 shadow-inner">
              {user?.nome.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold truncate text-xs">{user?.nome}</p>
              <p className="text-[9px] text-white/30 truncate uppercase font-black tracking-widest mt-1">Nível Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 w-full p-4 rounded-2xl text-slate-400 hover:bg-secondary/10 hover:text-secondary transition-all
            ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={22} className="shrink-0" />
          {!isCollapsed && <span className="font-black text-[10px] uppercase tracking-widest">Sair do Hub</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
