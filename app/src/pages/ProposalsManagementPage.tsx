import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Download, ChevronRight, Check, Building2, Home, Hammer, Wrench, PenTool, Eye, ArrowRight, Sparkles, Users, Calendar, Euro } from 'lucide-react';
import { toast } from 'sonner';
import PDFPreview from '@/components/proposals/PDFPreview';
import { useData } from '@/context/DataContext';
import type { Proposal, ProposalPhase } from '@/types';

const projectTypes = [
  { id: 'obra-nova', label: 'Obra Nova', icon: Building2, description: 'Construção de raiz' },
  { id: 'remodelacao', label: 'Remodelação', icon: Home, description: 'Reabilitação de espaços' },
  { id: 'ampliacao', label: 'Ampliação', icon: Hammer, description: 'Extensão de edificado' },
  { id: 'interior', label: 'Design Interior', icon: PenTool, description: 'Projeto de interiores' },
  { id: 'consultoria', label: 'Consultoria', icon: Wrench, description: 'Serviços técnicos' },
];

const defaultPhases: ProposalPhase[] = [
  { id: 'ep', name: 'Estudo Prévio', description: 'Análise preliminar e esquemas conceptuais', value: 2500, selected: false },
  { id: 'ap', name: 'Anteprojeto', description: 'Desenvolvimento de plantas e modelação 3D', value: 3500, selected: false },
  { id: 'lic', name: 'Licenciamento', description: 'Processo de aprovação municipal', value: 2000, selected: false },
  { id: 'pe', name: 'Projeto Execução', description: 'Detalhamento construtivo completo', value: 5000, selected: false },
  { id: 'ao', name: 'Assistência Obra', description: 'Acompanhamento e fiscalização', value: 4500, selected: false },
  { id: 'fec', name: 'Fecho', description: 'Documentação final e certificação', value: 1500, selected: false },
];

