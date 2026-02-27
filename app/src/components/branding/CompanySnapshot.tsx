/**
 * CompanySnapshot - Infografia institucional da Ferreirarquitetos
 * Componente reutilizável para propostas, website, apresentações, etc.
 */

import { PROPOSAL_PALETTE } from '../../lib/proposalPalette';

const COLORS = PROPOSAL_PALETTE;

interface CompanySnapshotProps {
  /** Variante de apresentação */
  variant?: 'full' | 'compact' | 'minimal';
  /** Idioma */
  lang?: 'pt' | 'en';
  /** Para uso em PDF (ajusta tamanhos) */
  forPrint?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

// Dados da empresa (centralizado para fácil atualização)
const COMPANY_DATA = {
  name: 'Ferreirarquitetos',
  foundedYear: 2017,
  founder: 'José Ferreira',
  founderTitle: { pt: 'Arquiteto', en: 'Architect' },
  location: 'Aveiro, Portugal',
  awards: [
    { 
      name: { pt: 'Medalha de Prata', en: 'Silver Medal' },
      event: { pt: 'Prémios Lusófonos de Arquitetura e Design de Interiores', en: 'Lusophone Architecture & Interior Design Awards' },
      year: 2021,
    },
  ],
  specializations: [
    { id: 'habitacao', icon: '🏠', name: { pt: 'Habitação', en: 'Residential' } },
    { id: 'reabilitacao', icon: '🔄', name: { pt: 'Reabilitação', en: 'Renovation' } },
    { id: 'comercial', icon: '🏢', name: { pt: 'Comercial', en: 'Commercial' } },
  ],
  highlights: [
    { id: 'bim', icon: '📐', name: { pt: 'Metodologia BIM', en: 'BIM Methodology' } },
    { id: 'acompanhamento', icon: '👁️', name: { pt: 'Acompanhamento de Obra', en: 'Site Supervision' } },
    { id: 'licenciamento', icon: '📋', name: { pt: 'Licenciamento Completo', en: 'Full Licensing' } },
  ],
};

const C = COLORS;

export function CompanySnapshot({ 
  variant = 'full', 
  lang = 'pt', 
  forPrint = false,
  className = '',
}: CompanySnapshotProps) {
  const fs = (size: number) => forPrint ? `${size * 0.35}mm` : `${size}px`;
  const yearsActive = new Date().getFullYear() - COMPANY_DATA.foundedYear;
  
  const texts = {
    pt: {
      since: 'Desde',
      years: 'anos',
      specializations: 'Especialidades',
      methodology: 'Metodologia',
      award: 'Prémio',
      basedIn: 'Sediada em',
    },
    en: {
      since: 'Since',
      years: 'years',
      specializations: 'Specialties',
      methodology: 'Methodology',
      award: 'Award',
      basedIn: 'Based in',
    },
  };
  const t = texts[lang];

  // Variante MINIMAL - apenas logo + tagline + ano
  if (variant === 'minimal') {
    return (
      <div className={className} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: forPrint ? '3mm' : '12px',
        padding: forPrint ? '2mm 0' : '8px 0',
      }}>
        <div style={{ 
          width: forPrint ? '8mm' : '32px', 
          height: forPrint ? '8mm' : '32px', 
          background: C.accent, 
          borderRadius: forPrint ? '1mm' : '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.onAccent,
          fontWeight: 700,
          fontSize: fs(14),
        }}>
          F
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: fs(12), color: C.grafite }}>
            {COMPANY_DATA.name}
          </p>
          <p style={{ margin: 0, fontSize: fs(10), color: C.cinzaMarca }}>
            {t.since} {COMPANY_DATA.foundedYear} · {COMPANY_DATA.location}
          </p>
        </div>
      </div>
    );
  }

  // Variante COMPACT - uma linha com stats principais
  if (variant === 'compact') {
    return (
      <div className={className} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: forPrint ? '4mm' : '16px',
        padding: forPrint ? '3mm 4mm' : '12px 16px',
        background: C.offWhite,
        borderRadius: forPrint ? '2mm' : '8px',
        border: `1px solid ${C.cinzaLinha}`,
      }}>
        {/* Logo + Nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: forPrint ? '2mm' : '8px' }}>
          <div style={{ 
            width: forPrint ? '6mm' : '24px', 
            height: forPrint ? '6mm' : '24px', 
            background: C.accent, 
            borderRadius: forPrint ? '1mm' : '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.onAccent,
            fontWeight: 700,
            fontSize: fs(12),
          }}>
            F
          </div>
          <span style={{ fontWeight: 700, fontSize: fs(11), color: C.grafite }}>
            {COMPANY_DATA.name}
          </span>
        </div>
        
        {/* Stats inline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: forPrint ? '4mm' : '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: fs(10), color: C.cinzaMarca }}>
            📅 {t.since} {COMPANY_DATA.foundedYear}
          </span>
          <span style={{ fontSize: fs(10), color: C.cinzaMarca }}>
            🏆 {COMPANY_DATA.awards[0].name[lang]} {COMPANY_DATA.awards[0].year}
          </span>
          <span style={{ fontSize: fs(10), color: C.cinzaMarca }}>
            📍 {COMPANY_DATA.location}
          </span>
        </div>
      </div>
    );
  }

  // Variante FULL - infografia completa
  return (
    <div className={className} style={{ 
      padding: forPrint ? '5mm' : '20px',
      background: C.offWhite,
      borderRadius: forPrint ? '2mm' : '8px',
      border: `1px solid ${C.cinzaLinha}`,
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: forPrint ? '4mm' : '16px',
        paddingBottom: forPrint ? '3mm' : '12px',
        borderBottom: `2px solid ${C.accent}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: forPrint ? '3mm' : '12px' }}>
          <div style={{ 
            width: forPrint ? '10mm' : '40px', 
            height: forPrint ? '10mm' : '40px', 
            background: C.accent, 
            borderRadius: forPrint ? '1.5mm' : '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.onAccent,
            fontWeight: 700,
            fontSize: fs(18),
          }}>
            F
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: fs(14), color: C.grafite }}>
              {COMPANY_DATA.name}
            </p>
            <p style={{ margin: 0, fontSize: fs(10), color: C.cinzaMarca }}>
              {COMPANY_DATA.founder} · {COMPANY_DATA.founderTitle[lang]}
            </p>
          </div>
        </div>
        
        {/* Badge de prémio */}
        <div style={{ 
          background: '#fef3c7', 
          padding: forPrint ? '2mm 3mm' : '6px 10px', 
          borderRadius: forPrint ? '1mm' : '4px',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: fs(8), color: '#92400e', fontWeight: 600 }}>
            🏆 {COMPANY_DATA.awards[0].name[lang]}
          </p>
          <p style={{ margin: 0, fontSize: fs(7), color: '#a16207' }}>
            {COMPANY_DATA.awards[0].year}
          </p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div style={{ 
        display: 'flex', 
        gap: forPrint ? '3mm' : '12px',
        marginBottom: forPrint ? '4mm' : '16px',
      }}>
        {/* Anos de atividade */}
        <div style={{ 
          flex: 1, 
          background: C.white, 
          padding: forPrint ? '3mm' : '12px', 
          borderRadius: forPrint ? '1.5mm' : '6px',
          textAlign: 'center',
          border: `1px solid ${C.cinzaLinha}`,
        }}>
          <p style={{ margin: 0, fontSize: fs(20), fontWeight: 700, color: C.accent }}>
            {yearsActive}
          </p>
          <p style={{ margin: 0, fontSize: fs(8), color: C.cinzaMarca, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.years}
          </p>
        </div>
        
        {/* Localização */}
        <div style={{ 
          flex: 1, 
          background: C.white, 
          padding: forPrint ? '3mm' : '12px', 
          borderRadius: forPrint ? '1.5mm' : '6px',
          textAlign: 'center',
          border: `1px solid ${C.cinzaLinha}`,
        }}>
          <p style={{ margin: 0, fontSize: fs(12), fontWeight: 700, color: C.accent }}>
            📍
          </p>
          <p style={{ margin: 0, fontSize: fs(8), color: C.cinzaMarca, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {COMPANY_DATA.location}
          </p>
        </div>
      </div>
      
      {/* Especialidades */}
      <div style={{ marginBottom: forPrint ? '3mm' : '12px' }}>
        <p style={{ 
          margin: `0 0 ${forPrint ? '2mm' : '8px'} 0`, 
          fontSize: fs(9), 
          fontWeight: 600, 
          color: C.grafite,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {t.specializations}
        </p>
        <div style={{ display: 'flex', gap: forPrint ? '2mm' : '8px' }}>
          {COMPANY_DATA.specializations.map((spec) => (
            <span 
              key={spec.id}
              style={{ 
                flex: 1,
                padding: forPrint ? '2mm 3mm' : '8px 12px', 
                background: C.accentSoft, 
                borderRadius: forPrint ? '1mm' : '4px',
                fontSize: fs(9),
                color: C.accent,
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {spec.icon} {spec.name[lang]}
            </span>
          ))}
        </div>
      </div>
      
      {/* Metodologia */}
      <div>
        <p style={{ 
          margin: `0 0 ${forPrint ? '2mm' : '8px'} 0`, 
          fontSize: fs(9), 
          fontWeight: 600, 
          color: C.grafite,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {t.methodology}
        </p>
        <div style={{ display: 'flex', gap: forPrint ? '2mm' : '8px' }}>
          {COMPANY_DATA.highlights.map((item) => (
            <span 
              key={item.id}
              style={{ 
                flex: 1,
                padding: forPrint ? '2mm 3mm' : '8px 12px', 
                background: C.white, 
                borderRadius: forPrint ? '1mm' : '4px',
                fontSize: fs(8),
                color: C.cinzaMarca,
                textAlign: 'center',
                border: `1px solid ${C.cinzaLinha}`,
              }}
            >
              {item.icon} {item.name[lang]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanySnapshot;
