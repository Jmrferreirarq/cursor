/**
 * Detects which active projects are affected by recently changed legislation.
 * Cross-references project typologies with diplomas flagged as altered/new.
 */

import { legislacao } from '@/data/legislacao';
import { TIPOLOGIA_DIPLOMAS } from '@/data/tipologias';
import { mapProjectTypeToTipologia } from './checklistAutoCreate';
import type { Project } from '@/types';

export interface LegislationAlert {
  projectId: string;
  projectName: string;
  diplomaId: string;
  diplomaSigla: string;
  diplomaTitulo: string;
  tipo: 'alterado_2024' | 'novo_2024' | 'novo_2025';
}

const changedDiplomas = legislacao.filter((d) => d.novidade);

export function getLegislationAlerts(projects: Project[]): LegislationAlert[] {
  const alerts: LegislationAlert[] = [];
  const activeProjects = projects.filter((p) =>
    ['active', 'lead', 'negotiation'].includes(p.status)
  );

  for (const proj of activeProjects) {
    const tipId = mapProjectTypeToTipologia(proj.projectType || '');
    if (!tipId) continue;

    const tipDiplomas = TIPOLOGIA_DIPLOMAS[tipId];
    if (!tipDiplomas) continue;

    const diplomaIds = new Set(tipDiplomas.map((td) => td.diplomaId));

    for (const changed of changedDiplomas) {
      if (!diplomaIds.has(changed.id)) continue;

      const tipo = changed.novidade!;

      alerts.push({
        projectId: proj.id,
        projectName: proj.name,
        diplomaId: changed.id,
        diplomaSigla: changed.sigla,
        diplomaTitulo: changed.titulo,
        tipo,
      });
    }
  }

  return alerts;
}
