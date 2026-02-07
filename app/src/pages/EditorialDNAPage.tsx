import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dna, Plus, Trash2, Save, Mic, BookOpen, Columns3, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import type { EditorialDNA, EditorialPillar, EditorialVoice, EditorialFormat } from '@/types';

export default function EditorialDNAPage() {
  const { editorialDNA, setEditorialDNA } = useMedia();
  const [activeTab, setActiveTab] = useState<'pillars' | 'voices' | 'formats'>('pillars');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditorialDNA | null>(null);

  const dna = editing && draft ? draft : editorialDNA;
  if (!dna) return <div className="text-center py-20 text-muted-foreground">A carregar Editorial DNA...</div>;

  const startEditing = () => {
    setDraft(JSON.parse(JSON.stringify(dna)));
    setEditing(true);
  };

  const handleSave = () => {
    if (draft) {
      setEditorialDNA(draft);
      toast.success('Editorial DNA guardado');
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(null);
    setEditing(false);
  };

  // Pillar CRUD
  const addPillar = () => {
    if (!draft) return;
    setDraft({ ...draft, pillars: [...draft.pillars, { id: `p-${Date.now()}`, name: '', description: '' }] });
  };
  const updatePillar = (idx: number, patch: Partial<EditorialPillar>) => {
    if (!draft) return;
    const pillars = [...draft.pillars];
    pillars[idx] = { ...pillars[idx], ...patch };
    setDraft({ ...draft, pillars });
  };
  const removePillar = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, pillars: draft.pillars.filter((_, i) => i !== idx) });
  };

  // Voice CRUD
  const addVoice = () => {
    if (!draft) return;
    setDraft({ ...draft, voices: [...draft.voices, { id: `v-${Date.now()}`, name: '', tone: '', example: '' }] });
  };
  const updateVoice = (idx: number, patch: Partial<EditorialVoice>) => {
    if (!draft) return;
    const voices = [...draft.voices];
    voices[idx] = { ...voices[idx], ...patch };
    setDraft({ ...draft, voices });
  };
  const removeVoice = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, voices: draft.voices.filter((_, i) => i !== idx) });
  };

  // Format CRUD
  const addFormat = () => {
    if (!draft) return;
    setDraft({ ...draft, formats: [...draft.formats, { id: `f-${Date.now()}`, name: '', structure: '', examplePt: '', exampleEn: '' }] });
  };
  const updateFormat = (idx: number, patch: Partial<EditorialFormat>) => {
    if (!draft) return;
    const formats = [...draft.formats];
    formats[idx] = { ...formats[idx], ...patch };
    setDraft({ ...draft, formats });
  };
  const removeFormat = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, formats: draft.formats.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Dna className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Factory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Editorial DNA</h1>
          <p className="text-muted-foreground mt-2">Pilares, vozes e formatos que definem a marca FERREIRA</p>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button onClick={handleCancel} className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4" /> Guardar
              </button>
            </>
          ) : (
            <button onClick={startEditing} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              <Edit3 className="w-4 h-4" /> Editar
            </button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-2">
        {([
          { key: 'pillars', label: 'Pilares', icon: Columns3, count: dna.pillars.length },
          { key: 'voices', label: 'Vozes', icon: Mic, count: dna.voices.length },
          { key: 'formats', label: 'Formatos', icon: BookOpen, count: dna.formats.length },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              activeTab === tab.key ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-xs">{tab.count}</span>
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {activeTab === 'pillars' && (
          <div className="space-y-3">
            {dna.pillars.map((p, i) => (
              <div key={p.id} className="bg-card border border-border rounded-xl p-5">
                {editing ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input value={p.name} onChange={(e) => updatePillar(i, { name: e.target.value })} placeholder="Nome do pilar" className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none" />
                      <button onClick={() => removePillar(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input value={p.description} onChange={(e) => updatePillar(i, { description: e.target.value })} placeholder="Descrição" className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none" />
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  </div>
                )}
              </div>
            ))}
            {editing && (
              <button onClick={addPillar} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                <Plus className="w-4 h-4" /> Adicionar Pilar
              </button>
            )}
          </div>
        )}

        {activeTab === 'voices' && (
          <div className="space-y-3">
            {dna.voices.map((v, i) => (
              <div key={v.id} className="bg-card border border-border rounded-xl p-5">
                {editing ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input value={v.name} onChange={(e) => updateVoice(i, { name: e.target.value })} placeholder="Nome da voz" className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none" />
                      <button onClick={() => removeVoice(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input value={v.tone} onChange={(e) => updateVoice(i, { tone: e.target.value })} placeholder="Tom" className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none" />
                    <textarea value={v.example} onChange={(e) => updateVoice(i, { example: e.target.value })} placeholder="Exemplo" rows={2} className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none resize-none" />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{v.name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{v.tone}</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{v.example}"</p>
                  </div>
                )}
              </div>
            ))}
            {editing && (
              <button onClick={addVoice} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                <Plus className="w-4 h-4" /> Adicionar Voz
              </button>
            )}
          </div>
        )}

        {activeTab === 'formats' && (
          <div className="space-y-3">
            {dna.formats.map((f, i) => (
              <div key={f.id} className="bg-card border border-border rounded-xl p-5">
                {editing ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input value={f.name} onChange={(e) => updateFormat(i, { name: e.target.value })} placeholder="Nome do formato" className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none" />
                      <button onClick={() => removeFormat(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input value={f.structure} onChange={(e) => updateFormat(i, { structure: e.target.value })} placeholder="Estrutura" className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none" />
                    <textarea value={f.examplePt} onChange={(e) => updateFormat(i, { examplePt: e.target.value })} placeholder="Exemplo PT" rows={2} className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none resize-none" />
                    <textarea value={f.exampleEn} onChange={(e) => updateFormat(i, { exampleEn: e.target.value })} placeholder="Exemplo EN" rows={2} className="w-full px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none resize-none" />
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold mb-1">{f.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{f.structure}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <span className="text-[10px] font-bold text-primary uppercase">PT</span>
                        <p className="text-sm mt-1">{f.examplePt}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <span className="text-[10px] font-bold text-primary uppercase">EN</span>
                        <p className="text-sm mt-1">{f.exampleEn}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {editing && (
              <button onClick={addFormat} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                <Plus className="w-4 h-4" /> Adicionar Formato
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
