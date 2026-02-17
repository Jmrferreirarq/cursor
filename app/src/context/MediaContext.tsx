import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  MediaAsset, ContentPack, ContentPost,
  EditorialDNA, PublicationSlot, PerformanceEntry,
} from '@/types';
import type { TrashEntry } from '@/services/storage';
import { localStorageService } from '@/services/localStorage';

interface MediaContextType {
  // Media Assets
  assets: MediaAsset[];
  addAsset: (asset: MediaAsset) => void;
  updateAsset: (id: string, patch: Partial<MediaAsset>) => void;
  deleteAsset: (id: string) => void;

  // Content Packs
  contentPacks: ContentPack[];
  addContentPack: (pack: ContentPack) => void;
  updateContentPack: (id: string, patch: Partial<ContentPack>) => void;
  deleteContentPack: (id: string) => void;

  // Content Posts
  posts: ContentPost[];
  addPost: (post: ContentPost) => void;
  updatePost: (id: string, patch: Partial<ContentPost>) => void;
  deletePost: (id: string) => void;
  reorderPosts: (orderedIds: string[]) => void;

  // Editorial DNA
  editorialDNA: EditorialDNA | null;
  setEditorialDNA: (dna: EditorialDNA) => void;

  // Slots
  slots: PublicationSlot[];
  setSlots: (slots: PublicationSlot[]) => void;

  // Performance
  performanceEntries: PerformanceEntry[];
  addPerformanceEntry: (entry: PerformanceEntry) => void;
  /** Apaga todo o conteúdo da Content Factory (media, posts, packs, performance) */
  resetMediaData: () => void;