export default function ProposalsManagementPage() {
  const navigate = useNavigate();
  const { clients, addClient, addProposal, addProject, proposals } = useData();
  const [step, setStep] = useState(1);
  const [useExistingClient, setUseExistingClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    municipality: '',
  });
  const [projectType, setProjectType] = useState('');
  const [phases, setPhases] = useState<ProposalPhase[]>(defaultPhases);
  const [vatRate] = useState(23);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [proposalNumber, setProposalNumber] = useState('');
  const [proposalDate, setProposalDate] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const togglePhase = (id: string) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectedPhases = phases.filter((p) => p.selected);
  const subtotal = selectedPhases.reduce((sum, p) => sum + p.value, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const generateProposalNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PROP-${year}-${random}`;
  };

  const calculateValidUntil = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const handlePreviewPDF = () => {
    setProposalNumber(generateProposalNumber());
    setProposalDate(new Date().toISOString().split('T')[0]);
    setValidUntil(calculateValidUntil());
    setShowPDFPreview(true);
  };

  const handleExportPDF = async () => {
    toast.info('Exportação de PDF em desenvolvimento');
  };

  const canProceed = () => {
    if (step === 1) {
      if (useExistingClient) return !!selectedClientId;
      return clientData.name && clientData.email && clientData.phone;
    }
    if (step === 2) {
      return projectType && selectedPhases.length > 0;
    }
    return true;
  };

  const resetForm = () => {
    setStep(1);
    setUseExistingClient(false);
    setSelectedClientId('');
    setClientData({
      name: '',
      email: '',
      phone: '',
      address: '',
      municipality: '',
    });
    setProjectType('');
    setPhases(defaultPhases.map((p) => ({ ...p, selected: false })));
    setShowPDFPreview(false);
  };

  // Carregar proposta existente no formulário
  const loadProposal = (p: Proposal) => {
    // Carregar dados do cliente
    const client = clients.find((c) => c.id === p.clientId);
    if (client) {
      setUseExistingClient(true);
      setSelectedClientId(client.id);
      setClientData({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        municipality: client.municipality || '',
      });
    } else {
      setUseExistingClient(false);
      setClientData({
        name: p.clientName,
        email: '',
        phone: '',
        address: '',
        municipality: '',
      });
    }
    
    // Carregar tipo de projeto
    setProjectType(p.projectType);
    
    // Carregar fases (se existirem)
    if (p.phases && p.phases.length > 0) {
      setPhases(defaultPhases.map((defaultPhase) => {
        const existingPhase = p.phases.find((ph) => ph.id === defaultPhase.id);
        if (existingPhase) {
          return { ...defaultPhase, value: existingPhase.value, selected: existingPhase.selected };
        }
        return { ...defaultPhase, selected: false };
      }));
    }
    
    // Ir para o resumo se a proposta já tem dados completos
    if (p.projectType && p.phases.length > 0) {
      setStep(3);
    } else if (p.projectType) {
      setStep(2);
    } else {
      setStep(1);
    }
    
    toast.success(`Proposta de ${p.clientName} carregada!`);
  };

  const createProjectFromProposal = (p: Proposal) => {
    const client = clients.find((c) => c.id === p.clientId);
    if (!client) {
      toast.error('Cliente não encontrado');
      return;
    }
    const projectTypeLabel = projectTypes.find((t) => t.id === p.projectType)?.label || p.projectType;
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + 6);
    const newProject = {
      id: `project-${Date.now()}`,
      name: `${projectTypeLabel} - ${p.clientName}`,
      client: p.clientName,
      status: 'negotiation' as const,
      phase: 'Fase Comercial',
      startDate: new Date().toISOString().split('T')[0],
      deadline: deadline.toISOString().split('T')[0],
      budget: p.totalValue,
      hoursLogged: 0,
      team: ['CEO'],
      description: `Projeto criado a partir da proposta ${p.id}`,
    };
    addProject(newProject);
    toast.success('Projeto criado! Redirecionando...');
    navigate(`/projects/${newProject.id}`);
  };

  const handleFinalize = () => {
    const proposalId = `prop-${Date.now()}`;
    let clientId = '';
    let clientName = '';

    if (useExistingClient && selectedClientId) {
      const c = clients.find((x) => x.id === selectedClientId);
      if (c) {
        clientId = c.id;
        clientName = c.name;
      }
    } else {
      const newClient = {
        id: `client-${Date.now()}`,
        name: clientData.name.trim(),
        email: clientData.email.trim(),
        phone: clientData.phone.trim(),
        address: clientData.address.trim() || undefined,
        municipality: clientData.municipality.trim() || undefined,
        projects: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      addClient(newClient);
      clientId = newClient.id;
      clientName = newClient.name;
    }

    const proposal: Proposal = {
      id: proposalId,
      clientId,
      clientName,
      projectType,
      phases: selectedPhases.map((p) => ({ ...p, selected: true })),
      totalValue: subtotal,
      vatRate,
      totalWithVat: total,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: calculateValidUntil(),
    };
    addProposal(proposal);
    toast.success('Proposta guardada com sucesso');
    resetForm();
  };

  const steps = [
    { number: 1, title: 'Cliente', icon: Users },
    { number: 2, title: 'Projeto', icon: Building2 },
    { number: 3, title: 'Resumo', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Comercial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Gerador de Propostas</h1>
          <p className="text-muted-foreground mt-2">
            Crie propostas profissionais em minutos
          </p>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Proposta</span>
        </button>
      </motion.div>

      {/* Saved Proposals */}
      {proposals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Propostas Recentes
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{proposals.length}</span>
            </h3>
          </div>
          <div className="divide-y divide-border max-h-48 overflow-y-auto">
            {proposals.map((p) => (
              <div
                key={p.id}
                onClick={() => loadProposal(p)}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{p.clientName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{p.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {projectTypes.find((t) => t.id === p.projectType)?.label || p.projectType} • {formatCurrency(p.totalWithVat)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    p.status === 'draft' ? 'bg-muted text-muted-foreground' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {p.status === 'draft' ? 'Rascunho' : p.status}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); createProjectFromProposal(p); }}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Criar Projeto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-center gap-4"
      >
        {steps.map((s, index) => (
          <React.Fragment key={s.number}>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  step >= s.number 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s.number ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${step >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 rounded ${step > s.number ? 'bg-primary' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Form Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        {/* Step Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold">
            {step === 1 && 'Dados do Cliente'}
            {step === 2 && 'Tipo de Projeto e Fases'}
            {step === 3 && 'Resumo da Proposta'}
          </h2>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUseExistingClient(true);
                    setClientData({ name: '', email: '', phone: '', address: '', municipality: '' });
                  }}
                  className={`flex-1 p-4 rounded-xl border text-left transition-all ${
                    useExistingClient
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/40'
                  }`}
                >
                  <Users className={`w-5 h-5 mb-2 ${useExistingClient ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-medium">Cliente existente</p>
                  <p className="text-xs text-muted-foreground mt-1">Selecionar da base de dados</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseExistingClient(false);
                    setSelectedClientId('');
                  }}
                  className={`flex-1 p-4 rounded-xl border text-left transition-all ${
                    !useExistingClient
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/40'
                  }`}
                >
                  <Plus className={`w-5 h-5 mb-2 ${!useExistingClient ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-medium">Novo cliente</p>
                  <p className="text-xs text-muted-foreground mt-1">Adicionar manualmente</p>
                </button>
              </div>

              {useExistingClient ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Seleciona o cliente *</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">— Escolhe um cliente —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.email}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <input
                      type="text"
                      value={clientData.name}
                      onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={clientData.email}
                      onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="email@exemplo.pt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone *</label>
                    <input
                      type="tel"
                      value={clientData.phone}
                      onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="+351 000 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Município</label>
                    <input
                      type="text"
                      value={clientData.municipality}
                      onChange={(e) => setClientData({ ...clientData, municipality: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Ex: Lisboa, Porto..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium mb-4">Tipo de Projeto *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        projectType === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-muted/30 hover:border-primary/40'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mb-2 ${projectType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`font-medium text-sm ${projectType === type.id ? 'text-primary' : ''}`}>{type.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">Fases a Incluir *</label>
                <div className="space-y-2">
                  {phases.map((phase) => (
                    <div
                      key={phase.id}
                      onClick={() => togglePhase(phase.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        phase.selected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-muted/30 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            phase.selected ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                          }`}
                        >
                          {phase.selected && <Check className="w-4 h-4 text-primary-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium">{phase.name}</p>
                          <p className="text-sm text-muted-foreground">{phase.description}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-lg">{formatCurrency(phase.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handlePreviewPDF}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Pré-visualizar</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
              </div>

              <div className="bg-muted/30 rounded-xl p-6 space-y-6">
                {/* Client & Project Info */}
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Cliente</p>
                    <p className="font-semibold text-lg">
                      {useExistingClient && selectedClientId
                        ? clients.find((c) => c.id === selectedClientId)?.name || ''
                        : clientData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tipo de Projeto</p>
                    <p className="font-semibold text-lg">
                      {projectTypes.find((t) => t.id === projectType)?.label}
                    </p>
                  </div>
                </div>

                {/* Selected Phases */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Fases Selecionadas</p>
                  <div className="space-y-2">
                    {selectedPhases.map((phase) => (
                      <div key={phase.id} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{phase.name}</span>
                        <span className="font-medium">{formatCurrency(phase.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA ({vatRate}%)</span>
                    <span className="font-medium">{formatCurrency(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between px-6 py-4 border-t border-border bg-muted/20">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {step === 3 ? (
            <button
              onClick={handleFinalize}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Proposta</span>
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPDFPreview && (
          <PDFPreview
            isOpen={showPDFPreview}
            onClose={() => setShowPDFPreview(false)}
            clientData={clientData}
            projectType={projectType}
            projectTypeLabel={projectTypes.find((t) => t.id === projectType)?.label || ''}
            phases={selectedPhases}
            subtotal={subtotal}
            vatRate={vatRate}
            vatAmount={vatAmount}
            total={total}
            proposalNumber={proposalNumber}
            proposalDate={proposalDate}
            validUntil={validUntil}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
