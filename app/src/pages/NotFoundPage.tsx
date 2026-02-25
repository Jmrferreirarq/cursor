import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-8xl font-bold text-muted-foreground/20">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Página não encontrada</h1>
          <p className="text-muted-foreground max-w-md">
            A página que procuras não existe ou foi movida.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
