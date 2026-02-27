import { useRef, useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, MapPin, Euro, ChevronDown, ExternalLink, Check, Building2,
  Home, RotateCcw, Palette, Store, UtensilsCrossed, HelpCircle, ArrowLeft, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { decodeProposalPayload, loadPayloadLocally } from '../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../lib/proposalPalette';
import { t, type Lang } from '../locales';
import { ProposalDocument } from '../components/proposals/ProposalDocument';

const C = PROPOSAL_PALETTE;
const A4_WIDTH_PX = 794;
const COTACAO_STORAGE_KEY = 'fa360_cotacao_requests';

type ProjectType = 'habitacao' | 'reabilitacao' | 'interiores' | 'comercial' | 'restauracao' | 'outro';
type BudgetRange = '<50k' | '50-100k' | '100-200k' | '200-500k' | '>500k' | 'nao-sei';
type DeadlineRange = '<6m' | '6-12m' | '>12m' | 'flexivel';

interface QuoteFormData {
  projectType: ProjectType;
  location: string;
  area: string;
  budget: BudgetRange;
  deadline: DeadlineRange;
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyAccepted: boolean;
}

const PROJECT_TYPES: { value: ProjectType; label: string; icon: typeof Home }[] = [
  { value: 'habitacao', label: 'Habitação Nova', icon: Home },
  { value: 'reabilitacao', label: 'Reabilitação', icon: RotateCcw },
  { value: 'interiores', label: 'Interiores', icon: Palette },
  { value: 'comercial', label: 'Comercial', icon: Store },
  { value: 'restauracao', label: 'Restauração', icon: UtensilsCrossed },
  { value: 'outro', label: 'Outro', icon: HelpCircle },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: '<50k', label: '< 50.000 €' },
  { value: '50-100k', label: '50.000 – 100.000 €' },
  { value: '100-200k', label: '100.000 – 200.000 €' },
  { value: '200-500k', label: '200.000 – 500.000 €' },
  { value: '>500k', label: '> 500.000 €' },
  { value: 'nao-sei', label: 'Não sei' },
];

const DEADLINE_OPTIONS: { value: DeadlineRange; label: string }[] = [
  { value: '<6m', label: '< 6 meses' },
  { value: '6-12m', label: '6 – 12 meses' },
  { value: '>12m', label: '> 12 meses' },
  { value: 'flexivel', label: 'Flexível' },
];

