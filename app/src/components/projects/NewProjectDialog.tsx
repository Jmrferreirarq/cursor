import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Project } from '@/types';
import type { Client } from '@/types';

const PHASES = [
  'Fase Comercial',
  'Estudo Prévio',
  'Anteprojeto',
  'Licenciamento',
  'Projeto Execução',
  'Assistência Obra',
  'Fecho',
];

const TEAM_OPTIONS = ['CEO', 'JÉSSICA', 'SOFIA'];

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (project: Project) => void;
  clients: Client[];
}

const initialForm = {
  name: '',
  clientId: '',
  status: 'lead' as Project['status'],
  phase: PHASES[0],
  startDate: new Date().toISOString().split('T')[0],
  deadline: '',
  budget: '',
  address: '',
  municipality: '',
  description: '',
  team: [] as string[],
};

export default function NewProjectDialog({
  open,
  onOpenChange,
  onSuccess,
  clients,
}: NewProjectDialogProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Nome do projeto é obrigatório';
    if (!form.clientId) newErrors.clientId = 'Seleciona um cliente';
    if (!form.deadline) newErrors.deadline = 'Prazo é obrigatório';
    const budgetNum = parseFloat(form.budget);
    if (!form.budget || isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.budget = 'Orçamento inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const client = clients.find((c) => c.id === form.clientId);
    if (!client) return;

    setIsSubmitting(true);
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: form.name.trim(),
      client: client.name,
      status: form.status,
      phase: form.phase,
      startDate: form.startDate,
      deadline: form.deadline,
      budget: parseFloat(form.budget),
      hoursLogged: 0,
      team: form.team.length > 0 ? form.team : ['CEO'],
      address: form.address.trim() || undefined,
      municipality: form.municipality.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    onSuccess(newProject);
    toast.success('Projeto criado com sucesso');
    setForm({ ...initialForm, startDate: new Date().toISOString().split('T')[0] });
    setErrors({});
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setForm({ ...initialForm, startDate: new Date().toISOString().split('T')[0] });
      setErrors({});
    }
    onOpenChange(next);
  };

  const toggleTeam = (member: string) => {
    setForm((p) => ({
      ...p,
      team: p.team.includes(member)
        ? p.team.filter((t) => t !== member)
        : [...p.team, member],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>
            Cria um novo projeto e associa-o a um cliente existente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Projeto *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Casa Douro, Escritório Central..."
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <select
                id="clientId"
                value={form.clientId}
                onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))}
                className={`w-full h-9 px-3 py-2 rounded-md border bg-transparent text-sm ${
                  errors.clientId ? 'border-destructive' : 'border-input'
                } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
              >
                <option value="">Seleciona um cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-xs text-destructive">{errors.clientId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value as Project['status'] }))
                  }
                  className="w-full h-9 px-3 py-2 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="lead">Lead</option>
                  <option value="negotiation">Negociação</option>
                  <option value="active">Ativo</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phase">Fase</Label>
                <select
                  id="phase"
                  value={form.phase}
                  onChange={(e) => setForm((p) => ({ ...p, phase: e.target.value }))}
                  className="w-full h-9 px-3 py-2 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {PHASES.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Prazo *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                  className={errors.deadline ? 'border-destructive' : ''}
                />
                {errors.deadline && (
                  <p className="text-xs text-destructive">{errors.deadline}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Orçamento (€) *</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={form.budget}
                onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                placeholder="45000"
                className={errors.budget ? 'border-destructive' : ''}
              />
              {errors.budget && (
                <p className="text-xs text-destructive">{errors.budget}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Morada</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Rua, número"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="municipality">Concelho</Label>
                <Input
                  id="municipality"
                  value={form.municipality}
                  onChange={(e) => setForm((p) => ({ ...p, municipality: e.target.value }))}
                  placeholder="Porto, Lisboa..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Equipa</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_OPTIONS.map((member) => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleTeam(member)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      form.team.includes(member)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Breve descrição do projeto (opcional)"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'A guardar...' : 'Criar Projeto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