  // Lixo (recuperável)
  trashAssets: TrashEntry<MediaAsset>[];
  trashPacks: TrashEntry<ContentPack>[];
  trashPosts: TrashEntry<ContentPost>[];
  restoreAsset: (id: string) => void;
  restorePack: (id: string) => void;
  restorePost: (id: string) => void;
  emptyTrash: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const svc = localStorageService;

// Default Editorial DNA
const defaultEditorialDNA: EditorialDNA = {
  pillars: [
    { id: 'p1', name: 'Processo', description: 'Como trabalhamos e pensamos cada projeto' },
    { id: 'p2', name: 'Detalhe Técnico', description: 'Soluções construtivas e materiais' },
    { id: 'p3', name: 'Antes/Depois', description: 'Transformações visíveis e impactantes' },
    { id: 'p4', name: 'Materiais', description: 'Texturas, acabamentos e paletas' },
    { id: 'p5', name: 'Obra em Andamento', description: 'Progresso e bastidores da construção' },
    { id: 'p6', name: 'Resultado Final', description: 'O projeto concluído e habitado' },
  ],
  voices: [
    { id: 'v1', name: 'Humano-Caloroso', tone: 'Próximo e acessível', example: 'Este projeto começou com uma conversa à volta de um café…' },
    { id: 'v2', name: 'Técnico', tone: 'Preciso e educativo', example: 'A solução estrutural em CLT reduziu o prazo em 40%.' },
    { id: 'v3', name: 'Comercial', tone: 'Persuasivo e confiante', example: 'Transformamos a sua visão num projeto que valoriza o seu investimento.' },
    { id: 'v4', name: 'Bastidores', tone: 'Autêntico e informal', example: 'Hoje na obra: o momento em que o betão encontra a luz.' },
  ],
  formats: [
    { id: 'f1', name: '1 Detalhe + 1 Lição', structure: 'Foto close-up + texto curto educativo', examplePt: 'Este encaixe em madeira evita pontes térmicas. Resultado: -30% na fatura energética.', exampleEn: 'This timber joint prevents thermal bridges. Result: -30% on energy bills.' },
    { id: 'f2', name: '3 Decisões de Projeto', structure: 'Carrossel 3 slides com decisão + justificação', examplePt: 'Porquê orientar a sala a sul? Luz natural o dia todo.', exampleEn: 'Why orient the living room south? Natural light all day.' },
    { id: 'f3', name: 'Erro Comum e Como Evitámos', structure: 'Problema → Solução → Resultado', examplePt: 'Erro: janelas sem sombreamento. Solução: palas em alumínio. Resultado: conforto térmico sem AC.', exampleEn: 'Mistake: unshaded windows. Solution: aluminium brise-soleil. Result: thermal comfort without AC.' },
    { id: 'f4', name: 'Antes / Depois', structure: 'Split-screen ou slider com legenda', examplePt: 'De armazém abandonado a escritório tech. 8 meses de obra.', exampleEn: 'From abandoned warehouse to tech office. 8 months of construction.' },
    { id: 'f5', name: 'Diário de Obra', structure: 'Sequência cronológica com narração', examplePt: 'Semana 12: a cobertura fechou. O momento em que a casa "nasce".', exampleEn: 'Week 12: the roof is closed. The moment the house is "born".' },
    { id: 'f6', name: 'Material em Foco', structure: 'Macro + contexto + especificações', examplePt: 'Microcimento: 2mm de espessura, infinitas possibilidades.', exampleEn: 'Microcement: 2mm thick, infinite possibilities.' },
    { id: 'f7', name: 'Pergunta do Cliente', structure: 'FAQ real com resposta visual', examplePt: '"Quanto custa um projeto?" Depende de 5 fatores. Explicamos cada um.', exampleEn: '"How much does a project cost?" It depends on 5 factors. We explain each one.' },
    { id: 'f8', name: 'Equipa em Ação', structure: 'Bastidores + contexto humano', examplePt: 'A Sofia a rever o projeto de execução. 47 desenhos técnicos em 3 semanas.', exampleEn: 'Sofia reviewing the execution project. 47 technical drawings in 3 weeks.' },
    { id: 'f9', name: 'Números que Importam', structure: 'Estatística + visual minimalista', examplePt: '287 m² · 14 meses · 0 alterações em obra.', exampleEn: '287 m² · 14 months · 0 changes during construction.' },
    { id: 'f10', name: 'Visita Virtual', structure: 'Walkthrough com narração', examplePt: 'Entre connosco nesta moradia em Loulé. Cada divisão conta uma história.', exampleEn: 'Come inside this house in Loulé. Each room tells a story.' },
  ],
};

// Default weekly slots
const defaultSlots: PublicationSlot[] = [
  { id: 'slot-mon', dayOfWeek: 1, label: 'Autoridade', channels: ['linkedin', 'ig-feed'], pillar: 'p2', voice: 'v2' },
  { id: 'slot-tue', dayOfWeek: 2, label: 'Obra', channels: ['ig-reels', 'tiktok'], pillar: 'p5', voice: 'v4' },
  { id: 'slot-wed', dayOfWeek: 3, label: 'Materiais/Detalhe', channels: ['ig-carrossel', 'pinterest'], pillar: 'p4', voice: 'v2' },
  { id: 'slot-thu', dayOfWeek: 4, label: 'Bastidores', channels: ['ig-stories', 'threads'], pillar: 'p1', voice: 'v4' },
  { id: 'slot-fri', dayOfWeek: 5, label: 'Prova Social / Portfólio', channels: ['ig-feed', 'youtube'], pillar: 'p6', voice: 'v3' },
  { id: 'slot-sun', dayOfWeek: 0, label: 'Resumo da Semana', channels: ['ig-stories', 'linkedin'], pillar: 'p1', voice: 'v1' },
];

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [contentPacks, setContentPacks] = useState<ContentPack[]>([]);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [trashAssets, setTrashAssets] = useState<TrashEntry<MediaAsset>[]>([]);
  const [trashPacks, setTrashPacks] = useState<TrashEntry<ContentPack>[]>([]);
  const [trashPosts, setTrashPosts] = useState<TrashEntry<ContentPost>[]>([]);
  const [editorialDNA, _setEditorialDNA] = useState<EditorialDNA | null>(null);
  const [slots, _setSlots] = useState<PublicationSlot[]>(defaultSlots);
  const [performanceEntries, setPerformanceEntries] = useState<PerformanceEntry[]>([]);

  // Load on mount
  useEffect(() => {
    try {
      const data = svc.load();
      if (data.mediaAssets.length) setAssets(data.mediaAssets);
      if (data.contentPacks.length) setContentPacks(data.contentPacks);
      if (data.contentPosts.length) setPosts(data.contentPosts);
      if (data.trashAssets?.length) setTrashAssets(data.trashAssets);
      if (data.trashPacks?.length) setTrashPacks(data.trashPacks);
      if (data.trashPosts?.length) setTrashPosts(data.trashPosts);
      _setEditorialDNA(data.editorialDNA ?? defaultEditorialDNA);
      if (data.slots.length) _setSlots(data.slots);
      if (data.performanceEntries.length) setPerformanceEntries(data.performanceEntries);
    } catch {
      _setEditorialDNA(defaultEditorialDNA);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      const existing = svc.load();
      svc.save({
        ...existing,
        mediaAssets: assets,
        contentPacks,
        contentPosts: posts,
        trashAssets,
        trashPacks,
        trashPosts,
        editorialDNA,
        slots,
        performanceEntries,
      });
    } catch { /* quota */ }
  }, [assets, contentPacks, posts, trashAssets, trashPacks, trashPosts, editorialDNA, slots, performanceEntries]);

