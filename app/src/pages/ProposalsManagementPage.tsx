import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Download, ChevronRight, Check, Building2, Home, Hammer, Wrench, PenTool, Eye } from 'lucide-react';
import { toast } from 'sonner';
import PDFPreview from '@/components/proposals/PDFPreview';

interface ProposalPhase {
  id: string;
  name: string;
  description: string;
  value: number;
  selected: boolean;
}

const projectTypes = [
  { id: 'obra-nova', label: 'Obra Nova', icon: Building2 },
  { id: 'remodelacao', label: 'Remodelação', icon: Home },
  { id: 'ampliacao', label: 'Ampliação', icon: Hammer },
  { id: 'interior', label: 'Design Interior', icon: PenTool },
  { id: 'consultoria', label: 'Consultoria', icon: Wrench },
];

const defaultPhases: ProposalPhase[] = [
  { id: 'ep', name: 'Estudo Prévio', description: 'Análise preliminar e esquemas', value: 2500, selected: false },
  { id: 'ap', name: 'Anteprojeto', description: 'Desenvolvimento de plantas e modelação 3D', value: 3500, selected: false },
  { id: 'lic', name: 'Licenciamento', description: 'Processo de aprovação municipal', value: 2000, selected: false },
  { id: 'pe', name: 'Projeto Execução', description: 'Detalhamento construtivo completo', value: 5000, selected: false },
  { id: 'ao', name: 'Assistência Obra', description: 'Acompanhamento e fiscalização', value: 4500, selected: false },
  { id: 'fec', name: 'Fecho', description: 'Documentação final e certificação', value: 1500, selected: false },
];

export default function ProposalsManagementPage() {
  const [step, setStep] = useState(1);
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
      return clientData.name && clientData.email && clientData.phone;
    }
    if (step === 2) {
      return projectType && selectedPhases.length > 0;
    }
    return true;
  };

  const resetForm = () => {
    setStep(1);
    setClientData({
      name: '',
      email: '',
      phone: '',
      address: '',
      municipality: '',
    });
    setProjectType('');
    setPhases(defaultPhases.map(p => ({ ...p, selected: false })));
    setShowPDFPreview(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm">Gestão de Propostas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gerador de Propostas</h1>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Proposta</span>
        </button>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Dados do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  value={clientData.name}
                  onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="email@exemplo.pt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telefone *</label>
                <input
                  type="tel"
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="+351 000 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Morada</label>
                <input
                  type="text"
                  value={clientData.address}
                  onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Rua, número, código postal"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Município</label>
                <input
                  type="text"
                  value={clientData.municipality}
                  onChange={(e) => setClientData({ ...clientData, municipality: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Ex: Lisboa, Porto, Braga..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Tipo de Projeto e Fases</h2>
            
            <div>
              <label className="block text-sm font-medium mb-3">Tipo de Projeto *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      projectType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted hover:border-muted-foreground/30'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${projectType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className={`text-sm font-medium ${projectType === type.id ? 'text-primary' : ''}`}>{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Fases a Incluir *</label>
              <div className="space-y-2">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    onClick={() => togglePhase(phase.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      phase.selected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          phase.selected ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}
                      >
                        {phase.selected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium">{phase.name}</p>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatCurrency(phase.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Resumo da Proposta</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviewPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Pré-visualizar PDF</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{clientData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Projeto</p>
                  <p className="font-medium">
                    {projectTypes.find((t) => t.id === projectType)?.label}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Fases Selecionadas</p>
                <div className="space-y-2">
                  {selectedPhases.map((phase) => (
                    <div key={phase.id} className="flex justify-between py-2">
                      <span>{phase.name}</span>
                      <span className="font-medium">{formatCurrency(phase.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA ({vatRate}%)</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{step === 3 ? 'Finalizar' : 'Próximo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
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
