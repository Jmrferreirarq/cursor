import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Client, Project, Proposal, CalculatorState } from '@/types';

const initialClients: Client[] = [
  {
    id: 'cli-ex-1',
    name: 'Maria Silva',
    email: 'maria.silva@email.pt',
    phone: '+351 912 345 678',
    address: 'Rua das Flores, 42',
    municipality: 'Lisboa',
    nif: '123456789',
    projects: ['proj-ex-1'],
    createdAt: new Date().toISOString().slice(0, 10),
    notes: 'Cliente exemplo – reabilitação',
  },
  {
    id: 'cli-ex-2',
    name: 'João Santos',
    email: 'joao.santos@email.pt',
    phone: '+351 923 456 789',
    address: 'Estrada da Praia, 15',
    municipality: 'Loulé',
    nif: '987654321',
    projects: ['proj-ex-2'],
    createdAt: new Date().toISOString().slice(0, 10),
    notes: 'Cliente exemplo – moradia',
  },
  {
    id: 'cli-ex-3',
    name: 'Ana Costa',
    email: 'ana.costa@email.pt',
    phone: '+351 934 567 890',
    address: 'Avenida da Boavista, 200',
    municipality: 'Porto',
    nif: '456789123',
    projects: ['proj-ex-3'],
    createdAt: new Date().toISOString().slice(0, 10),
    notes: 'Cliente exemplo – comércio',
  },
];

const initialProjects: Project[] = [
  {
    id: 'proj-ex-1',
    name: 'Reabilitação Apartamento Lisboa',
    client: 'Maria Silva',
    status: 'active',
    phase: 'Projeto de Execução',
    startDate: '2024-01-15',
    deadline: '2024-09-30',
    budget: 45000,
    hoursLogged: 120,
    team: ['JÉSSICA', 'SOFIA'],
    description: 'Reabilitação integral de apartamento T3 no centro de Lisboa.',
    address: 'Rua das Flores, 42',
    municipality: 'Lisboa',
  },
  {
    id: 'proj-ex-2',
    name: 'Moradia Unifamiliar Algarve',
    client: 'João Santos',
    status: 'negotiation',
    phase: 'Ante-Projeto',
    startDate: '2024-03-01',
    deadline: '2025-06-30',
    budget: 185000,
    hoursLogged: 0,
    team: ['SOFIA'],
    description: 'Moradia unifamiliar em Loulé com piscina e jardim.',
    address: 'Estrada da Praia, 15',
    municipality: 'Loulé',
  },
  {
    id: 'proj-ex-3',
    name: 'Loja Comercial Porto',
    client: 'Ana Costa',
    status: 'lead',
    phase: 'Estudo Prévio',
    startDate: '',
    deadline: '',
    budget: 32000,
    hoursLogged: 0,
    team: [],
    description: 'Projeto de arquitetura para loja de vestuário na Boavista.',
    address: 'Avenida da Boavista, 200',
    municipality: 'Porto',
  },
];

const FA360_STORAGE_KEY = 'fa360_data';

/** Dados mínimos para criar/encontrar cliente */
export interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  municipality?: string;
  nif?: string;
  notes?: string;
}

/** Dados para guardar proposta da calculadora */
export interface CalculatorProposalInput {
  clientName: string;
  reference: string;
  projectName: string;
  projectType: string;
  location?: string;
  area?: number;
  architectureValue: number;
  specialtiesValue: number;
  extrasValue: number;
  totalValue: number;
  totalWithVat: number;
  vatRate: number;
  proposalUrl?: string;
  calculatorState?: CalculatorState;
}