  // ── Assets ──
  const addAsset = useCallback((asset: MediaAsset) => {
    setAssets((prev) => [asset, ...prev]);
  }, []);

  const updateAsset = useCallback((id: string, patch: Partial<MediaAsset>) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const deleteAsset = useCallback((id: string) => {
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      setTrashAssets((prev) => [...prev, { item: asset, deletedAt: new Date().toISOString() }]);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    }
  }, [assets]);

  // ── Content Packs ──
  const addContentPack = useCallback((pack: ContentPack) => {
    setContentPacks((prev) => [pack, ...prev]);
  }, []);

  const updateContentPack = useCallback((id: string, patch: Partial<ContentPack>) => {
    setContentPacks((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteContentPack = useCallback((id: string) => {
    const pack = contentPacks.find((p) => p.id === id);
    if (pack) {
      setTrashPacks((prev) => [...prev, { item: pack, deletedAt: new Date().toISOString() }]);
      setContentPacks((prev) => prev.filter((p) => p.id !== id));
    }
  }, [contentPacks]);

  // ── Posts ──
  const addPost = useCallback((post: ContentPost) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const updatePost = useCallback((id: string, patch: Partial<ContentPost>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deletePost = useCallback((id: string) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setTrashPosts((prev) => [...prev, { item: post, deletedAt: new Date().toISOString() }]);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }, [posts]);

  const reorderPosts = useCallback((orderedIds: string[]) => {
    setPosts((prev) => {
      const byId = new Map(prev.map((p) => [p.id, p]));
      const ordered = orderedIds.map((id) => byId.get(id)).filter(Boolean) as ContentPost[];
      const rest = prev.filter((p) => !orderedIds.includes(p.id));
      return [...ordered, ...rest];
    });
  }, []);

  // ── Editorial DNA ──
  const setEditorialDNA = useCallback((dna: EditorialDNA) => {
    _setEditorialDNA(dna);
  }, []);

  // ── Slots ──
  const setSlots = useCallback((s: PublicationSlot[]) => {
    _setSlots(s);
  }, []);

  // ── Performance ──
  const addPerformanceEntry = useCallback((entry: PerformanceEntry) => {
    setPerformanceEntries((prev) => [entry, ...prev]);
  }, []);

  const resetMediaData = useCallback(() => {
    setAssets([]);
    setContentPacks([]);
    setPosts([]);
    setTrashAssets([]);
    setTrashPacks([]);
    setTrashPosts([]);
    _setEditorialDNA(defaultEditorialDNA);
    _setSlots(defaultSlots);
    setPerformanceEntries([]);
  }, []);

  const restoreAsset = useCallback((id: string) => {
    const entry = trashAssets.find((e) => e.item.id === id);
    if (entry) {
      setAssets((prev) => [entry.item, ...prev]);
      setTrashAssets((prev) => prev.filter((e) => e.item.id !== id));
    }
  }, [trashAssets]);

  const restorePack = useCallback((id: string) => {
    const entry = trashPacks.find((e) => e.item.id === id);
    if (entry) {
      setContentPacks((prev) => [entry.item, ...prev]);
      setTrashPacks((prev) => prev.filter((e) => e.item.id !== id));
    }
  }, [trashPacks]);

  const restorePost = useCallback((id: string) => {
    const entry = trashPosts.find((e) => e.item.id === id);
    if (entry) {
      setPosts((prev) => [entry.item, ...prev]);
      setTrashPosts((prev) => prev.filter((e) => e.item.id !== id));
    }
  }, [trashPosts]);

  const emptyTrash = useCallback(() => {
    setTrashAssets([]);
    setTrashPacks([]);
    setTrashPosts([]);
  }, []);

  return (
    <MediaContext.Provider
      value={{
        assets, addAsset, updateAsset, deleteAsset,
        contentPacks, addContentPack, updateContentPack, deleteContentPack,
        posts, addPost, updatePost, deletePost, reorderPosts,
        editorialDNA, setEditorialDNA,
        slots, setSlots,
        performanceEntries, addPerformanceEntry,
        resetMediaData,
        trashAssets, trashPacks, trashPosts,
        restoreAsset, restorePack, restorePost, emptyTrash,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}
