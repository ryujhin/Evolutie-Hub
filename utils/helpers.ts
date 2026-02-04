import { Company, DbCompany, DbTaxEntry, DbFeeEntry, CompanyTaxes, CompanyFees } from '../types';

export const formatCNPJ = (value: string) => {
  const clean = value.replace(/\D/g, '');
  return clean
    .replace(/^(\dt{2})(\dt{3})(\dt{3})(\dt{4})(\dt{2}).*/, '$1.$2.$3/$4-$5')
    .substring(0, 18);
};

export const maskCNPJInput = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
};

export const getMonthName = (month: number) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1];
};

export const generateInitialTaxes = (year: number) => {
  const emptyYear = () => Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    status: 'em_aberto' as const,
    data: null
  }));

  return {
    [year]: {
      inss: emptyYear(),
      simples: emptyYear(),
      fgts: emptyYear()
    }
  };
};

export const generateInitialFees = (year: number) => {
  return {
    [year]: Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      status: 'em_aberto' as const,
      data: null
    }))
  };
};

// Converter dados do banco para formato da aplicação
export function dbCompanyToCompany(
  dbCompany: DbCompany,
  taxEntries: DbTaxEntry[],
  feeEntries: DbFeeEntry[]
): Company {
  // Agrupar impostos por ano e tipo
  const impostos: CompanyTaxes = {};
  taxEntries.forEach(entry => {
    if (!impostos[entry.ano]) {
      impostos[entry.ano] = { inss: [], simples: [], fgts: [] };
    }
    impostos[entry.ano][entry.tipo].push({
      mes: entry.mes,
      status: entry.status,
      data: entry.data,
      obs: entry.observacao || undefined
    });
  });

  // Preencher meses faltantes
  Object.keys(impostos).forEach(yearStr => {
    const year = parseInt(yearStr);
    ['inss', 'simples', 'fgts'].forEach(tipo => {
      const tipoKey = tipo as 'inss' | 'simples' | 'fgts';
      const existing = impostos[year][tipoKey];
      const allMonths = Array.from({ length: 12 }, (_, i) => {
        const mes = i + 1;
        const found = existing.find(e => e.mes === mes);
        return found || { mes, status: 'em_aberto' as const, data: null };
      });
      impostos[year][tipoKey] = allMonths;
    });
  });

  // Agrupar honorários por ano
  const honorarios: CompanyFees = {};
  feeEntries.forEach(entry => {
    if (!honorarios[entry.ano]) {
      honorarios[entry.ano] = [];
    }
    honorarios[entry.ano].push({
      mes: entry.mes,
      status: entry.status,
      data: entry.data,
      valor: entry.valor || undefined,
      obs: entry.observacao || undefined
    });
  });

  // Preencher meses faltantes
  Object.keys(honorarios).forEach(yearStr => {
    const year = parseInt(yearStr);
    const existing = honorarios[year];
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      const found = existing.find(e => e.mes === mes);
      return found || { mes, status: 'em_aberto' as const, data: null };
    });
    honorarios[year] = allMonths;
  });

  return {
    id: dbCompany.id,
    codigoAlterdata: dbCompany.codigo_alterdata,
    nome: dbCompany.nome,
    cnpj: dbCompany.cnpj,
    conciliacaoBancaria: dbCompany.conciliacao_bancaria,
    situacaoCaixa: dbCompany.situacao_caixa,
    parcelamentoAtivo: dbCompany.parcelamento_ativo,
    impostos,
    honorarios,
    createdAt: dbCompany.created_at
  };
}
