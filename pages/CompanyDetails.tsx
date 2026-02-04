
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompanies } from '../contexts/CompanyContext';
import {
  Building2,
  ChevronLeft,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { getMonthName } from '../utils/helpers';
import { TaxStatus } from '../types';

const CompanyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies, deleteCompany, updateTaxStatus, updateFeeStatus } = useCompanies();
  const [activeTab, setActiveTab] = useState<'impostos' | 'honorarios'>('impostos');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [editingItem, setEditingItem] = useState<{ type: 'tax' | 'fee', taxType?: 'inss' | 'simples' | 'fgts', month: number } | null>(null);

  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Empresa não encontrada</h2>
        <Link to="/" className="text-primary font-bold mt-4 hover:underline">Voltar para o Dashboard</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir ${company.nome}? Esta ação é irreversível.`)) {
      deleteCompany(company.id);
      navigate('/');
    }
  };

  const statusColors = {
    'lançado': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'em_aberto': 'text-amber-600 bg-amber-50 border-amber-100',
    'atrasado': 'text-red-600 bg-red-50 border-red-100'
  };

  const statusIcons = {
    'lançado': <CheckCircle2 size={14} />,
    'em_aberto': <Clock size={14} />,
    'atrasado': <AlertCircle size={14} />
  };

  const handleUpdateStatus = (status: TaxStatus | 'lançado' | 'em_aberto', date: string | null) => {
    if (!editingItem) return;

    if (editingItem.type === 'tax' && editingItem.taxType) {
      updateTaxStatus(company.id, selectedYear, editingItem.taxType, editingItem.month, status as TaxStatus, date);
    } else {
      updateFeeStatus(company.id, selectedYear, editingItem.month, status as any, date);
    }
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">{company.nome}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${company.situacaoCaixa === 'positivo' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                Caixa {company.situacaoCaixa === 'positivo' ? 'Positivo' : 'Negativo'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{company.cnpj} | Cód. {company.codigoAlterdata}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white rounded-xl border border-gray-100 hover:text-secondary transition-all" title="Editar">
            <Edit2 size={18} />
          </button>
          <button onClick={handleDelete} className="p-2.5 bg-white rounded-xl border border-gray-100 hover:text-red-500 transition-all" title="Excluir">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Badges / Stats Quick View */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${company.conciliacaoBancaria ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm font-semibold text-gray-600">Conciliação Bancária: {company.conciliacaoBancaria ? 'Sim' : 'Não'}</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${company.parcelamentoAtivo ? 'bg-amber-500' : 'bg-gray-300'}`} />
          <span className="text-sm font-semibold text-gray-600">Parcelamento: {company.parcelamentoAtivo ? 'Ativo' : 'Inativo'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 px-6 pt-6">
          <button
            onClick={() => setActiveTab('impostos')}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${activeTab === 'impostos' ? 'border-secondary text-secondary' : 'border-transparent text-gray-400 hover:text-primary'}`}
          >
            <FileText size={18} />
            Impostos Anuais
          </button>
          <button
            onClick={() => setActiveTab('honorarios')}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${activeTab === 'honorarios' ? 'border-secondary text-secondary' : 'border-transparent text-gray-400 hover:text-primary'}`}
          >
            <CreditCard size={18} />
            Honorários
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-primary">Cronograma de {activeTab === 'impostos' ? 'Impostos' : 'Honorários'}</h3>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="bg-background border-none outline-none font-bold text-sm px-4 py-2 rounded-lg"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          {activeTab === 'impostos' ? (
            <div className="overflow-x-auto custom-scrollbar pb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background">
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-l-lg">Mês</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">INSS</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Simples Nacional</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-r-lg">FGTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                    const yearData = company.impostos[selectedYear] || { inss: [], simples: [], fgts: [] };
                    const types: ('inss' | 'simples' | 'fgts')[] = ['inss', 'simples', 'fgts'];

                    return (
                      <tr key={month} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4 font-bold text-sm text-gray-600">{getMonthName(month)}</td>
                        {types.map(type => {
                          const entry = yearData[type].find(e => e.mes === month) || { status: 'em_aberto', data: null };
                          return (
                            <td key={type} className="px-4 py-4">
                              <button
                                onClick={() => setEditingItem({ type: 'tax', taxType: type, month })}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all hover:scale-105 active:scale-95 ${statusColors[entry.status as TaxStatus]}`}
                              >
                                {statusIcons[entry.status as TaxStatus]}
                                <span className="capitalize">{entry.status.replace('_', ' ')}</span>
                                {entry.data && <span className="text-[9px] opacity-60">• {new Date(entry.data).toLocaleDateString('pt-BR')}</span>}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                const yearData = company.honorarios[selectedYear] || [];
                const entry = yearData.find(e => e.mes === month) || { status: 'em_aberto', data: null };

                return (
                  <div
                    key={month}
                    onClick={() => setEditingItem({ type: 'fee', month })}
                    className={`p-4 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer hover:border-secondary transition-all group ${entry.status === 'lançado' ? 'bg-emerald-50/20' : 'bg-white'}`}
                  >
                    <div>
                      <p className="font-bold text-sm text-primary">{getMonthName(month)} {selectedYear}</p>
                      <p className={`text-[10px] font-bold uppercase mt-1 ${entry.status === 'lançado' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {entry.status.replace('_', ' ')}
                      </p>
                    </div>
                    {entry.status === 'lançado' ? (
                      <div className="bg-emerald-500 text-white p-2 rounded-full">
                        <CheckCircle2 size={20} />
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-400 p-2 rounded-full group-hover:bg-secondary group-hover:text-white transition-all">
                        <Clock size={20} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal / Tooltip Placeholder Logic */}
      {editingItem && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-primary">Atualizar Competência</h4>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Período e Tipo</p>
                <div className="p-3 bg-background rounded-xl text-sm font-bold text-primary">
                  {getMonthName(editingItem.month)} / {selectedYear} {editingItem.taxType ? ` - ${editingItem.taxType.toUpperCase()}` : ''}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus('lançado', new Date().toISOString())}
                    className="p-3 border border-gray-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Lançado
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('em_aberto', null)}
                    className="p-3 border border-gray-100 rounded-xl hover:bg-amber-50 hover:border-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Clock size={16} className="text-amber-500" />
                    Em Aberto
                  </button>
                  {editingItem.type === 'tax' && (
                    <button
                      onClick={() => handleUpdateStatus('atrasado', null)}
                      className="p-3 border border-gray-100 rounded-xl hover:bg-red-50 hover:border-red-200 text-xs font-bold transition-all flex items-center justify-center gap-2 col-span-2"
                    >
                      <AlertCircle size={16} className="text-red-500" />
                      Atrasado
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