interface DataContextType {
  clients: Client[];
  projects: Project[];
  proposals: Proposal[];
  addClient: (client: Client) => void;
  addProject: (project: Project) => void;
  addProposal: (proposal: Proposal) => void;
  /** Encontra cliente existente (por nome ou NIF) ou cria novo. Retorna o ID do cliente. */
  findOrCreateClient: (input: ClientInput) => string;
  /** Guarda proposta da calculadora e liga ao cliente. Retorna o ID da proposta. */
  saveCalculatorProposal: (input: CalculatorProposalInput) => string;
  resetAllData: () => Promise<boolean>;
  exportToFile: () => void;
  importFromFile: (file: File) => Promise<{ ok: boolean; error?: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function parseClient(r: Record<string, unknown>): Client {
  return {
    id: String(r.id || ''),
    name: String(r.name || ''),
    email: String(r.email || ''),
    phone: String(r.phone || ''),
    address: (r.address as string) || undefined,
    municipality: (r.municipality as string) || undefined,
    nif: (r.nif as string) || undefined,
    projects: Array.isArray(r.projects) ? r.projects.map(String) : String(r.projects || '').split(',').filter(Boolean),
    createdAt: String(r.createdAt || ''),
    notes: (r.notes as string) || undefined,
  };
}

function parseProject(r: Record<string, unknown>): Project {
  return {
    id: String(r.id || ''),
    name: String(r.name || ''),
    client: String(r.client || ''),
    status: (r.status as Project['status']) || 'lead',
    phase: String(r.phase || ''),
    startDate: String(r.startDate || ''),
    deadline: String(r.deadline || ''),
    budget: Number(r.budget) || 0,
    hoursLogged: Number(r.hoursLogged) || 0,
    team: Array.isArray(r.team) ? r.team.map(String) : String(r.team || '').split(',').filter(Boolean),
    description: (r.description as string) || undefined,
    address: (r.address as string) || undefined,
    municipality: (r.municipality as string) || undefined,
  };
}

function parseProposal(r: Record<string, unknown>): Proposal {
  return {
    id: String(r.id || ''),
    clientId: String(r.clientId || ''),
    clientName: String(r.clientName || ''),
    projectType: String(r.projectType || ''),
    phases: Array.isArray(r.phases) ? (r.phases as Proposal['phases']) : [],
    totalValue: Number(r.totalValue) || 0,
    vatRate: Number(r.vatRate) || 23,
    totalWithVat: Number(r.totalWithVat) || 0,
    status: (r.status as Proposal['status']) || 'draft',
    createdAt: String(r.createdAt || ''),
    validUntil: (r.validUntil as string) || undefined,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FA360_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { clients?: unknown[]; projects?: unknown[]; proposals?: unknown[] };
      if (Array.isArray(data.clients) && data.clients.length) {
        setClients(data.clients.map((r) => parseClient(r as Record<string, unknown>)));
      }
      if (Array.isArray(data.projects) && data.projects.length) {
        setProjects(data.projects.map((r) => parseProject(r as Record<string, unknown>)));
      }
      if (Array.isArray(data.proposals) && data.proposals.length) {
        setProposals(data.proposals.map((r) => parseProposal(r as Record<string, unknown>)));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        FA360_STORAGE_KEY,
        JSON.stringify({ clients, projects, proposals, exportedAt: new Date().toISOString() })
      );
    } catch {
      /* quota exceeded */
    }
  }, [clients, projects, proposals]);

  const addClient = useCallback((client: Client) => {
    setClients((prev) => [client, ...prev]);
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
  }, []);

  const addProposal = useCallback((proposal: Proposal) => {
    setProposals((prev) => [proposal, ...prev]);
  }, []);

