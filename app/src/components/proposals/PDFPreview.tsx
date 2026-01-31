import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer, FileText, Calendar, User, MapPin, Euro, CheckCircle } from 'lucide-react';

interface ProposalPhase {
  id: string;
  name: string;
  description: string;
  value: number;
  selected: boolean;
}

interface ClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
  municipality: string;
}

interface PDFPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: ClientData;
  projectType: string;
  projectTypeLabel: string;
  phases: ProposalPhase[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  proposalNumber: string;
  proposalDate: string;
  validUntil: string;
}

export default function PDFPreview({
  isOpen,
  onClose,
  clientData,
  projectType,
  projectTypeLabel,
  phases,
  subtotal,
  vatRate,
  vatAmount,
  total,
  proposalNumber,
  proposalDate,
  validUntil,
}: PDFPreviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDownload = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-medium text-gray-900">Pré-visualização da Proposta</span>
            <span className="text-sm text-gray-500">{proposalNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Content - White background for print */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none">
            {/* Header */}
            <div className="p-12 border-b-2 border-primary">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">FERREIRA</h1>
                  <p className="text-lg text-gray-600">ARQUITETOS</p>
                  <p className="text-sm text-gray-500 mt-2">Arquitetura • Design • Construção</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">PROPOSTA</p>
                  <p className="text-sm text-gray-500 mt-1">Nº {proposalNumber}</p>
                  <p className="text-sm text-gray-500">Data: {formatDate(proposalDate)}</p>
                  <p className="text-sm text-gray-500">Válida até: {formatDate(validUntil)}</p>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-12 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Cliente
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{clientData.name || 'Nome do Cliente'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>{clientData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>{clientData.phone}</span>
                  </div>
                </div>
                <div>
                  {clientData.address && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div>
                        <p>{clientData.address}</p>
                        {clientData.municipality && <p>{clientData.municipality}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-12 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Projeto
              </h2>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium text-gray-900">{projectTypeLabel}</span>
              </div>
            </div>

            {/* Phases Table */}
            <div className="p-12">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Fases e Serviços
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Fase</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">Descrição</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {phases.map((phase) => (
                    <tr key={phase.id} className="border-b border-gray-100">
                      <td className="py-4 font-medium text-gray-900">{phase.name}</td>
                      <td className="py-4 text-gray-600">{phase.description}</td>
                      <td className="py-4 text-right font-medium">{formatCurrency(phase.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-12 bg-gray-50 border-t border-gray-200">
              <div className="w-80 ml-auto space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA ({vatRate}%)</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="p-12 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Condições
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Pagamento de 30% na assinatura do contrato</p>
                <p>• Pagamento de 40% na aprovação do Anteprojeto</p>
                <p>• Pagamento de 30% na entrega do Projeto de Execução</p>
                <p>• Prazo de execução conforme cronograma acordado</p>
                <p>• Esta proposta é válida por 30 dias</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-12 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Ferreira Arquitetos, Lda</p>
                  <p>NIF: 123456789</p>
                  <p>geral@fa360.pt | +351 220 000 000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Documento gerado em {formatDate(proposalDate)}</p>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="p-12 border-t border-gray-200 print:break-inside-avoid">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-8">Pelo Cliente:</p>
                  <div className="border-b border-gray-300 pb-2 mb-2">
                    <p className="text-gray-400 text-sm">Assinatura</p>
                  </div>
                  <p className="text-sm text-gray-600">{clientData.name}</p>
                  <p className="text-xs text-gray-400 mt-1">Data: ___/___/_____</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-8">Pelo Arquiteto:</p>
                  <div className="border-b border-gray-300 pb-2 mb-2">
                    <p className="text-gray-400 text-sm">Assinatura e Carimbo</p>
                  </div>
                  <p className="text-sm text-gray-600">Ferreira Arquitetos</p>
                  <p className="text-xs text-gray-400 mt-1">Data: ___/___/_____</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed, .fixed * {
            visibility: visible;
          }
          .fixed {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: white;
            overflow: visible;
          }
          .bg-gray-100 {
            background: white !important;
            padding: 0 !important;
          }
          .bg-white {
            box-shadow: none !important;
            max-width: none !important;
          }
          .overflow-y-auto {
            overflow: visible !important;
          }
          button, .bg-gray-50 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
