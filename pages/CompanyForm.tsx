
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompanies } from '../contexts/CompanyContext';
import { ChevronLeft, Save, Building2, AlertCircle, Loader2, Info } from 'lucide-react';
import { maskCNPJInput } from '../utils/helpers';

const CompanyForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCompany, updateCompany, companies } = useCompanies();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    codigoAlterdata: '',
    conciliacaoBancaria: false,
    situacaoCaixa: 'positivo' as 'positivo' | 'negativo',
    parcelamentoAtivo: false
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const company = companies.find(c => c.id === id);
      if (company) {
        setFormData({
          nome: company.nome,
          cnpj: company.cnpj,
          codigoAlterdata: company.codigoAlterdata,
          conciliacaoBancaria: company.conciliacaoBancaria,
          situacaoCaixa: company.situacaoCaixa,
          parcelamentoAtivo: company.parcelamentoAtivo
        });
      }
    }
  }, [id, companies, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cnpj.length < 18) return alert('O CNPJ deve ser válido.');

    setLoading(true);

    try {
      if (isEdit && id) {
        await updateCompany(id, formData);
      } else {
        await addCompany(formData);
      }

      navigate('/empresas');
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      alert('Erro ao salvar empresa. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom duration-700">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-8 hover:text-primary transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Retornar à Gestão
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-primary p-10 text-white flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{isEdit ? 'Editar Unidade Contábil' : 'Nova Unidade Contábil'}</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Configuração de Entidade Corporativa</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60">
            <Info size={14} />
            Campos Obrigatórios
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Razão Social / Identificação</label>
              <input
                type="text"
                required
                placeholder="Ex: Evolutie Tecnologia e Contabilidade LTDA"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:bg-white transition-all font-medium"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CNPJ Institucional</label>
              <input
                type="text"
                required
                placeholder="00.000.000/0000-00"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:bg-white transition-all font-medium"
                value={formData.cnpj}
                onChange={e => setFormData({ ...formData, cnpj: maskCNPJInput(e.target.value) })}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Código Alterdata (ERP)</label>
              <input
                type="text"
                required
                placeholder="Ex: 1040"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:bg-white transition-all font-medium"
                value={formData.codigoAlterdata}
                onChange={e => setFormData({ ...formData, codigoAlterdata: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-6 space-y-8">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] border-l-4 border-secondary pl-4 py-1 bg-secondary/5">Indicadores Operacionais</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                <div className="space-y-1">
                  <span className="font-bold text-primary">Conciliação Bancária</span>
                  <p className="text-[10px] text-gray-400 font-medium">Status de conferência de extratos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.conciliacaoBancaria}
                    onChange={e => setFormData({ ...formData, conciliacaoBancaria: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                <div className="space-y-1">
                  <span className="font-bold text-primary">Parcelamento Ativo</span>
                  <p className="text-[10px] text-gray-400 font-medium">Contratos tributários em aberto</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.parcelamentoAtivo}
                    onChange={e => setFormData({ ...formData, parcelamentoAtivo: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Saúde do Fluxo de Caixa</label>
                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, situacaoCaixa: 'positivo' })}
                    className={`flex-1 py-5 px-6 rounded-[1.5rem] border-2 font-black text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${formData.situacaoCaixa === 'positivo' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-100' : 'bg-white border-gray-100 text-gray-400 opacity-50'}`}
                  >
                    CAIXA POSITIVO
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, situacaoCaixa: 'negativo' })}
                    className={`flex-1 py-5 px-6 rounded-[1.5rem] border-2 font-black text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${formData.situacaoCaixa === 'negativo' ? 'bg-red-50 border-red-500 text-red-700 shadow-xl shadow-red-100' : 'bg-white border-gray-100 text-gray-400 opacity-50'}`}
                  >
                    CAIXA NEGATIVO
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-8 rounded-2xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 px-8 rounded-2xl bg-secondary text-white font-black text-sm hover:bg-secondary/90 transition-all shadow-2xl shadow-secondary/30 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {isEdit ? 'Atualizar Entidade' : 'Finalizar Cadastro'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
