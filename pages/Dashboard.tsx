
import React, { useMemo } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import MetricCard from '../components/Dashboard/MetricCard';
import {
  Building2,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  FileWarning
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { companies } = useCompanies();

  const stats = useMemo(() => {
    const total = companies.length;
    const conciliacao = companies.filter(c => c.conciliacaoBancaria).length;
    const caixaPositivo = companies.filter(c => c.situacaoCaixa === 'positivo').length;

    return [
      { title: 'Empresas Ativas', value: total, icon: Building2, color: 'bg-primary', sub: 'Carteira total' },
      { title: 'Conformidade', value: `${((conciliacao / total) * 100 || 0).toFixed(0)}%`, icon: ShieldCheck, color: 'bg-secondary', sub: 'Conciliação Bancária' },
      { title: 'Saúde de Caixa', value: caixaPositivo, icon: Wallet, color: 'bg-emerald-600', sub: 'Fluxo Positivo' },
      { title: 'Performance', value: 'High', icon: TrendingUp, color: 'bg-primary', sub: 'Indicador Global' },
    ];
  }, [companies]);

  // Lógica de Alertas focada estritamente em pendências operacionais/fiscais
  // NÃO inclui caixa negativo conforme solicitado
  const operationalAlerts = useMemo(() => {
    const alerts = [];

    // Contagem de empresas com impostos atrasados
    const currentYear = new Date().getFullYear();
    const withTaxIssues = companies.filter(c => {
      const yearTaxes = c.impostos[currentYear];
      if (!yearTaxes) return false;
      return [...yearTaxes.inss, ...yearTaxes.simples, ...yearTaxes.fgts]
        .some(t => t.status === 'atrasado');
    });

    // Contagem de empresas com conciliação não realizada
    const nonConciliated = companies.filter(c => !c.conciliacaoBancaria);

    if (withTaxIssues.length > 0) {
      alerts.push({
        label: 'Empresas com Impostos Atrasados',
        count: withTaxIssues.length,
        type: 'error',
        icon: FileWarning
      });
    }

    if (nonConciliated.length > 0) {
      alerts.push({
        label: 'Conciliações Não Realizadas',
        count: nonConciliated.length,
        type: 'warning',
        icon: Clock
      });
    }

    return alerts;
  }, [companies]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Dashboard Geral</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Controle executivo e indicadores de conformidade.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <MetricCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.sub}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-secondary rounded-2xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-primary">Alertas de Atenção</h3>
                  <p className="text-xs text-slate-400 font-medium">Pendências e atrasos operacionais detectados</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-full uppercase tracking-widest">Auditoria Automática</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operationalAlerts.map((alert, i) => (
                <div key={i} className={`p-6 rounded-2xl border-2 flex items-center justify-between group transition-all cursor-pointer ${alert.type === 'error' ? 'bg-red-50/20 border-red-100 hover:border-secondary' : 'bg-slate-50 border-slate-100 hover:border-primary'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${alert.type === 'error' ? 'text-secondary' : 'text-primary'}`}>
                      <alert.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{alert.label}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ver Pendências</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${alert.type === 'error' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                    {alert.count}
                  </div>
                </div>
              ))}
              {operationalAlerts.length === 0 && (
                <div className="col-span-2 py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <ShieldCheck size={40} className="mx-auto text-emerald-500 mb-3 opacity-20" />
                  <p className="text-slate-400 font-bold text-sm">Nenhuma pendência operacional detectada.</p>
                </div>
              )}
            </div>
          </div>

          <Link to="/empresas" className="bg-primary p-8 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer hover:bg-primary/95 transition-all shadow-xl shadow-primary/10">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <Building2 size={32} className="text-secondary" />
              </div>
              <div>
                <h4 className="text-xl font-bold">Gestão de Empresas</h4>
                <p className="text-white/40 text-sm font-medium">Controle detalhado de toda a carteira contábil.</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg shadow-secondary/30">
              <ChevronRight size={24} />
            </div>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
              <CalendarDays size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-primary">Próximos Prazos</h3>
              <p className="text-xs text-slate-400 font-medium">Cronograma tributário mensal</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {[
              { label: 'FGTS Mensal', date: '07/04', priority: 'high' },
              { label: 'Simples Nacional', date: '20/04', priority: 'medium' },
              { label: 'DCTFWeb', date: '15/04', priority: 'high' },
              { label: 'Escrituração ICMS', date: '25/04', priority: 'low' },
            ].map((deadline, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={`w-1.5 h-8 rounded-full ${deadline.priority === 'high' ? 'bg-secondary' : deadline.priority === 'medium' ? 'bg-primary' : 'bg-slate-300'}`} />
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-primary leading-none">{deadline.label}</p>
                  <p className="text-[10px] text-slate-400 font-black tracking-widest mt-2 flex items-center gap-1.5">
                    <Clock size={10} /> {deadline.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-secondary transition-all shadow-lg shadow-primary/10">
            Agenda Completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
