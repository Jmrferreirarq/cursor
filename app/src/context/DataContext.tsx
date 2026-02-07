import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Client, Project, Proposal, CalculatorState } from '@/types';
import { localStorageService } from '@/services/localStorage';

// Iniciar com arrays vazios - sem dados de exemplo
const initialClients: Client[] = [];
const initialProjects: Project[] = [];

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
  /** Elimina uma proposta pelo ID */
  deleteProposal: (id: string) => void;
  /** Encontra cliente existente (por nome ou NIF) ou cria novo. Retorna o ID do cliente. */
  findOrCreateClient: (input: ClientInput) => string;
  /** Guarda proposta da calculadora e liga ao cliente. Retorna o ID da proposta. */
  saveCalculatorProposal: (input: CalculatorProposalInput) => string;
  resetAllData: () => Promise<boolean>;
  exportToFile: () => void;
  importFromFile: (file: File) => Promise<{ ok: boolean; error?: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const svc = localStorageService;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Load from storage on mount
  useEffect(() => {
    try {
      const data = svc.load();
      if (data.clients.length) setClients(data.clients);
      if (data.projects.length) setProjects(data.projects);
      if (data.proposals.length) setProposals(data.proposals);
    } catch {
      /* ignore */
    }
  }, []);

  // Persist on change — merges with existing storage to preserve media/planner data
  useEffect(() => {
    try {
      const existing = svc.load();
      svc.save({ ...existing, clients, projects, proposals });
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

  const deleteProposal = useCallback((id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
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
    const existing = svc.load();
    svc.exportToFile({ ...existing, clients, projects, proposals });
  }, [clients, projects, proposals]);

  const importFromFile = useCallback(async (file: File): Promise<{ ok: boolean; error?: string }> => {
    const result = await svc.importFromFile(file);
    if (!result.ok || !result.data) return { ok: false, error: result.error };
    const d = result.data;
    setClients(d.clients.length ? d.clients : initialClients);
    setProjects(d.projects.length ? d.projects : initialProjects);
    setProposals(d.proposals);
    return { ok: true };
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
        deleteProposal,
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
