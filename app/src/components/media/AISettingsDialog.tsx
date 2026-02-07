import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getApiKey, setApiKey, removeApiKey, hasApiKey } from '@/services/ai';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AISettingsDialog({ open, onClose }: Props) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    if (open) {
      const existing = getApiKey();
      setConfigured(hasApiKey());
      setKey(existing || '');
    }
  }, [open]);

  const handleSave = () => {
    if (!key.trim().startsWith('sk-')) {
      toast.error('A chave deve começar com "sk-"');
      return;
    }
    setApiKey(key.trim());
    setConfigured(true);
    toast.success('API key guardada. O AI Copilot está ativo!');
    onClose();
  };

  const handleRemove = () => {
    removeApiKey();
    setKey('');
    setConfigured(false);
    toast.success('API key removida');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Copilot</h2>
                <p className="text-xs text-muted-foreground">Configuração do OpenAI GPT-4 Vision</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${configured ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
              {configured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium">{configured ? 'AI Copilot ativo' : 'AI Copilot inativo'}</p>
                <p className="text-xs text-muted-foreground">
                  {configured
                    ? 'Ao fazer upload, a AI analisa automaticamente e gera conteúdo para todos os canais.'
                    : 'Adiciona a tua API key da OpenAI para ativar a análise automática.'}
                </p>
              </div>
            </div>

            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full pl-10 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-mono"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Obtém a tua key em{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  platform.openai.com/api-keys
                </a>
                . A key fica guardada apenas no teu browser.
              </p>
            </div>

            {/* What AI does */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-sm font-medium mb-2">O que o AI Copilot faz automaticamente:</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Analisa a imagem e detecta elementos visuais</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Gera tags relevantes automaticamente</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Atribui score de qualidade (0-100)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Detecta riscos (rostos, moradas, marcas)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Gera copy PT + EN para 7 canais (IG, LinkedIn, TikTok, etc.)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Sugere hashtags e CTA otimizados</li>
              </ul>
              <p className="text-[10px] text-muted-foreground mt-3">Custo estimado: ~$0.01-0.03 por imagem analisada (GPT-4o)</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <div>
              {configured && (
                <button onClick={handleRemove} className="flex items-center gap-2 px-4 py-2.5 text-destructive border border-destructive/30 rounded-xl text-sm font-medium hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Remover Key
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors text-sm">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={!key.trim()} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
