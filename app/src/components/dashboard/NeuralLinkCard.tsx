import React, { useRef, useState } from 'react';
import { Database, FileDown, FileUp, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import KPICard from './KPICard';
import { useData } from '@/context/DataContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface NeuralLinkCardProps {
  delay?: number;
}

export default function NeuralLinkCard({ delay = 0 }: NeuralLinkCardProps) {
  const { exportToFile, importFromFile, resetAllData } = useData();

  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = async () => {
    setSyncing(true);
    const ok = await resetAllData();
    setSyncing(false);
    if (ok) toast.success('Dados zerados');
    else toast.error('Erro ao zerar.');
  };

  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setSyncing(true);
    const result = await importFromFile(file);
    setSyncing(false);
    if (result.ok) toast.success('Dados importados');
    else toast.error(result.error || 'Erro ao importar.');
  };

  return (
    <KPICard title="Backup de Dados" icon={Database} delay={delay}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-success/20">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-lg font-semibold text-success">Guardado</p>
            <p className="text-xs text-muted-foreground">
              Dados guardados automaticamente no browser
            </p>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Exporta para ficheiro JSON e guarda onde quiseres (Desktop, Drive, etc.). 
            Importa quando precisares de restaurar.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportChange}
          />
          <button
            onClick={exportToFile}
            disabled={syncing}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-muted hover:bg-muted/80 border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            title="Descarregar cópia dos dados (ficheiro JSON)"
          >
            <FileDown className="w-4 h-4 shrink-0" />
            Exportar
          </button>
          <button
            onClick={handleImportClick}
            disabled={syncing}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-muted hover:bg-muted/80 border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            title="Importar dados de um ficheiro JSON"
          >
            <FileUp className="w-4 h-4 shrink-0" />
            Importar
          </button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={syncing}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              title="Zerar todos os dados"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              Zerar Tudo
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Zerar todos os dados?</AlertDialogTitle>
              <AlertDialogDescription>
                Isto vai apagar todos os clientes, projetos e propostas da plataforma.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </KPICard>
  );
}
