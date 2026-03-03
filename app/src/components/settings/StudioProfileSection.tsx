import React, { useState } from 'react';
import { Globe, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { useStudio } from '@/context/StudioContext';
import type { StudioProfile } from '@/types';

const SOCIAL_FIELDS: {
  key: keyof StudioProfile['social'];
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { key: 'website', label: 'Website', placeholder: 'https://ferreira-arquitetos.pt/', icon: <Globe className="w-4 h-4" />, color: 'text-blue-500' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/ferreirarquitetos/', icon: <Instagram className="w-4 h-4" />, color: 'text-pink-500' },
  { key: 'linkedinPersonal', label: 'LinkedIn Pessoal', placeholder: 'https://www.linkedin.com/in/...', icon: <Linkedin className="w-4 h-4" />, color: 'text-blue-600' },
  { key: 'linkedinCompany', label: 'LinkedIn Empresa', placeholder: 'https://www.linkedin.com/company/...', icon: <Linkedin className="w-4 h-4" />, color: 'text-blue-700' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/...', icon: <Facebook className="w-4 h-4" />, color: 'text-blue-500' },
  { key: 'threads', label: 'Threads', placeholder: 'https://www.threads.com/@...', icon: <span className="w-4 h-4 font-bold text-xs flex items-center justify-center">@</span>, color: 'text-foreground' },
  { key: 'behance', label: 'Behance', placeholder: 'https://www.behance.net/...', icon: <span className="w-4 h-4 font-bold text-xs flex items-center justify-center">Be</span>, color: 'text-blue-400' },
  { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pt.pinterest.com/...', icon: <span className="w-4 h-4 font-bold text-xs flex items-center justify-center">P</span>, color: 'text-red-500' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@...', icon: <Youtube className="w-4 h-4" />, color: 'text-red-500' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@...', icon: <span className="w-4 h-4 font-bold text-xs flex items-center justify-center">TT</span>, color: 'text-foreground' },
];

const PROFILE_FIELDS: { key: keyof Omit<StudioProfile, 'social'>; label: string; placeholder: string; type?: string }[] = [
  { key: 'name', label: 'Nome do Estúdio', placeholder: 'Ferreirarquitetos' },
  { key: 'founderName', label: 'Nome do Fundador', placeholder: 'José Ferreira' },
  { key: 'founderTitle', label: 'Título Profissional', placeholder: 'Arquiteto' },
  { key: 'oasrn', label: 'Nº OA', placeholder: 'Número na Ordem dos Arquitetos' },
  { key: 'email', label: 'Email', placeholder: 'geral@ferreira-arquitetos.pt', type: 'email' },
  { key: 'phone', label: 'Telefone', placeholder: '+351 234 000 000' },
  { key: 'nif', label: 'NIF', placeholder: 'NIF do estúdio' },
  { key: 'municipality', label: 'Localização', placeholder: 'Aveiro, Portugal' },
  { key: 'tagline', label: 'Tagline', placeholder: 'Arquitetura · Interiores · Urbanismo' },
];

export default function StudioProfileSection() {
  const { profile, updateProfile, updateSocial } = useStudio();
  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [localSocial, setLocalSocial] = useState({ ...profile.social });
  const [dirty, setDirty] = useState(false);

  const handleProfileChange = (key: keyof Omit<StudioProfile, 'social'>, value: string) => {
    setLocalProfile((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const handleSocialChange = (key: keyof StudioProfile['social'], value: string) => {
    setLocalSocial((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    updateProfile({ ...localProfile });
    updateSocial({ ...localSocial });
    setDirty(false);
    toast.success('Perfil do estúdio guardado');
  };

  const handleDiscard = () => {
    setLocalProfile({ ...profile });
    setLocalSocial({ ...profile.social });
    setDirty(false);
  };

  return (
    <div className="space-y-6">
      {/* Dados do estúdio */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-sm">Dados do Estúdio</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Utilizados nas propostas, PDFs e no dashboard</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROFILE_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-medium text-muted-foreground block mb-1">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={(localProfile[field.key] as string) ?? ''}
                onChange={(e) => handleProfileChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1">Bio / Descrição</label>
            <textarea
              value={localProfile.bio ?? ''}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              placeholder="Descrição curta do estúdio..."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Redes sociais */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-sm">Redes Sociais & Website</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Aparecem no rodapé das propostas e no dashboard</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-medium text-muted-foreground block mb-1">{field.label}</label>
              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 ${field.color}`}>{field.icon}</span>
                <input
                  type="url"
                  value={(localSocial[field.key] as string) ?? ''}
                  onChange={(e) => handleSocialChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex-1 px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 min-w-0"
                />
                {(localSocial[field.key] as string) && (
                  <a
                    href={localSocial[field.key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Abrir link"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botões */}
      {dirty && (
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Descartar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Guardar Alterações
          </button>
        </div>
      )}
    </div>
  );
}
