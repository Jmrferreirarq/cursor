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
  // Loteamento (optional — only present when isLoteamento)
  lotIdentificacao?: string;
  lotAreaTerreno?: string;
  lotFonteArea?: string;
  lotAreaEstudo?: string;
  lotNumLotes?: string;
  lotFrenteTerreno?: string;
  lotNumAlternativas?: string;
  lotInstrumento?: string;
  lotClassificacaoSolo?: string;
  lotAlturaMaxima?: string;
  lotAfastamentos?: string;
  lotAreaMinimaLote?: string;
  lotIndiceConstrucao?: string;
  lotIndiceImplantacao?: string;
  lotTipoHabitacao?: string;
  lotObjetivoPrincipal?: string;
  lotTemTopografia?: boolean;
  lotTemCaderneta?: boolean;
  lotTemExtratoPDM?: boolean;
  lotCenarioA?: { lotes: string; areaMedia: string; cedencias: string; nota: string; accessModel: string; viaInternaComprimento: string };
  lotCenarioB?: { lotes: string; areaMedia: string; cedencias: string; nota: string; accessModel: string; viaInternaComprimento: string };
  lotCenarioC?: { lotes: string; areaMedia: string; cedencias: string; nota: string; accessModel: string; viaInternaComprimento: string };
  lotCondicionantes?: string[];
  lotEntregaveis?: string[];
  lotAssuncoesManuais?: string;
  lotDependenciasManuais?: string;
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

// ─── Content Factory Types ──────────────────────────────────────────

export type MediaType = 'obra' | 'render' | 'detalhe' | 'equipa' | 'before-after';
export type MediaObjective = 'atrair-clientes' | 'portfolio' | 'recrutamento' | 'autoridade-tecnica';
export type MediaStatus = 'rascunho' | 'por-classificar' | 'analisado' | 'pronto' | 'publicado';
export type MediaRestriction = 'sem-rostos' | 'sem-moradas' | 'sem-marcas' | 'sem-matriculas';
export type ContentChannel = 'ig-feed' | 'ig-reels' | 'ig-stories' | 'ig-carrossel' | 'linkedin' | 'tiktok' | 'pinterest' | 'youtube' | 'threads';
export type PostStatus = 'inbox' | 'generated' | 'review' | 'approved' | 'scheduled' | 'published' | 'measured' | 'rejected';
export type PostWeight = 'heavy' | 'light';
export type GeneratorType = 'manual' | 'auto-copy' | 'auto-narrative' | 'auto-recycle' | 'ai-batch';

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  src?: string;
  thumbnail?: string;

  // Layer A — Ingestion (mandatory on upload)
  projectId?: string;
  mediaType: MediaType;
  objective: MediaObjective;
  status: MediaStatus;
  restrictions: MediaRestriction[];

  // Layer B — Analysis (auto-generated)
  tags: string[];
  qualityScore?: number; // 0–100
  risks: string[];
  keyMoments?: { time: number; description: string }[];
  story?: string; // 1-sentence summary

  // Metadata
  uploadedAt: string;
  fileSize?: string;
  dimensions?: { width: number; height: number };
}

export interface ContentCopy {
  lang: 'pt' | 'en';
  channel: ContentChannel;
  text: string;
}

export interface ContentFormat {
  ratio: string; // '9:16', '1:1', '4:5', '16:9'
  label: string;
  description?: string;
}

export interface ContentPack {
  id: string;
  assetId: string;
  copies: ContentCopy[];
  hashtags: string[];
  cta: string;
  formats: ContentFormat[];
  generatorUsed: GeneratorType;
  createdAt: string;
}

export interface PostMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  reach?: number;
}

export interface ContentPost {
  id: string;
  assetId?: string;
  contentPackId?: string;
  slotId?: string;
  channel: ContentChannel;
  format: string;
  copyPt: string;
  copyEn: string;
  hashtags: string[];
  cta: string;
  status: PostStatus;
  scheduledDate?: string;
  publishedDate?: string;
  metrics?: PostMetrics;
  createdAt: string;

  // ── Queue-driven Calendar fields ──
  score?: number;              // 0-100 priority score
  weight?: PostWeight;         // heavy (reel, carrossel 6+, case study) or light (foto, stories, threads)
  isCore?: boolean;            // true = core piece, false = derivative
  parentPostId?: string;       // links derivative to its core post
  derivativeIds?: string[];    // core → list of derivative post IDs
  pillar?: string;             // editorial pillar ID (p1-p6)
  projectId?: string;          // linked project
  objective?: MediaObjective;  // content objective
  suggestedDate?: string;      // AI-suggested date
  rejectionReason?: string;    // reason if rejected
  isBuffer?: boolean;          // emergency buffer post (pre-approved light)
  measuredAt?: string;         // when metrics were recorded
  topPerformer?: boolean;      // engagement above threshold
}

export interface EditorialPillar {
  id: string;
  name: string;
  description: string;
}

export interface EditorialVoice {
  id: string;
  name: string;
  tone: string;
  example: string;
}

export interface EditorialFormat {
  id: string;
  name: string;
  structure: string;
  examplePt: string;
  exampleEn: string;
}

export interface EditorialDNA {
  pillars: EditorialPillar[];
  voices: EditorialVoice[];
  formats: EditorialFormat[];
}

export interface PublicationSlot {
  id: string;
  dayOfWeek: number; // 0=Sunday … 6=Saturday
  label: string;
  channels: ContentChannel[];
  pillar?: string;
  voice?: string;
}

export interface PerformanceEntry {
  id: string;
  postId: string;
  recordedAt: string;
  metrics: PostMetrics;
  notes?: string;
}