function getInitials(name: string): string {
  if (name.toLowerCase().includes('ferreirarquitetos') || name.toLowerCase().includes('ferreira')) return 'FA';
  if (name.includes(' ')) return name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function saveQuoteRequest(data: QuoteFormData): void {
  try {
    const raw = localStorage.getItem(COTACAO_STORAGE_KEY);
    const list: QuoteFormData[] = raw ? JSON.parse(raw) : [];
    list.unshift({ ...data, privacyAccepted: true });
    localStorage.setItem(COTACAO_STORAGE_KEY, JSON.stringify(list.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function QuoteRequestForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<QuoteFormData>({
    projectType: 'habitacao',
    location: '',
    area: '',
    budget: 'nao-sei',
    deadline: 'flexivel',
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyAccepted: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});

  const progress = (step / 4) * 100;

  const update = (patch: Partial<QuoteFormData>) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch) as (keyof QuoteFormData)[]) delete next[k];
      return next;
    });
  };

  const validateStep = (): boolean => {
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) {
      const e: Partial<Record<keyof QuoteFormData, string>> = {};
      if (!form.name.trim()) e.name = 'Nome obrigatório';
      if (!form.email.trim()) e.email = 'Email obrigatório';
      else if (!validateEmail(form.email)) e.email = 'Email inválido';
      if (!form.phone.trim()) e.phone = 'Telefone obrigatório';
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    if (step === 4) {
      if (!form.privacyAccepted) {
        setErrors({ privacyAccepted: 'Tem de aceitar a política de privacidade' });
        return false;
      }
      return true;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 4) setStep(step + 1);
    else {
      saveQuoteRequest(form);
      setSubmitted(true);
    }
  };

  const prev = () => setStep(Math.max(1, step - 1));

  const projectTypeLabel = PROJECT_TYPES.find((t) => t.value === form.projectType)?.label ?? form.projectType;
  const budgetLabel = BUDGET_OPTIONS.find((b) => b.value === form.budget)?.label ?? form.budget;
  const deadlineLabel = DEADLINE_OPTIONS.find((d) => d.value === form.deadline)?.label ?? form.deadline;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Obrigado!</h1>
          <p className="text-muted-foreground mb-8">
            Entraremos em contacto dentro de 24 horas.
          </p>
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90"
          >
            Ver o nosso Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">FA</span>
            </div>
            <span className="font-semibold">FERREIRARQUITETOS</span>
          </div>
          <button
            onClick={() => navigate('/portfolio')}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Portfolio
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Que tipo de projeto procura?</h2>
                <p className="text-muted-foreground text-sm">Selecione a opção que melhor descreve o seu projeto.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PROJECT_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update({ projectType: opt.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.projectType === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <opt.icon className="w-6 h-6 text-primary mb-2" />
                    <span className="font-medium text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Detalhes do Projeto</h2>
                <p className="text-muted-foreground text-sm">Informações que nos ajudam a preparar a sua cotação.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Localização</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => update({ location: e.target.value })}
                    placeholder="Cidade ou concelho"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Área aproximada (m²)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.area}
                    onChange={(e) => update({ area: e.target.value })}
                    placeholder="Ex: 150"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Orçamento estimado</label>
                  <select
                    value={form.budget}
                    onChange={(e) => update({ budget: e.target.value as BudgetRange })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {BUDGET_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo desejado</label>
                  <select
                    value={form.deadline}
                    onChange={(e) => update({ deadline: e.target.value as DeadlineRange })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {DEADLINE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Como podemos contactá-lo?</h2>
                <p className="text-muted-foreground text-sm">Os campos com * são obrigatórios.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome completo *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="O seu nome"
                    className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none ${
                      errors.name ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="email@exemplo.pt"
                    className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none ${
                      errors.email ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="+351 910 000 000"
                    className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none ${
                      errors.phone ? 'border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem / Notas adicionais</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update({ message: e.target.value })}
                    placeholder="Conte-nos mais sobre o seu projeto..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Confirmação</h2>
                <p className="text-muted-foreground text-sm">Revise os dados antes de enviar.</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-muted/30 space-y-3">
                <p><span className="text-muted-foreground">Tipo:</span> {projectTypeLabel}</p>
                {form.location && <p><span className="text-muted-foreground">Localização:</span> {form.location}</p>}
                {form.area && <p><span className="text-muted-foreground">Área:</span> {form.area} m²</p>}
                <p><span className="text-muted-foreground">Orçamento:</span> {budgetLabel}</p>
                <p><span className="text-muted-foreground">Prazo:</span> {deadlineLabel}</p>
                <p><span className="text-muted-foreground">Nome:</span> {form.name}</p>
                <p><span className="text-muted-foreground">Email:</span> {form.email}</p>
                <p><span className="text-muted-foreground">Telefone:</span> {form.phone}</p>
                {form.message && <p><span className="text-muted-foreground">Mensagem:</span> {form.message}</p>}
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.privacyAccepted}
                  onChange={(e) => update({ privacyAccepted: e.target.checked })}
                  className="mt-1 rounded border-border"
                />
                <span className="text-sm">
                  Aceito a{' '}
                  <a href="/politica-privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </a>
                  . Os meus dados serão usados apenas para responder ao pedido de cotação.
                </span>
              </label>
              {errors.privacyAccepted && (
                <p className="text-sm text-destructive">{errors.privacyAccepted}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-12">
          <button
            onClick={prev}
            disabled={step === 1}
            className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={next}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 flex items-center gap-2"
          >
            {step === 4 ? (
              <>
                Enviar Pedido de Cotação
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Seguinte
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProposalView({ p, lang }: { p: NonNullable<ReturnType<typeof loadPayloadLocally>>; lang: Lang }) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [documentScale, setDocumentScale] = useState(1);
  const documentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      const padding = 32;
      const availableWidth = screenWidth - padding;
      if (availableWidth < A4_WIDTH_PX) setDocumentScale(availableWidth / A4_WIDTH_PX);
      else setDocumentScale(1);
    };
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'pt-PT', { style: 'currency', currency: 'EUR' }).format(v);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.offWhite }}>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl' : ''}`}
        style={{
          backgroundColor: isScrolled ? 'rgba(246, 245, 242, 0.9)' : 'transparent',
          borderBottom: isScrolled ? `1px solid ${C.cinzaLinha}` : 'none',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.accent }}>
              <span className="text-sm font-bold" style={{ color: C.onAccent }}>{getInitials(p.branding.appName)}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold" style={{ color: C.grafite }}>{p.branding.appName}</p>
              {p.branding.appSlogan && <p className="text-xs" style={{ color: C.cinzaMarca }}>{p.branding.appSlogan}</p>}
            </div>
          </div>
        </div>
      </motion.header>

      <section className="relative pt-28 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl" style={{ backgroundColor: C.accent }} />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-2xl" style={{ backgroundColor: C.accent }} />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: `${C.accent}10`, color: C.accent }}>
              <FileText className="w-4 h-4" />
              <span>{t('proposal.title', lang)}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ color: C.grafite }}>
              {p.projeto || t('proposal.title', lang)}
            </h1>

            {p.cliente && (
              <p className="text-xl sm:text-2xl mb-2" style={{ color: C.cinzaMarca }}>
                {lang === 'pt' ? 'para' : 'for'} <span className="font-semibold" style={{ color: C.accent }}>{p.cliente}</span>
              </p>
            )}

            <p className="text-sm mb-8" style={{ color: C.cinzaMarca }}>
              {t('proposal.ref', lang)} {p.ref} · {p.data}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl text-center"
                style={{ backgroundColor: C.white, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                <Euro className="w-5 h-5 mx-auto mb-2" style={{ color: C.accent }} />
                {p.totalSemIVA != null ? (
                  <>
                    <p className="text-sm" style={{ color: C.cinzaMarca }}>{formatCurrency(p.totalSemIVA)} <span className="text-xs">(s/IVA)</span></p>
                    <p className="text-2xl font-bold" style={{ color: C.grafite }}>{formatCurrency(p.total)}</p>
                    <p className="text-xs font-medium" style={{ color: C.accent }}>{t('proposal.totalInclVat', lang)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold" style={{ color: C.grafite }}>{formatCurrency(p.total)}</p>
                    <p className="text-xs" style={{ color: C.cinzaMarca }}>{t('proposal.totalInclVat', lang)}</p>
                  </>
                )}
              </motion.div>

              {p.local && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 rounded-2xl text-center"
                  style={{ backgroundColor: C.white, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                >
                  <MapPin className="w-5 h-5 mx-auto mb-2" style={{ color: C.accent }} />
                  <p className="text-lg font-semibold" style={{ color: C.grafite }}>{p.localizacao}</p>
                  <p className="text-xs truncate" style={{ color: C.cinzaMarca }}>{p.local}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl text-center"
                style={{ backgroundColor: C.white, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                <Building2 className="w-5 h-5 mx-auto mb-2" style={{ color: C.accent }} />
                <p className="text-lg font-semibold" style={{ color: C.grafite }}>{p.modo}</p>
                <p className="text-xs" style={{ color: C.cinzaMarca }}>{p.tipologia || t('proposal.typology', lang)}</p>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowDocument(!showDocument)}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-xl transition-all"
                style={{ backgroundColor: C.accent, color: C.onAccent }}
              >
                <FileText className="w-5 h-5" />
                <span>{showDocument ? 'Ocultar Proposta' : 'Ver Proposta Completa'}</span>
              </button>

              {p.linkGoogleMaps && (
                <a
                  href={p.linkGoogleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-xl transition-all border"
                  style={{ borderColor: C.cinzaLinha, color: C.grafite }}
                >
                  <MapPin className="w-5 h-5" />
                  <span>{t('proposal.viewOnGoogleMaps', lang)}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12">
              <ChevronDown className="w-6 h-6 mx-auto animate-bounce" style={{ color: C.cinzaMarca }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showDocument && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="py-12 px-2 sm:px-6"
            style={{ backgroundColor: C.offWhite }}
          >
            <div className="mx-auto" style={{ maxWidth: documentScale < 1 ? '100%' : '80rem' }}>
              <div ref={documentContainerRef} className="flex justify-center">
                <div style={{ width: documentScale < 1 ? `${A4_WIDTH_PX * documentScale}px` : 'auto' }}>
                  <div
                    ref={pdfRef}
                    className="bg-white text-black rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      width: `${A4_WIDTH_PX}px`,
                      boxSizing: 'border-box',
                      transform: documentScale < 1 ? `scale(${documentScale})` : 'none',
                      transformOrigin: 'top left',
                    }}
                  >
                    <ProposalDocument payload={p} lang={lang} />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="py-16 px-4 sm:px-6" style={{ backgroundColor: C.accent }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <p className="text-2xl font-bold" style={{ color: C.onAccent }}>{p.branding.appName}</p>
            {p.branding.appSlogan && <p className="text-sm mt-1" style={{ color: C.onAccentMuted }}>{p.branding.appSlogan}</p>}
          </div>
          {(p.branding.email || p.branding.telefone || p.branding.website) && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
              {p.branding.email && (
                <a href={`mailto:${p.branding.email}`} className="text-sm hover:underline" style={{ color: C.onAccent }}>{p.branding.email}</a>
              )}
              {p.branding.telefone && (
                <a href={`tel:${p.branding.telefone.replace(/\s/g, '')}`} className="text-sm hover:underline" style={{ color: C.onAccent }}>{p.branding.telefone}</a>
              )}
              {p.branding.website && (
                <a href={p.branding.website.startsWith('http') ? p.branding.website : `https://${p.branding.website}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: C.onAccent }}>{p.branding.website}</a>
              )}
            </div>
          )}
          {p.branding.morada && <p className="text-xs mb-6" style={{ color: C.onAccentMuted }}>{p.branding.morada}</p>}
          <p className="text-xs max-w-2xl mx-auto" style={{ color: C.onAccentMuted }}>{t('proposal.disclaimer', lang)}</p>
        </div>
      </footer>
    </div>
  );
}

function PropostaPublicPage() {
  const [searchParams] = useSearchParams();
  const { data: pathData } = useParams<{ data: string }>();
  const urlLang = searchParams.get('lang') as Lang | null;

  const hashPayload = (() => {
    try {
      const hash = window.location.hash;
      if (!hash) return null;
      const match = hash.match(/^#d=(.+)$/);
      if (!match) return null;
      return decodeProposalPayload(match[1]);
    } catch {
      return null;
    }
  })();
  const localId = searchParams.get('lid') || null;
  const encoded = searchParams.get('d') || pathData || null;
  const p = hashPayload || (localId ? loadPayloadLocally(localId) : null) || (encoded ? decodeProposalPayload(encoded) : null);
  const lang: Lang = urlLang === 'en' ? 'en' : (p?.lang ?? 'pt');

  if (p) {
    return <ProposalView p={p} lang={lang} />;
  }

  return <QuoteRequestForm />;
}

export default PropostaPublicPage;
