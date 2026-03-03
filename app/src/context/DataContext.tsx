import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Client, Project, Proposal, CalculatorState, Specialist, License, ConstructionVisit } from '@/types';
import { localStorageService } from '@/services/localStorage';
import { isCloudConfigured, cloudLoad, cloudSave } from '@/services/supabaseSync';
import { createChecklistForProject } from '@/lib/checklistAutoCreate';

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
  isReady: boolean;
  clients: Client[];
  projects: Project[];
  proposals: Proposal[];
  specialists: Specialist[];
  licenses: License[];
  constructionVisits: ConstructionVisit[];
  addClient: (client: Client) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProposal: (proposal: Proposal) => void;
  deleteProposal: (id: string) => void;
  updateProposalStatus: (id: string, status: Proposal['status']) => void;
  updateProposal: (id: string, patch: Partial<Proposal>) => void;
  /** Aceita proposta e cria projeto ativo automaticamente */
  acceptProposal: (id: string) => void;
  findOrCreateClient: (input: ClientInput) => string;
  saveCalculatorProposal: (input: CalculatorProposalInput) => string;
  addSpecialist: (specialist: Specialist) => void;
  updateSpecialist: (id: string, patch: Partial<Specialist>) => void;
  deleteSpecialist: (id: string) => void;
  addLicense: (license: License) => void;
  updateLicense: (id: string, patch: Partial<License>) => void;
  deleteLicense: (id: string) => void;
  addConstructionVisit: (visit: ConstructionVisit) => void;
  updateConstructionVisit: (id: string, patch: Partial<ConstructionVisit>) => void;
  deleteConstructionVisit: (id: string) => void;
  resetAllData: () => Promise<boolean>;
  exportToFile: () => void;
  importFromFile: (file: File) => Promise<{ ok: boolean; error?: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const svc = localStorageService;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [constructionVisits, setConstructionVisits] = useState<ConstructionVisit[]>([]);

  const cloudSyncTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load from storage on mount (cloud first, then localStorage fallback)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      let loaded = false;
      if (isCloudConfigured()) {
        try {
          const cloud = await cloudLoad();
          if (cloud && !cancelled) {
            if (cloud.clients?.length) setClients(cloud.clients);
            if (cloud.projects?.length) setProjects(cloud.projects);
            if (cloud.proposals?.length) {
              setProposals(cloud.proposals.map((p: Proposal) => ({ ...p, status: p.status || 'draft' })));
            }
            if (cloud.specialists?.length) setSpecialists(cloud.specialists);
            if (cloud.licenses?.length) setLicenses(cloud.licenses);
            if (cloud.constructionVisits?.length) setConstructionVisits(cloud.constructionVisits);
            svc.save(cloud);
            loaded = true;
          }
        } catch { /* cloud unavailable */ }
      }
      if (!loaded && !cancelled) {
        try {
          const data = svc.load();
          if (data.clients.length) setClients(data.clients);
          if (data.projects.length) setProjects(data.projects);
          if (data.proposals.length) {
            setProposals(data.proposals.map((p: Proposal) => ({ ...p, status: p.status || 'draft' })));
          }
          if (data.specialists.length) setSpecialists(data.specialists);
          if (data.licenses.length) setLicenses(data.licenses);
          if (data.constructionVisits.length) setConstructionVisits(data.constructionVisits);
        } catch { /* ignore */ }
      }
      if (!cancelled) setIsReady(true);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Persist on change — localStorage (instant) + cloud (debounced)
  useEffect(() => {
    try {
      const existing = svc.load();
      const merged = { ...existing, clients, projects, proposals, specialists, licenses, constructionVisits };
      svc.save(merged);
      if (isCloudConfigured()) {
        clearTimeout(cloudSyncTimer.current);
        cloudSyncTimer.current = setTimeout(() => { cloudSave(merged); }, 2000);
      }
    } catch { /* quota exceeded */ }
  }, [clients, projects, proposals, specialists, licenses, constructionVisits]);

  const addClient = useCallback((client: Client) => {
    setClients((prev) => [client, ...prev]);
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
    // Ligar projeto ao cliente
    if (project.clientId) {
      setClients((prev) => prev.map((c) => {
        if (c.id !== project.clientId) return c;
        if (c.projects.includes(project.id)) return c;
        return { ...c, projects: [...c.projects, project.id] };
      }));
    }
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const proj = prev.find((p) => p.id === id);
      if (proj?.clientId) {
        setClients((clients) => clients.map((c) =>
          c.id === proj.clientId
            ? { ...c, projects: c.projects.filter((pid) => pid !== id) }
            : c
        ));
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const addProposal = useCallback((proposal: Proposal) => {
    setProposals((prev) => [proposal, ...prev]);
  }, []);

  const deleteProposal = useCallback((id: string) => {
    setProposals((prev) => {
      const prop = prev.find((p) => p.id === id);
      if (prop?.clientId) {
        setClients((clients) => clients.map((c) =>
          c.id === prop.clientId
            ? { ...c, proposalIds: (c.proposalIds ?? []).filter((pid) => pid !== id) }
            : c
        ));
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const updateProposalStatus = useCallback((id: string, status: Proposal['status']) => {
    setProposals((prev) => prev.map((p) =>
      p.id === id
        ? { ...p, status, sentAt: status === 'sent' ? new Date().toISOString().slice(0, 10) : p.sentAt }
        : p
    ));
  }, []);

  const updateProposal = useCallback((id: string, patch: Partial<Proposal>) => {
    setProposals((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  }, []);

  const acceptProposal = useCallback((id: string) => {
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) return;

    updateProposalStatus(id, 'accepted');

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newProject: Project = {
      id: projectId,
      name: proposal.projectName || `Projeto ${proposal.clientName}`,
      client: proposal.clientName,
      clientId: proposal.clientId,
      status: 'active',
      phase: 'Estudo Prévio',
      budget: proposal.totalValue,
      startDate: new Date().toISOString().slice(0, 10),
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      hoursLogged: 0,
      team: [],
      address: proposal.location || '',
      municipality: proposal.location || '',
      projectType: proposal.projectType,
      proposalIds: [id],
      ...(proposal.paymentTranches?.length ? { paymentTranches: proposal.paymentTranches } : {}),
    };
    setProjects((prev) => [newProject, ...prev]);

    setClients((prev) => prev.map((c) => {
      if (c.id !== proposal.clientId) return c;
      const projects = c.projects.includes(projectId) ? c.projects : [...c.projects, projectId];
      const proposalIds = (c.proposalIds ?? []).includes(id) ? (c.proposalIds ?? []) : [...(c.proposalIds ?? []), id];
      return { ...c, projects, proposalIds };
    }));

    createChecklistForProject(
      projectId,
      proposal.projectName || `Projeto ${proposal.clientName}`,
      proposal.projectType,
    );
  }, [proposals, updateProposalStatus]);

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
    
    // 4. Adicionar referência da proposta ao cliente (em proposalIds, não em projects)
    setClients((prev) => prev.map((c) => {
      if (c.id !== clientId) return c;
      const proposalIds = (c.proposalIds ?? []).includes(proposalId)
        ? (c.proposalIds ?? [])
        : [...(c.proposalIds ?? []), proposalId];
      return { ...c, proposalIds };
    }));
    
    return proposalId;
  }, [findOrCreateClient, proposals]);

  const resetAllData = useCallback(async (): Promise<boolean> => {
    setClients([]);
    setProjects([]);
    setProposals([]);
    setSpecialists([]);
    setLicenses([]);
    setConstructionVisits([]);
    return true;
  }, []);

  const exportToFile = useCallback(() => {
    const existing = svc.load();
    svc.exportToFile({ ...existing, clients, projects, proposals, specialists, licenses, constructionVisits });
  }, [clients, projects, proposals, specialists, licenses, constructionVisits]);

  const importFromFile = useCallback(async (file: File): Promise<{ ok: boolean; error?: string }> => {
    const result = await svc.importFromFile(file);
    if (!result.ok || !result.data) return { ok: false, error: result.error };
    const d = result.data;
    setClients(d.clients.length ? d.clients : initialClients);
    setProjects(d.projects.length ? d.projects : initialProjects);
    setProposals(d.proposals);
    if (d.specialists?.length) setSpecialists(d.specialists);
    if (d.licenses?.length) setLicenses(d.licenses);
    if (d.constructionVisits?.length) setConstructionVisits(d.constructionVisits);
    return { ok: true };
  }, []);

  const addSpecialist = useCallback((specialist: Specialist) => {
    setSpecialists((prev) => [specialist, ...prev]);
  }, []);

  const updateSpecialist = useCallback((id: string, patch: Partial<Specialist>) => {
    setSpecialists((prev) => prev.map((s) => s.id === id ? { ...s, ...patch } : s));
  }, []);

  const deleteSpecialist = useCallback((id: string) => {
    setSpecialists((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addLicense = useCallback((license: License) => {
    setLicenses((prev) => [license, ...prev]);
  }, []);

  const updateLicense = useCallback((id: string, patch: Partial<License>) => {
    setLicenses((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l));
  }, []);

  const deleteLicense = useCallback((id: string) => {
    setLicenses((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addConstructionVisit = useCallback((visit: ConstructionVisit) => {
    setConstructionVisits((prev) => [visit, ...prev]);
  }, []);

  const updateConstructionVisit = useCallback((id: string, patch: Partial<ConstructionVisit>) => {
    setConstructionVisits((prev) => prev.map((v) => v.id === id ? { ...v, ...patch } : v));
  }, []);

  const deleteConstructionVisit = useCallback((id: string) => {
    setConstructionVisits((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const value = useMemo(() => ({
    isReady,
    clients,
    projects,
    proposals,
    specialists,
    licenses,
    constructionVisits,
    addClient,
    updateClient,
    deleteClient,
    addProject,
    updateProject,
    deleteProject,
    addProposal,
    deleteProposal,
    updateProposalStatus,
    updateProposal,
    acceptProposal,
    findOrCreateClient,
    saveCalculatorProposal,
    addSpecialist,
    updateSpecialist,
    deleteSpecialist,
    addLicense,
    updateLicense,
    deleteLicense,
    addConstructionVisit,
    updateConstructionVisit,
    deleteConstructionVisit,
    resetAllData,
    exportToFile,
    importFromFile,
  }), [isReady, clients, projects, proposals, specialists, licenses, constructionVisits, addClient, updateClient, deleteClient, addProject, updateProject, deleteProject, addProposal, deleteProposal, updateProposalStatus, updateProposal, acceptProposal, findOrCreateClient, saveCalculatorProposal, addSpecialist, updateSpecialist, deleteSpecialist, addLicense, updateLicense, deleteLicense, addConstructionVisit, updateConstructionVisit, deleteConstructionVisit, resetAllData, exportToFile, importFromFile]);

  return (
    <DataContext.Provider value={value}>
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
