export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'lead' | 'negotiation' | 'active' | 'paused' | 'completed' | 'cancelled';
  phase: string;
  startDate: string;
  deadline: string;
  budget: number;
  hoursLogged: number;
  team: string[];
  description?: string;
  address?: string;
  municipality?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  municipality?: string;
  nif?: string;
  projects: string[];
  createdAt: string;
  notes?: string;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  phase: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  deliverables: string[];
  responsible: string;
  projectId?: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
}

/** Estado da calculadora para restaurar proposta */
export interface CalculatorState {
  honorMode: 'area' | 'pct';
  area: string;
  projectType: string;
  complexity: string;
  valorObra: string;
  pctHonor: string;
  curvaDecrescimento: boolean;
  fasesIncluidas: string[];
  honorLocalizacao: string;
  numPisos: string;
  extrasValores: Record<string, string>;
  despesasReembolsaveis: string;
  especialidadesValores: Record<string, string>;
  exclusoesSelecionadas: string[];
  notasAdicionais: string;
  notasExtras: string;
  mostrarResumo: boolean;
  mostrarFases: boolean;
  mostrarEspecialidades: boolean;
  mostrarExtras: boolean;
  mostrarExclusoes: boolean;
  mostrarCondicoes: boolean;
  mostrarMapa: boolean;
  mostrarEquipa: boolean;
  mostrarCenarios: boolean;
  mostrarGuiaObra: boolean;
  linkGoogleMaps: string;
  areaUnit: string;
}

export interface Proposal {
  id: string;
  clientId: string;
  clientName: string;
  projectType: string;
  phases: ProposalPhase[];
  totalValue: number;
  vatRate: number;
  totalWithVat: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  sentAt?: string;
  validUntil?: string;
  // Campos adicionais para propostas da calculadora
  reference?: string;           // FA-XXX
  projectName?: string;         // Nome do projeto
  location?: string;            // Local/Município
  architectureValue?: number;   // Valor arquitetura (s/IVA)
  specialtiesValue?: number;    // Valor especialidades (s/IVA)
  extrasValue?: number;         // Valor extras (s/IVA)
  area?: number;                // Área (m²)
  proposalUrl?: string;         // Link da proposta
  calculatorState?: CalculatorState; // Estado completo da calculadora
}

export interface ProposalPhase {
  id: string;
  name: string;
  description: string;
  value: number;
  selected: boolean;
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  projectId?: string;
  clientId?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  targetHours: number;
  loggedHours: number;
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'task' | 'other';
  projectId?: string;
  clientId?: string;
  attendees?: string[];
}

export interface HealthMetrics {
  deadlines: number;
  cash: number;
  production: number;
  risk: number;
  overall: number;
}

export interface CashflowData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface PipelineData {
  leads: number;
  negotiation: number;
  closed: number;
  potentialValue: number;
}
