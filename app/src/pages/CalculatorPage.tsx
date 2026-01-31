import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowRightLeft, Ruler, Building2, Home, TrendingUp, Euro, RotateCcw } from 'lucide-react';

const calculators = [
  {
    id: 'honorarios',
    name: 'Calculadora de Honorários',
    description: 'Calcule honorários segundo tabela ICHPOP/OA',
    icon: Calculator,
  },
  {
    id: 'areas',
    name: 'Conversor de Áreas',
    description: 'Converta entre m², ft², ha, etc.',
    icon: Ruler,
  },
  {
    id: 'custo',
    name: 'Custo de Construção',
    description: 'Estime custos de construção por m²',
    icon: Building2,
  },
  {
    id: 'imovel',
    name: 'Avaliação Imobiliária',
    description: 'Calcule o valor de um imóvel',
    icon: Home,
  },
];

const constructionRates: Record<string, number> = {
  economica: 700,
  media: 1000,
  alta: 1500,
  luxo: 2200,
};

const locationRates: Record<string, number> = {
  lisboa: 4500,
  porto: 3800,
  algarve: 4200,
  coimbra: 2800,
  braga: 2600,
  interior: 1800,
};

const typeMultipliers: Record<string, number> = {
  apartamento: 1,
  moradia: 1.15,
  loja: 1.3,
  escritorio: 1.25,
};

