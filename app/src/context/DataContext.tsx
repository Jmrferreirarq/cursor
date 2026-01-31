import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Client, Project, Proposal } from '@/types';

const initialClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.pt',
    phone: '+351 912 345 678',
    address: 'Rua do Douro, 123',
    municipality: 'Porto',
    nif: '123456789',
    projects: ['1'],
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'TechCorp Lda',
    email: 'geral@techcorp.pt',
    phone: '+351 223 456 789',
    address: 'Avenida da Liberdade, 500',
    municipality: 'Lisboa',
    nif: '987654321',
    projects: ['2'],
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria.santos@email.pt',
    phone: '+351 934 567 890',
    address: 'Rua da Alegria, 45',
    municipality: 'Braga',
    nif: '456789123',
    projects: [],
    createdAt: '2024-02-01',
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Casa Douro',
    client: 'João Silva',
    status: 'active',
    phase: 'Projeto Execução',
    startDate: '2024-01-15',
    deadline: '2024-06-30',
    budget: 45000,
    hoursLogged: 120,
    team: ['CEO', 'JÉSSICA'],
    address: 'Rua do Douro, 123',
    municipality: 'Porto',
  },
  {
    id: '2',
    name: 'Escritório Central',
    client: 'TechCorp Lda',
    status: 'negotiation',
    phase: 'Fase Comercial',
    startDate: '2024-02-01',
    deadline: '2024-08-15',
    budget: 78000,
    hoursLogged: 15,
    team: ['CEO', 'SOFIA'],
    address: 'Avenida da Liberdade, 500',
    municipality: 'Lisboa',
  },
];

interface DataContextType {
  clients: Client[];
  projects: Project[];
  proposals: Proposal[];
  addClient: (client: Client) => void;
  addProject: (project: Project) => void;
  addProposal: (proposal: Proposal) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const addClient = useCallback((client: Client) => {
    setClients((prev) => [client, ...prev]);
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
  }, []);

  const addProposal = useCallback((proposal: Proposal) => {
    setProposals((prev) => [proposal, ...prev]);
  }, []);

  return (
    <DataContext.Provider value={{ clients, projects, proposals, addClient, addProject, addProposal }}>
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
