
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, TaxStatus } from '../types';
import { dbCompanyToCompany } from '../utils/helpers';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CompanyContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'impostos' | 'honorarios'>) => Promise<void>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  updateTaxStatus: (companyId: string, year: number, type: 'inss' | 'simples' | 'fgts', month: number, status: TaxStatus, date: string | null, obs?: string) => Promise<void>;
  updateFeeStatus: (companyId: string, year: number, month: number, status: 'lançado' | 'em_aberto', date: string | null, valor?: number, obs?: string) => Promise<void>;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCompanies();
    } else {
      setCompanies([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadCompanies = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Carregar empresas
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id);

      if (companiesError) throw companiesError;

      if (!companiesData || companiesData.length === 0) {
        setCompanies([]);
        setIsLoading(false);
        return;
      }

      const companyIds = companiesData.map(c => c.id);

      // Carregar impostos
      const { data: taxData, error: taxError } = await supabase
        .from('tax_entries')
        .select('*')
        .in('company_id', companyIds);

      if (taxError) throw taxError;

      // Carregar honorários
      const { data: feeData, error: feeError } = await supabase
        .from('fee_entries')
        .select('*')
        .in('company_id', companyIds);

      if (feeError) throw feeError;

      // Converter para formato da aplicação
      const formattedCompanies = companiesData.map(dbCompany => {
        const companyTaxes = (taxData || []).filter(t => t.company_id === dbCompany.id);
        const companyFees = (feeData || []).filter(f => f.company_id === dbCompany.id);
        return dbCompanyToCompany(dbCompany, companyTaxes, companyFees);
      });

      setCompanies(formattedCompanies);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCompany = async (data: Omit<Company, 'id' | 'createdAt' | 'impostos' | 'honorarios'>) => {
    if (!user) return;

    try {
      // Inserir empresa
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          codigo_alterdata: data.codigoAlterdata,
          nome: data.nome,
          cnpj: data.cnpj,
          conciliacao_bancaria: data.conciliacaoBancaria,
          situacao_caixa: data.situacaoCaixa,
          parcelamento_ativo: data.parcelamentoAtivo
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Criar entradas de impostos e honorários para o ano atual
      const currentYear = new Date().getFullYear();
      const taxEntries: any[] = [];
      const feeEntries: any[] = [];

      // Criar 12 meses de impostos (INSS, Simples, FGTS)
      for (let mes = 1; mes <= 12; mes++) {
        ['inss', 'simples', 'fgts'].forEach(tipo => {
          taxEntries.push({
            company_id: newCompany.id,
            tipo,
            ano: currentYear,
            mes,
            status: 'em_aberto',
            data: null
          });
        });

        // Criar honorários
        feeEntries.push({
          company_id: newCompany.id,
          ano: currentYear,
          mes,
          status: 'em_aberto',
          data: null
        });
      }

      await supabase.from('tax_entries').insert(taxEntries);
      await supabase.from('fee_entries').insert(feeEntries);

      // Recarregar empresas
      await loadCompanies();
    } catch (error) {
      console.error('Erro ao adicionar empresa:', error);
      throw error;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const dbUpdates: any = {};
      if (updates.codigoAlterdata !== undefined) dbUpdates.codigo_alterdata = updates.codigoAlterdata;
      if (updates.nome !== undefined) dbUpdates.nome = updates.nome;
      if (updates.cnpj !== undefined) dbUpdates.cnpj = updates.cnpj;
      if (updates.conciliacaoBancaria !== undefined) dbUpdates.conciliacao_bancaria = updates.conciliacaoBancaria;
      if (updates.situacaoCaixa !== undefined) dbUpdates.situacao_caixa = updates.situacaoCaixa;
      if (updates.parcelamentoAtivo !== undefined) dbUpdates.parcelamento_ativo = updates.parcelamentoAtivo;

      const { error } = await supabase
        .from('companies')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await loadCompanies();
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      throw error;
    }
  };

  const updateTaxStatus = async (
    companyId: string,
    year: number,
    type: 'inss' | 'simples' | 'fgts',
    month: number,
    status: TaxStatus,
    date: string | null,
    obs?: string
  ) => {
    try {
      const { error } = await supabase
        .from('tax_entries')
        .upsert({
          company_id: companyId,
          tipo: type,
          ano: year,
          mes: month,
          status,
          data: date,
          observacao: obs || null
        }, {
          onConflict: 'company_id,tipo,ano,mes'
        });

      if (error) throw error;

      await loadCompanies();
    } catch (error) {
      console.error('Erro ao atualizar status de imposto:', error);
      throw error;
    }
  };

  const updateFeeStatus = async (
    companyId: string,
    year: number,
    month: number,
    status: 'lançado' | 'em_aberto',
    date: string | null,
    valor?: number,
    obs?: string
  ) => {
    try {
      const { error } = await supabase
        .from('fee_entries')
        .upsert({
          company_id: companyId,
          ano: year,
          mes: month,
          status,
          data: date,
          valor: valor || null,
          observacao: obs || null
        }, {
          onConflict: 'company_id,ano,mes'
        });

      if (error) throw error;

      await loadCompanies();
    } catch (error) {
      console.error('Erro ao atualizar status de honorário:', error);
      throw error;
    }
  };

  return (
    <CompanyContext.Provider value={{
      companies, addCompany, updateCompany, deleteCompany, updateTaxStatus, updateFeeStatus, isLoading
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanies = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompanyProvider');
  }
  return context;
};
