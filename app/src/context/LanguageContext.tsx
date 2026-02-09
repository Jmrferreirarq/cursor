import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'pt' | 'en';

interface Translations {
  [key: string]: string | Translations;
}

const ptTranslations: Translations = {
  nav: {
    dashboard: 'Painel',
    projects: 'Projetos',
    clients: 'Clientes',
    tasks: 'Tarefas',
    financial: 'Financeiro',
    calendar: 'Calendário',
    marketing: 'Marketing',
    technical: 'Técnico',
    proposals: 'Propostas',
    media: 'Mídia',
    library: 'Biblioteca',
    inbox: 'Inbox',
    brand: 'Marca',
    calculator: 'Calculadora',
  },
  dashboard: {
    title: 'Comando Operacional',
    greeting: 'Bom dia',
    dayPanel: 'Painel do Dia',
    allGood: 'Tudo em dia',
    delayed: 'Atraso',
    sevenDays: '7 Dias',
    rec: 'Rec.',
    cashflow: 'Cashflow',
    net: 'NET',
    vatInfo: '+ IVA À taxa legal',
    overdue: 'Vencido',
    next7Days: 'Próx. 7 Dias',
    openDay: 'Abrir Dia',
    viewAll: 'Ver Todos',
    globalPipeline: 'Pipeline Global',
    potential: 'potencial',
    leads: 'Leads',
    negotiation: 'Negociação',
    closed: 'Fechado',
    conversion: 'Conversão',
    healthIndex: 'Health Index',
    excellent: 'Excelente',
    deadlines: 'Prazos',
    cash: 'Caixa',
    production: 'Produção',
    risk: 'Risco',
    waitingData: 'A aguardar dados.',
    criticalAlerts: 'Critical Alerts',
    noBlocks: 'Sem bloqueios críticos.',
    resolve: 'Resolver',
    configure: 'Configurar',
    neuralLink: 'Neural Link',
    offline: 'OFFLINE',
    lastSync: 'Última Sync',
    sheetsPending: 'Conexão Sheets pendente',
    productionHours: 'PRODUÇÃO • HORAS (SEMANA)',
    detail: 'Detalhe',
    belowTarget: 'Abaixo do alvo — pode haver capacidade livre.',
    hoursNote: 'Baseado em registos de horas (NET operacional). Ajusta o alvo por pessoa se necessário.',
    activeProjects: 'PROJETOS ATIVOS',
    noProjects: 'Sem projetos ativos. Cria uma proposta para iniciar pipeline.',
    newProposal: 'Nova Proposta',
  },
  common: {
    search: 'Pesquisar',
    commands: 'Comandos',
    typeCommand: 'Digite um comando ou pesquise...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Criar',
    close: 'Fechar',
    loading: 'A carregar...',
    error: 'Erro',
    success: 'Sucesso',
  },
};

const enTranslations: Translations = {
  nav: {
    dashboard: 'Dashboard',
    projects: 'Projects',
    clients: 'Clients',
    tasks: 'Tasks',
    financial: 'Financial',
    calendar: 'Calendar',
    marketing: 'Marketing',
    technical: 'Technical',
    proposals: 'Proposals',
    media: 'Media',
    library: 'Library',
    inbox: 'Inbox',
    brand: 'Brand',
    calculator: 'Calculator',
  },
  dashboard: {
    title: 'Operational Command',
    greeting: 'Good morning',
    dayPanel: 'Day Panel',
    allGood: 'All good',
    delayed: 'Delayed',
    sevenDays: '7 Days',
    rec: 'Rec.',
    cashflow: 'Cashflow',
    net: 'NET',
    vatInfo: '+ VAT at legal rate',
    overdue: 'Overdue',
    next7Days: 'Next 7 Days',
    openDay: 'Open Day',
    viewAll: 'View All',
    globalPipeline: 'Global Pipeline',
    potential: 'potential',
    leads: 'Leads',
    negotiation: 'Negotiation',
    closed: 'Closed',
    conversion: 'Conversion',
    healthIndex: 'Health Index',
    excellent: 'Excellent',
    deadlines: 'Deadlines',
    cash: 'Cash',
    production: 'Production',
    risk: 'Risk',
    waitingData: 'Waiting for data.',
    criticalAlerts: 'Critical Alerts',
    noBlocks: 'No critical blockers.',
    resolve: 'Resolve',
    configure: 'Configure',
    neuralLink: 'Neural Link',
    offline: 'OFFLINE',
    lastSync: 'Last Sync',
    sheetsPending: 'Sheets connection pending',
    productionHours: 'PRODUCTION • HOURS (WEEK)',
    detail: 'Detail',
    belowTarget: 'Below target — there may be free capacity.',
    hoursNote: 'Based on hour records (NET operational). Adjust target per person if needed.',
    activeProjects: 'ACTIVE PROJECTS',
    noProjects: 'No active projects. Create a proposal to start pipeline.',
    newProposal: 'New Proposal',
  },
  common: {
    search: 'Search',
    commands: 'Commands',
    typeCommand: 'Type a command or search...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
};

const translations: Record<Language, Translations> = {
  pt: ptTranslations,
  en: enTranslations,
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fa360-language') as Language;
      return saved || 'pt';
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem('fa360-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'pt' ? 'en' : 'pt'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string | Translations => {
    const keys = key.split('.');
    let value: Translations | string = translations[language];
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
