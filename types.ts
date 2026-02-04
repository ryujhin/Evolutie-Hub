
export type TaxStatus = 'lançado' | 'em_aberto' | 'atrasado';

export interface TaxEntry {
  mes: number;
  status: TaxStatus;
  data: string | null;
  obs?: string;
}

export interface FeeEntry {
  mes: number;
  status: 'lançado' | 'em_aberto';
  data: string | null;
  valor?: number;
  obs?: string;
}

export interface CompanyTaxes {
  [year: number]: {
    inss: TaxEntry[];
    simples: TaxEntry[];
    fgts: TaxEntry[];
  };
}

export interface CompanyFees {
  [year: number]: FeeEntry[];
}

export interface Company {
  id: string;
  codigoAlterdata: string;
  nome: string;
  cnpj: string;
  conciliacaoBancaria: boolean;
  situacaoCaixa: 'positivo' | 'negativo';
  parcelamentoAtivo: boolean;
  impostos: CompanyTaxes;
  honorarios: CompanyFees;
  createdAt: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
}

// Database types (formato do Supabase)
export interface DbUser {
  id: string;
  nome: string;
  email: string;
  created_at: string;
}

export interface DbCompany {
  id: string;
  user_id: string;
  codigo_alterdata: string;
  nome: string;
  cnpj: string;
  conciliacao_bancaria: boolean;
  situacao_caixa: 'positivo' | 'negativo';
  parcelamento_ativo: boolean;
  created_at: string;
}

export interface DbTaxEntry {
  id: string;
  company_id: string;
  tipo: 'inss' | 'simples' | 'fgts';
  ano: number;
  mes: number;
  status: TaxStatus;
  data: string | null;
  observacao: string | null;
  created_at: string;
}

export interface DbFeeEntry {
  id: string;
  company_id: string;
  ano: number;
  mes: number;
  status: 'lançado' | 'em_aberto';
  data: string | null;
  valor: number | null;
  observacao: string | null;
  created_at: string;
}
