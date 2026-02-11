import { useRef, useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MapPin, Euro, ChevronDown, ExternalLink, Check, Building2 } from 'lucide-react';
import { decodeProposalPayload, loadPayloadLocally } from '../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../lib/proposalPalette';
import { t, type Lang } from '../locales';
import { ProposalDocument } from '../components/proposals/ProposalDocument';
const C = PROPOSAL_PALETTE;
const A4_WIDTH_PX = 794;
const A4_WIDTH_MM = 210;

/** Extrai iniciais do nome da empresa (ex: "Ferreirarquitetos" → "FA", "Ferreira Arquitetos" → "FA") */
function getInitials(name: string): string {
  // Caso especial: Ferreirarquitetos → FA
  if (name.toLowerCase().includes('ferreirarquitetos') || name.toLowerCase().includes('ferreira')) {
    return 'FA';
  }
  // Se tem espaços, usar primeira letra de cada palavra
  if (name.includes(' ')) {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
  // Fallback: primeiras 2 letras
  return name.substring(0, 2).toUpperCase();
}

function PropostaPublicPage() {
  const [searchParams] = useSearchParams();
  const { data: pathData } = useParams<{ data: string }>();
  const urlLang = searchParams.get('lang') as Lang | null;
  
  // Prioridade de leitura: 1) hash fragment (#d=...) → 2) lid (localStorage) → 3) d (query param) → 4) path data
  const hashPayload = (() => {
    try {
      const hash = window.location.hash;
      if (!hash) return null;
      const match = hash.match(/^#d=(.+)$/);
      if (!match) return null;
      return decodeProposalPayload(match[1]);
    } catch { return null; }
  })();
  const localId = searchParams.get('lid') || null;
  const encoded = searchParams.get('d') || pathData || null;
  const p = hashPayload || (localId ? loadPayloadLocally(localId) : null) || (encoded ? decodeProposalPayload(encoded) : null);
  const lang: Lang = urlLang === 'en' ? 'en' : (p?.lang ?? 'pt');
  const pdfRef = useRef<HTMLDivElement>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [documentScale, setDocumentScale] = useState(1);
  const documentContainerRef = useRef<HTMLDivElement>(null);

  // Calculate document scale for mobile responsiveness
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      const padding = 32; // 16px each side
      const availableWidth = screenWidth - padding;
      // A4 width is approximately 794px at 96dpi
      if (availableWidth < A4_WIDTH_PX) {
        setDocumentScale(availableWidth / A4_WIDTH_PX);
      } else {
        setDocumentScale(1);
      }
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Error state
  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: C.offWhite }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: C.accent }}>
            <FileText className="w-8 h-8" style={{ color: C.onAccent }} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: C.grafite }}>{t('proposalError.notFound', lang)}</h1>
          <p className="text-base" style={{ color: C.cinzaMarca }}>
            {t('proposalError.linkExpired', lang)}
          </p>
        </motion.div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.offWhite }}>
      {/* Floating Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-xl' : ''
        }`}
        style={{ 
          backgroundColor: isScrolled ? 'rgba(246, 245, 242, 0.9)' : 'transparent',
          borderBottom: isScrolled ? `1px solid ${C.cinzaLinha}` : 'none'
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: C.accent }}
            >
              <span className="text-sm font-bold" style={{ color: C.onAccent }}>
                {getInitials(p.branding.appName)}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold" style={{ color: C.grafite }}>{p.branding.appName}</p>
              {p.branding.appSlogan && (
                <p className="text-xs" style={{ color: C.cinzaMarca }}>{p.branding.appSlogan}</p>
              )}
            </div>
          </div>
          
{/* Botão PDF disponível na secção CTA abaixo */}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 px-4 sm:px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
            style={{ backgroundColor: C.accent }}
          />
          <div 
            className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-2xl"
            style={{ backgroundColor: C.accent }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: `${C.accent}10`, color: C.accent }}
            >
              <FileText className="w-4 h-4" />
              <span>{t('proposal.title', lang)}</span>
            </div>

            {/* Title */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
              style={{ color: C.grafite }}
            >
              {p.projeto || t('proposal.title', lang)}
            </h1>

            {/* Client name */}
            {p.cliente && (
              <p className="text-xl sm:text-2xl mb-2" style={{ color: C.cinzaMarca }}>
                {lang === 'pt' ? 'para' : 'for'} <span className="font-semibold" style={{ color: C.accent }}>{p.cliente}</span>
              </p>
            )}

            {/* Ref & Date */}
            <p className="text-sm mb-8" style={{ color: C.cinzaMarca }}>
              {t('proposal.ref', lang)} {p.ref} · {p.data}
            </p>

            {/* Key Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              {/* Total Value */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl text-center"
                style={{ backgroundColor: C.white, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                <Euro className="w-5 h-5 mx-auto mb-2" style={{ color: C.accent }} />
                {p.totalSemIVA ? (
                  <>
                    <p className="text-sm" style={{ color: C.cinzaMarca }}>{formatCurrency(p.totalSemIVA)} <span className="text-xs">(s/IVA)</span></p>
                    <p className="text-2xl font-bold" style={{ color: C.grafite }}>{formatCurrency(p.total)}</p>
                    <p className="text-xs font-medium" style={{ color: C.accent }}>{t('proposal.totalInclVat', lang)}</p>
                    {/* Indicação que o total inclui ambas componentes */}
                    {p.isLoteamento && p.moradiaAddon && (
                      <p className="text-xs mt-1" style={{ color: C.cinzaMarca, fontStyle: 'italic' }}>Urbanismo + Arq. Moradias</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold" style={{ color: C.grafite }}>{formatCurrency(p.total)}</p>
                    <p className="text-xs" style={{ color: C.cinzaMarca }}>{t('proposal.totalInclVat', lang)}</p>
                  </>
                )}
                {/* Breakdown para loteamentos */}
                {p.isLoteamento && (
                  <div className="mt-3 pt-3 border-t text-left space-y-0.5" style={{ borderColor: '#e5e7eb' }}>
                    {/* ── Bloco: Urbanismo ── */}
                    <div className="flex justify-between items-center text-xs py-1 px-2 rounded" style={{ background: '#f0f4f8' }}>
                      <span style={{ color: C.accent, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>Urbanismo</span>
                      <span style={{ color: C.accent, fontWeight: 700, fontSize: '0.7rem' }}>{formatCurrency((p.valorArq || 0) + (p.valorEsp || 0))}</span>
                    </div>
                    {p.valorArq > 0 && (
                      <div className="flex justify-between text-xs pl-3 pr-2">
                        <span style={{ color: C.cinzaMarca }}>Projeto{p.lotCenarios && p.lotCenarios.length > 0 ? ` + ${p.lotCenarios.length} cenarios` : ''}</span>
                        <span style={{ color: C.grafite, fontWeight: 500 }}>{formatCurrency(p.valorArq)}</span>
                      </div>
                    )}
                    {p.valorEsp > 0 && (
                      <div className="flex justify-between text-xs pl-3 pr-2">
                        <span style={{ color: C.cinzaMarca }}>Especialidades</span>
                        <span style={{ color: C.grafite, fontWeight: 500 }}>{formatCurrency(p.valorEsp)}</span>
                      </div>
                    )}
                    {/* ── Bloco: Arquitetura Moradias ── */}
                    {p.moradiaAddon && (
                      <>
                        <div className="flex justify-between items-center text-xs py-1 px-2 rounded mt-1.5" style={{ background: '#fef9c3' }}>
                          <span style={{ color: '#92400e', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>Arq. Moradias</span>
                          <span style={{ color: '#92400e', fontWeight: 700, fontSize: '0.7rem' }}>{formatCurrency(p.moradiaAddon.totalAddon)}</span>
                        </div>
                        {p.moradiaAddon.totalOriginal > 0 && (
                          <div className="flex justify-between text-xs pl-3 pr-2">
                            <span style={{ color: C.cinzaMarca }}>Moradia original{p.moradiaAddon.modo === 'previo' ? ' (previo)' : ''}</span>
                            <span style={{ color: C.grafite, fontWeight: 500 }}>{formatCurrency(p.moradiaAddon.totalOriginal)}</span>
                          </div>
                        )}
                        {p.moradiaAddon.totalRepeticoesIguais > 0 && (
                          <div className="flex justify-between text-xs pl-3 pr-2">
                            <span style={{ color: C.cinzaMarca }}>Repetição (-{p.moradiaAddon.descontoIgual}%)</span>
                            <span style={{ color: C.grafite, fontWeight: 500 }}>{formatCurrency(p.moradiaAddon.totalRepeticoesIguais)}</span>
                          </div>
                        )}
                        {p.moradiaAddon.totalRepeticoesAdaptadas > 0 && (
                          <div className="flex justify-between text-xs pl-3 pr-2">
                            <span style={{ color: C.cinzaMarca }}>Adaptação (-{p.moradiaAddon.descontoAdaptada}%)</span>
                            <span style={{ color: C.grafite, fontWeight: 500 }}>{formatCurrency(p.moradiaAddon.totalRepeticoesAdaptadas)}</span>
                          </div>
                        )}
                        {p.moradiaAddon.totalFixoLotes > 0 && (
                          <div className="flex justify-between text-xs pl-3 pr-2">
                            <span style={{ color: C.cinzaMarca }}>Parcela fixa ({p.moradiaAddon.repeticoesIguais + p.moradiaAddon.repeticoesAdaptadas} lotes)</span>
                            <span style={{ color: C.grafite, fontWeight: 500 }}>{formatCurrency(p.moradiaAddon.totalFixoLotes)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Location */}
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

              {/* Project Type / Loteamento summary */}
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
                {p.isLoteamento && (
                  <div className="mt-3 pt-3 border-t text-left space-y-1" style={{ borderColor: '#e5e7eb' }}>
                    {p.lotNumLotes && (
                      <div className="flex justify-between text-xs">
                        <span style={{ color: C.cinzaMarca }}>Lotes</span>
                        <span style={{ color: C.grafite, fontWeight: 600 }}>{p.lotNumLotes}</span>
                      </div>
                    )}
                    {p.lotAreaEstudo && (
                      <div className="flex justify-between text-xs">
                        <span style={{ color: C.cinzaMarca }}>Terreno</span>
                        <span style={{ color: C.grafite, fontWeight: 600 }}>{parseFloat(p.lotAreaEstudo).toLocaleString('pt-PT')} m²</span>
                      </div>
                    )}
                    {p.lotFrenteTerreno && (
                      <div className="flex justify-between text-xs">
                        <span style={{ color: C.cinzaMarca }}>Frente</span>
                        <span style={{ color: C.grafite, fontWeight: 600 }}>{p.lotFrenteTerreno} m</span>
                      </div>
                    )}
                    {p.lotTipoHabitacao && (
                      <div className="flex justify-between text-xs">
                        <span style={{ color: C.cinzaMarca }}>Tipologia</span>
                        <span style={{ color: C.grafite, fontWeight: 600 }}>{p.lotTipoHabitacao}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
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

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12"
            >
              <ChevronDown 
                className="w-6 h-6 mx-auto animate-bounce" 
                style={{ color: C.cinzaMarca }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Summary Section */}
      <section className="py-12 px-4 sm:px-6" style={{ backgroundColor: C.white }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Phases Summary */}
            <div>
              <h2 
                className="text-sm font-semibold uppercase tracking-wider mb-6"
                style={{ color: C.accent }}
              >
                {t('proposal.section2', lang)}
              </h2>
              <div className="space-y-2">
                {p.fasesPagamento.map((fase, idx) => {
                  const isHeader = (fase as { isHeader?: boolean }).isHeader;
                  if (isHeader) {
                    return (
                      <div 
                        key={idx}
                        className="pt-3 pb-1 first:pt-0"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.accent }}>
                          {fase.nome}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: C.offWhite }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-7 rounded-md flex items-center justify-center text-xs font-semibold"
                          style={{ backgroundColor: `${C.accent}15`, color: C.accent }}
                        >
                          {fase.pct}%
                        </div>
                        <span className="text-sm font-medium" style={{ color: C.grafite }}>{fase.nome}</span>
                      </div>
                      {fase.valor != null && (
                        <span className="text-sm font-semibold" style={{ color: C.grafite }}>
                          {formatCurrency(fase.valor)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h2 
                className="text-sm font-semibold uppercase tracking-wider mb-6"
                style={{ color: C.accent }}
              >
                {lang === 'pt' ? 'O que está incluído' : 'What\'s included'}
              </h2>
              <div className="space-y-3">
                {p.descricaoFases.slice(0, 6).map((fase, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ backgroundColor: C.offWhite }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: C.accent }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: C.onAccent }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: C.grafite }}>{fase.nome}</p>
                      {fase.descricao && (
                        <p className="text-sm mt-1 line-clamp-2" style={{ color: C.cinzaMarca }}>{fase.descricao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Document Section */}
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
              <div 
                ref={documentContainerRef}
                className="flex justify-center"
              >
                <div
                  style={{
                    // Wrapper to handle scaled content height
                    width: documentScale < 1 ? `${A4_WIDTH_PX * documentScale}px` : 'auto',
                  }}
                >
                  <div
                    ref={pdfRef}
                    className="bg-white text-black rounded-xl overflow-hidden shadow-2xl"
                    style={{ 
                      width: `${A4_WIDTH_PX}px`,
                      boxSizing: 'border-box',
                      // Scale transform for mobile
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

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6" style={{ backgroundColor: C.accent }}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo/Name */}
          <div className="mb-6">
            <p className="text-2xl font-bold" style={{ color: C.onAccent }}>{p.branding.appName}</p>
            {p.branding.appSlogan && (
              <p className="text-sm mt-1" style={{ color: C.onAccentMuted }}>{p.branding.appSlogan}</p>
            )}
          </div>
          
          {/* Contact Info */}
          {(p.branding.email || p.branding.telefone || p.branding.website) && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
              {p.branding.email && (
                <a href={`mailto:${p.branding.email}`} className="text-sm hover:underline" style={{ color: C.onAccent }}>
                  {p.branding.email}
                </a>
              )}
              {p.branding.telefone && (
                <a href={`tel:${p.branding.telefone.replace(/\s/g, '')}`} className="text-sm hover:underline" style={{ color: C.onAccent }}>
                  {p.branding.telefone}
                </a>
              )}
              {p.branding.website && (
                <a href={p.branding.website.startsWith('http') ? p.branding.website : `https://${p.branding.website}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: C.onAccent }}>
                  {p.branding.website}
                </a>
              )}
            </div>
          )}
          
          {/* Address */}
          {p.branding.morada && (
            <p className="text-xs mb-6" style={{ color: C.onAccentMuted }}>{p.branding.morada}</p>
          )}
          
          {/* Disclaimer */}
          <p className="text-xs max-w-2xl mx-auto" style={{ color: C.onAccentMuted }}>
            {t('proposal.disclaimer', lang)}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PropostaPublicPage;
