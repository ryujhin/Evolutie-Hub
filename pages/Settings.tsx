
import React from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const sections = [
    { icon: User, label: 'Perfil do Usuário', desc: 'Gerencie seu nome e preferências de login' },
    { icon: Shield, label: 'Segurança', desc: 'Senhas e autenticação em duas etapas' },
    { icon: Bell, label: 'Notificações', desc: 'Alertas de vencimentos e prazos' },
    { icon: Palette, label: 'Aparência', desc: 'Modo escuro e cores do sistema' },
    { icon: Globe, label: 'Integrações', desc: 'Conectar com Alterdata e outros ERPs' },
  ];

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-left duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Configurações</h1>
          <p className="text-gray-500 text-sm">Personalize sua experiência no Evolutie Hub.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-secondary/20 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-background text-gray-400 group-hover:text-secondary group-hover:bg-secondary/5 rounded-xl transition-all">
                <section.icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-primary group-hover:text-secondary transition-colors">{section.label}</h3>
                <p className="text-xs text-gray-400 mt-1">{section.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/10 border-dashed text-center">
        <p className="text-primary font-bold">Deseja solicitar uma funcionalidade?</p>
        <p className="text-gray-500 text-sm mt-1 mb-6">Nossa equipe está sempre evoluindo o sistema.</p>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all">
          Abrir Ticket de Sugestão
        </button>
      </div>
    </div>
  );
};

export default Settings;
