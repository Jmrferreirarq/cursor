import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function ConstructionDetailsPage() {
  // URL do ficheiro HTML externo - pode ser alterado para um URL remoto se necessário
  const htmlFileUrl = '/pormenores.html';
  
  const handleOpenInNewTab = () => {
    window.open(htmlFileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header minimalista */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-medium">Pormenores Construtivos</h1>
        </div>
        
        <button
          onClick={handleOpenInNewTab}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Abrir em nova janela</span>
        </button>
      </header>

      {/* Iframe que ocupa o resto do ecrã */}
      <div className="flex-1 relative">
        <iframe
          src={htmlFileUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="Pormenores Construtivos"
          loading="lazy"
        />
      </div>
    </div>
  );
}
