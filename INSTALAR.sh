#!/bin/bash

# ============================================
# FA-360 INSTALAÇÃO COMPLETA
# Para: https://github.com/Jmrferreirarq/Kimi
# ============================================

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           FA-360 Architecture Studio - Setup                  ║"
echo "║              Repositório: Jmrferreirarq/Kimi                  ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# PASSO 1: Extrair
echo "📦 PASSO 1: A extrair ficheiros..."
if [ -f "FA360-FOR-JMRFERREIRARQ.tar.gz" ]; then
    tar -xzvf FA360-FOR-JMRFERREIRARQ.tar.gz
    echo "✅ Extração completa"
else
    echo "❌ Erro: Ficheiro FA360-FOR-JMRFERREIRARQ.tar.gz não encontrado"
    echo "   Certifica-te que o ficheiro está na mesma pasta"
    exit 1
fi
echo ""

# PASSO 2: Entrar na pasta
echo "📂 PASSO 2: A entrar na pasta 'app'..."
cd app || { echo "❌ Erro: Pasta 'app' não encontrada"; exit 1; }
echo "✅ Dentro da pasta app"
echo ""

# PASSO 3: Criar .gitignore
echo "📝 PASSO 3: A criar .gitignore..."
cat > .gitignore << 'GITIGNORE'
# Dependencies
node_modules
.pnp
.pnp.js

# Build
dist
dist-ssr
*.local

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/*
!.vscode/extensions.json
.idea

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Cache
.cache
.temp
.tmp
GITIGNORE
echo "✅ .gitignore criado"
echo ""

# PASSO 4: Inicializar Git
echo "🔧 PASSO 4: A inicializar Git..."
git init
git config user.email "ferreira@fa360.pt"
git config user.name "Ferreira Arquitetos"
echo "✅ Git inicializado"
echo ""

# PASSO 5: Adicionar ficheiros
echo "➕ PASSO 5: A adicionar ficheiros ao Git..."
git add .
echo "✅ Ficheiros adicionados"
echo ""

# PASSO 6: Commit
echo "💾 PASSO 6: A fazer commit..."
git commit -m "Initial commit: FA-360 Architecture Studio Platform"
echo "✅ Commit feito"
echo ""

# PASSO 7: Configurar remote
echo "🔗 PASSO 7: A configurar remote..."
git remote add origin https://github.com/Jmrferreirarq/Kimi.git 2>/dev/null || git remote set-url origin https://github.com/Jmrferreirarq/Kimi.git
echo "✅ Remote configurado: https://github.com/Jmrferreirarq/Kimi.git"
echo ""

# PASSO 8: Branch main
echo "🌿 PASSO 8: A configurar branch main..."
git branch -M main
echo "✅ Branch main configurada"
echo ""

# ============================================
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETO!                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Próximo passo: FAZER PUSH"
echo ""
echo "  👉  git push -u origin main"
echo ""
echo "Se pedir credenciais, usa:"
echo "  • Username: Jmrferreirarq"
echo "  • Password: Token de acesso pessoal (GitHub Settings > Developer settings)"
echo ""
echo "Ou configura token permanente:"
echo "  git remote set-url origin https://TOKEN@github.com/Jmrferreirarq/Kimi.git"
echo ""
echo "📎 Repositório: https://github.com/Jmrferreirarq/Kimi"
echo ""
