import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Client, Project, Proposal } from '@/types';

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

interface DataContextType {
  clients: Client[];
  projects: Project[];
  proposals: Proposal[];
  addClient: (client: Client) => void;
  addProject: (project: Project) => void;
  addProposal: (proposal: Proposal) => void;
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
