import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Mail, Phone, MapPin, FileText, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ClientDetailsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">J</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">João Silva</h1>
            <p className="text-muted-foreground">Cliente desde 10/01/2024</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-muted rounded text-xs">NIF: 123456789</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">joao.silva@email.pt</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">+351 912 345 678</p>
            </div>
          </div>
          <div className="md:col-span-2 flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Morada</p>
              <p className="font-medium">Rua do Douro, 123, Porto</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Projetos</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <FolderKanban className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Casa Douro</p>
                <p className="text-sm text-muted-foreground">Projeto Execução</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-medium">
              Ativo
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