  /** Encontra cliente existente (por nome ou NIF) ou cria novo */
  const findOrCreateClient = useCallback((input: ClientInput): string => {
    const nameNorm = input.name.trim().toLowerCase();
    const nifNorm = input.nif?.trim() || '';
    
    // Procurar por NIF primeiro (mais preciso)
    if (nifNorm) {
      const byNif = clients.find((c) => c.nif?.trim() === nifNorm);
      if (byNif) return byNif.id;
    }
    
    // Procurar por nome (case-insensitive)
    const byName = clients.find((c) => c.name.trim().toLowerCase() === nameNorm);
    if (byName) return byName.id;
    
    // Criar novo cliente
    const newId = `cli-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newClient: Client = {
      id: newId,
      name: input.name.trim(),
      email: input.email?.trim() || '',
      phone: input.phone?.trim() || '',
      address: input.address?.trim() || undefined,
      municipality: input.municipality?.trim() || undefined,
      nif: nifNorm || undefined,
      projects: [],
      createdAt: new Date().toISOString().slice(0, 10),
      notes: input.notes?.trim() || undefined,
    };
    
    setClients((prev) => [newClient, ...prev]);
    return newId;
  }, [clients]);

  /** Guarda proposta da calculadora e liga ao cliente */
  const saveCalculatorProposal = useCallback((input: CalculatorProposalInput): string => {
    // 1. Encontrar ou criar cliente
    const clientId = findOrCreateClient({
      name: input.clientName,
      municipality: input.location,
    });
    
    // 2. Verificar se já existe proposta com esta referência (evitar duplicados)
    const existingProposal = proposals.find((p) => p.reference === input.reference);
    if (existingProposal) {
      // Atualizar proposta existente
      setProposals((prev) => prev.map((p) => 
        p.id === existingProposal.id
          ? {
              ...p,
              clientId,
              clientName: input.clientName,
              projectType: input.projectType,
              projectName: input.projectName,
              location: input.location,
              area: input.area,
              architectureValue: input.architectureValue,
              specialtiesValue: input.specialtiesValue,
              extrasValue: input.extrasValue,
              totalValue: input.totalValue,
              totalWithVat: input.totalWithVat,
              vatRate: input.vatRate,
              proposalUrl: input.proposalUrl,
              calculatorState: input.calculatorState,
            }
          : p
      ));
      return existingProposal.id;
    }
    
    // 3. Criar nova proposta
    const proposalId = `prop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newProposal: Proposal = {
      id: proposalId,
      clientId,
      clientName: input.clientName,
      projectType: input.projectType,
      phases: [],
      totalValue: input.totalValue,
      vatRate: input.vatRate,
      totalWithVat: input.totalWithVat,
      status: 'draft',
      createdAt: new Date().toISOString().slice(0, 10),
      reference: input.reference,
      projectName: input.projectName,
      location: input.location,
      area: input.area,
      architectureValue: input.architectureValue,
      specialtiesValue: input.specialtiesValue,
      extrasValue: input.extrasValue,
      proposalUrl: input.proposalUrl,
      calculatorState: input.calculatorState,
    };
    
    setProposals((prev) => [newProposal, ...prev]);
    
    // 4. Adicionar referência da proposta ao cliente (se não existir)
    setClients((prev) => prev.map((c) => 
      c.id === clientId && !c.projects.includes(proposalId)
        ? { ...c, projects: [...c.projects, proposalId] }
        : c
    ));
    
    return proposalId;
  }, [findOrCreateClient, proposals]);

  const resetAllData = useCallback(async (): Promise<boolean> => {
    setClients([]);
    setProjects([]);
    setProposals([]);
    return true;
  }, []);

  const exportToFile = useCallback(() => {
    const blob = new Blob(
      [
        JSON.stringify(
          { clients, projects, proposals, exportedAt: new Date().toISOString(), app: 'FA360' },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fa360-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [clients, projects, proposals]);

  const importFromFile = useCallback(async (file: File): Promise<{ ok: boolean; error?: string }> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as { clients?: unknown[]; projects?: unknown[]; proposals?: unknown[] };
      const clientsIn = Array.isArray(data.clients)
        ? data.clients.map((r) => parseClient(r as Record<string, unknown>))
        : [];
      const projectsIn = Array.isArray(data.projects)
        ? data.projects.map((r) => parseProject(r as Record<string, unknown>))
        : [];
      const proposalsIn = Array.isArray(data.proposals)
        ? data.proposals.map((r) => parseProposal(r as Record<string, unknown>))
        : [];
      setClients(clientsIn.length ? clientsIn : initialClients);
      setProjects(projectsIn.length ? projectsIn : initialProjects);
      setProposals(proposalsIn);
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg };
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        clients,
        projects,
        proposals,
        addClient,
        addProject,
        addProposal,
        findOrCreateClient,
        saveCalculatorProposal,
        resetAllData,
        exportToFile,
        importFromFile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
