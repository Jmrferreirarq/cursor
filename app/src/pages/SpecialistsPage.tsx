import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, X, Phone, Mail, Euro, FileText } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { Specialist } from '@/types';

const SPECIALTIES = [
  'Estabilidade',
  'Térmica',
  'Acústica',
  'Térmica + Acústica',
  'ITED + Electrotécnica',
  'Águas + Gás',
  'AVAC',
  'SCIE',
  'Certificado energético',
  'PSS',
  'Coletores',
  'Outro',
];

const emptyForm = (): Omit<Specialist, 'id'> => ({
  name: '',
  specialty: '',
  phone: '',
  email: '',
  priceUpTo300m2: '',
  fees: '',
  notes: '',
});

export default function SpecialistsPage() {
  const { specialists, addSpecialist, updateSpecialist, deleteSpecialist } = useData();
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return specialists.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.specialty.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || '';
      const matchSpecialty = !filterSpecialty || s.specialty === filterSpecialty;
      return matchSearch && matchSpecialty;
    });
  }, [specialists, search, filterSpecialty]);

  const specialtiesInUse = useMemo(() => {
    const set = new Set(specialists.map((s) => s.specialty));
    return SPECIALTIES.filter((s) => set.has(s)).concat(
      [...set].filter((s) => !SPECIALTIES.includes(s))
    );
  }, [specialists]);

  function openAdd() {
    setEditId(null);
    setForm(emptyForm());
    setShowModal(true);
  }

  function openEdit(s: Specialist) {
    setEditId(s.id);
    setForm({
      name: s.name,
      specialty: s.specialty,
      phone: s.phone || '',
      email: s.email || '',
      priceUpTo300m2: s.priceUpTo300m2 || '',
      fees: s.fees || '',
      notes: s.notes || '',
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.specialty.trim()) return;
    if (editId) {
      updateSpecialist(editId, form);
    } else {
      const id = `spec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      addSpecialist({ id, ...form });
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteSpecialist(id);
    setDeleteConfirm(null);
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Especialistas</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {specialists.length} consultor{specialists.length !== 1 ? 'es' : ''} registado{specialists.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo Especialista
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar por nome, especialidade, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[180px]"
          >
            <option value="">Todas as especialidades</option>
            {specialtiesInUse.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {specialists.length === 0 ? 'Nenhum especialista registado.' : 'Nenhum resultado encontrado.'}
            </p>
            {specialists.length === 0 && (
              <button onClick={openAdd} className="mt-4 text-sm text-primary hover:underline">
                Adicionar primeiro especialista
              </button>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Especialidade</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Contacto</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Preço até 300m²</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Taxas/Notas</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {s.specialty}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-col gap-0.5">
                          {s.phone && (
                            <a href={`tel:${s.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                              <Phone className="w-3.5 h-3.5" />
                              {s.phone}
                            </a>
                          )}
                          {s.email && (
                            <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px]">
                              <Mail className="w-3.5 h-3.5" />
                              {s.email}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {s.priceUpTo300m2 ? (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                            <Euro className="w-3.5 h-3.5" />
                            {s.priceUpTo300m2}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground max-w-[200px] truncate">
                        {s.fees || s.notes || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(s.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-popover border border-border rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold">{editId ? 'Editar Especialista' : 'Novo Especialista'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Nome <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex: Bruno Madureira"
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Especialidade <span className="text-destructive">*</span></label>
                    <select
                      value={form.specialty}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Selecionar...</option>
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Telefone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="9XX XXX XXX"
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@exemplo.com"
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Preço até 300m²</label>
                    <input
                      type="text"
                      value={form.priceUpTo300m2}
                      onChange={(e) => setForm({ ...form, priceUpTo300m2: e.target.value })}
                      placeholder="Ex: 300 €"
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Taxas / Notas de preço</label>
                    <input
                      type="text"
                      value={form.fees}
                      onChange={(e) => setForm({ ...form, fees: e.target.value })}
                      placeholder="Ex: ADRA - coletores"
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Notas</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Observações adicionais..."
                      rows={3}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.specialty.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editId ? 'Guardar' : 'Adicionar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-popover border border-border rounded-xl shadow-xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">Eliminar Especialista</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-sm">
                Tem a certeza que quer eliminar este especialista? Esta ação não pode ser revertida.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