export default function CalculatorPage() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // Honorários Calculator State
  const [area, setArea] = useState('');
  const [projectType, setProjectType] = useState('habitacao');
  const [complexity, setComplexity] = useState('normal');

  // Áreas Calculator State
  const [areaValue, setAreaValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m2');
  const [toUnit, setToUnit] = useState('ft2');

  // Custo de Construção State
  const [custoArea, setCustoArea] = useState('');
  const [custoTipo, setCustoTipo] = useState('media');

  // Avaliação Imobiliária State
  const [imovelArea, setImovelArea] = useState('');
  const [imovelLocal, setImovelLocal] = useState('lisboa');
  const [imovelTipo, setImovelTipo] = useState('apartamento');

  const calculateHonorarios = () => {
    const areaNum = parseFloat(area) || 0;
    const baseRate = projectType === 'habitacao' ? 25 : projectType === 'comercio' ? 35 : 30;
    const complexityMultiplier = complexity === 'alta' ? 1.3 : complexity === 'baixa' ? 0.8 : 1;
    return areaNum * baseRate * complexityMultiplier;
  };

  const convertArea = () => {
    const value = parseFloat(areaValue) || 0;
    const conversions: Record<string, Record<string, number>> = {
      m2: { m2: 1, ft2: 10.7639, ha: 0.0001, ac: 0.000247 },
      ft2: { m2: 0.092903, ft2: 1, ha: 0.00000929, ac: 0.00002296 },
      ha: { m2: 10000, ft2: 107639, ha: 1, ac: 2.47105 },
      ac: { m2: 4046.86, ft2: 43560, ha: 0.404686, ac: 1 },
    };
    return value * (conversions[fromUnit]?.[toUnit] || 1);
  };

  const calculateCusto = () => {
    const areaNum = parseFloat(custoArea) || 0;
    const rate = constructionRates[custoTipo] || 1000;
    return areaNum * rate;
  };

  const calculateImovel = () => {
    const areaNum = parseFloat(imovelArea) || 0;
    const locationRate = locationRates[imovelLocal] || 3000;
    const typeMult = typeMultipliers[imovelTipo] || 1;
    return areaNum * locationRate * typeMult;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const resetCalculator = () => {
    setActiveCalculator(null);
    setArea('');
    setProjectType('habitacao');
    setComplexity('normal');
    setAreaValue('');
    setFromUnit('m2');
    setToUnit('ft2');
    setCustoArea('');
    setCustoTipo('media');
    setImovelArea('');
    setImovelLocal('lisboa');
    setImovelTipo('apartamento');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calculator className="w-4 h-4" />
            <span className="text-sm">Ferramentas de Cálculo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Calculadoras</h1>
        </div>
        {activeCalculator && (
          <button
            onClick={resetCalculator}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors w-fit"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        )}
      </motion.div>

      {/* Calculator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculators.map((calc, index) => (
          <motion.button
            key={calc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveCalculator(calc.id)}
            className={`p-5 bg-card border rounded-xl text-left transition-all ${
              activeCalculator === calc.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <calc.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{calc.name}</h3>
                <p className="text-sm text-muted-foreground">{calc.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Calculator Forms */}
      <AnimatePresence mode="wait">
        {activeCalculator === 'honorarios' && (
          <motion.div
            key="honorarios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Calculadora de Honorários</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Área (m²) *</label>
                <input
                  type="number"
                  min="0"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Ex: 150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Projeto</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="habitacao">Habitação (25€/m²)</option>
                  <option value="comercio">Comércio (35€/m²)</option>
                  <option value="industria">Indústria (30€/m²)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Complexidade</label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="baixa">Baixa (x0.8)</option>
                  <option value="normal">Normal (x1.0)</option>
                  <option value="alta">Alta (x1.3)</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Euro className="w-4 h-4" />
                <span className="text-sm">Honorários Estimados</span>
              </div>
              <p className="text-4xl font-bold text-primary">{formatCurrency(calculateHonorarios())}</p>
              <p className="text-xs text-muted-foreground mt-2">
                * Valor estimado sem IVA. Preço final sujeito a avaliação do projeto.
              </p>
            </div>
          </motion.div>
        )}

        {activeCalculator === 'areas' && (
          <motion.div
            key="areas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Conversor de Áreas</h3>
            <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-2">Valor *</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Ex: 100"
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-sm font-medium mb-2">De</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="m2">m²</option>
                  <option value="ft2">ft²</option>
                  <option value="ha">ha</option>
                  <option value="ac">ac</option>
                </select>
              </div>
              <div className="flex items-center justify-center pb-3">
                <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-sm font-medium mb-2">Para</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="m2">m²</option>
                  <option value="ft2">ft²</option>
                  <option value="ha">ha</option>
                  <option value="ac">ac</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Ruler className="w-4 h-4" />
                <span className="text-sm">Resultado</span>
              </div>
              <p className="text-4xl font-bold text-primary">
                {convertArea().toLocaleString('pt-PT', { maximumFractionDigits: 4 })} <span className="text-2xl">{toUnit}</span>
              </p>
            </div>
          </motion.div>
        )}

        {activeCalculator === 'custo' && (
          <motion.div
            key="custo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Custo de Construção</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Área (m²) *</label>
                <input
                  type="number"
                  min="0"
                  value={custoArea}
                  onChange={(e) => setCustoArea(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Ex: 200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Construção</label>
                <select
                  value={custoTipo}
                  onChange={(e) => setCustoTipo(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="economica">Económica (700€/m²)</option>
                  <option value="media">Média (1.000€/m²)</option>
                  <option value="alta">Alta Qualidade (1.500€/m²)</option>
                  <option value="luxo">Luxo (2.200€/m²)</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Custo Estimado de Construção</span>
              </div>
              <p className="text-4xl font-bold text-primary">
                {custoArea ? formatCurrency(calculateCusto()) : '---'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                * Valor aproximado para referência. Custo real pode variar conforme especificações.
              </p>
            </div>
          </motion.div>
        )}

        {activeCalculator === 'imovel' && (
          <motion.div
            key="imovel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Avaliação Imobiliária</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Área (m²) *</label>
                <input
                  type="number"
                  min="0"
                  value={imovelArea}
                  onChange={(e) => setImovelArea(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Ex: 120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Localização</label>
                <select
                  value={imovelLocal}
                  onChange={(e) => setImovelLocal(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="lisboa">Lisboa (4.500€/m²)</option>
                  <option value="porto">Porto (3.800€/m²)</option>
                  <option value="algarve">Algarve (4.200€/m²)</option>
                  <option value="coimbra">Coimbra (2.800€/m²)</option>
                  <option value="braga">Braga (2.600€/m²)</option>
                  <option value="interior">Interior (1.800€/m²)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={imovelTipo}
                  onChange={(e) => setImovelTipo(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="apartamento">Apartamento (x1.0)</option>
                  <option value="moradia">Moradia (x1.15)</option>
                  <option value="loja">Loja (x1.3)</option>
                  <option value="escritorio">Escritório (x1.25)</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Valor Estimado do Imóvel</span>
              </div>
              <p className="text-4xl font-bold text-primary">
                {imovelArea ? formatCurrency(calculateImovel()) : '---'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                * Valor de mercado estimado. Para avaliação oficial, consulte um avaliador credenciado.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeCalculator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Selecione uma calculadora acima para começar</p>
        </motion.div>
      )}
    </div>
  );
}
