
import React, { useState, useMemo } from 'react';
import { useCompanies } from '../contexts/CompanyContext';
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  X,
  CheckCircle,
  Plus,
  Edit2,
  AlertCircle,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Companies: React.FC = () => {
  const { companies } = useCompanies();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    conciliacao: null as boolean | null,
    caixa: null as 'positivo' | 'negativo' | null,
    parcelamento: null as boolean | null
  });

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj.includes(searchTerm) ||
        c.codigoAlterdata.includes(searchTerm);

      const matchConc = filters.conciliacao === null || c.conciliacaoBancaria === filters.conciliacao;
      const matchCaixa = filters.caixa === null || c.situacaoCaixa === filters.caixa;
      const matchParc = filters.parcelamento === null || c.parcelamentoAtivo === filters.parcelamento;

      return matchSearch && matchConc && matchCaixa && matchParc;
    });
  }, [companies, searchTerm, filters]);

  const toggleFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Gestão de Empresas</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Gerenciamento analítico de conformidade da carteira.</p>
        </div>
        <Link
          to="/empresas/nova"
          className="bg-secondary text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
        >
          <Plus size={18} />
          Cadastrar Empresa
        </Link>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Razão Social, CNPJ ou Código ERP..."
              className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none transition-all text-sm font-bold text-primary placeholder:font-normal placeholder:text-slate-300"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 mr-3 text-slate-400">
              <Filter size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Filtros</span>
            </div>

            <button
              onClick={() => toggleFilter('conciliacao', true)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filters.conciliacao === true ? 'bg-secondary text-white border-secondary' : 'bg-white text-slate-400 border-slate-100 hover:border-secondary/40'}`}
            >
              Conciliadas
            </button>

            <button
              onClick={() => toggleFilter('parcelamento', true)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filters.parcelamento === true ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/40'}`}
            >
              Parcelamento (Ativo)
            </button>

            <button
              onClick={() => toggleFilter('caixa', 'negativo')}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filters.caixa === 'negativo' ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' : 'bg-white text-slate-400 border-slate-100 hover:border-secondary/40'}`}
            >
              Caixa Negativo
            </button>

            {(filters.conciliacao !== null || filters.caixa !== null || filters.parcelamento !== null) && (
              <button
                onClick={() => setFilters({ conciliacao: null, caixa: null, parcelamento: null })}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Limpar filtros"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCompanies.map(company => (
            <div key={company.id} className="bg-white rounded-[2.5rem] border border-slate-100 hover:border-secondary/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 p-8 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-[80%]">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ERP: {company.codigoAlterdata}</span>
                    <h3 className="font-bold text-primary text-xl truncate mt-1 group-hover:text-secondary transition-colors">{company.nome}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">{company.cnpj}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/empresas/editar/${company.id}`)}
                    className="p-3 text-slate-300 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all"
                    title="Editar empresa"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Conciliação</span>
                    <span className={`flex items-center gap-2 text-[11px] font-bold ${company.conciliacaoBancaria ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {company.conciliacaoBancaria ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {company.conciliacaoBancaria ? 'REALIZADA' : 'NÃO REALIZADA'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Parcelamento</span>
                    <span className={`text-[11px] font-bold ${company.parcelamentoAtivo ? 'text-secondary' : 'text-slate-400'}`}>
                      {company.parcelamentoAtivo ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Saúde Caixa</span>
                    <span className={`flex items-center gap-2 text-[11px] font-bold ${company.situacaoCaixa === 'negativo' ? 'text-secondary' : 'text-emerald-600'}`}>
                      {company.situacaoCaixa === 'negativo' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                      {company.situacaoCaixa.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={`/empresas/${company.id}`}
                className="w-full bg-slate-50 text-primary group-hover:bg-secondary group-hover:text-white text-[10px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 border border-transparent group-hover:shadow-lg group-hover:shadow-secondary/20"
              >
                Gerenciamento Contábil
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}

          {filteredCompanies.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Building2 size={48} />
              </div>
              <h4 className="text-2xl font-bold text-primary">Nenhum resultado</h4>
              <p className="text-slate-400 font-medium mt-2">Revise os termos de busca ou filtros ativos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
