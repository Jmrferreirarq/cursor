#!/bin/bash

# Script para fazer push do FA-360 para o GitHub
# Repositório: https://github.com/Jmrferreirarq/Kimi.git

echo "=== FA-360 GitHub Push Script ==="
echo ""
echo "Repositório destino: https://github.com/Jmrferreirarq/Kimi.git"
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Não estás na pasta do projeto!"
    echo "Por favor, corre este script na pasta 'app' onde está o package.json"
    exit 1
fi

echo "✅ Pasta do projeto confirmada"
echo ""

# Criar .gitignore se não existir
if [ ! -f ".gitignore" ]; then
    echo "1. A criar .gitignore..."
    cat > .gitignore << 'EOF'
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
EOF
    echo "✅ .gitignore criado"
else
    echo "✅ .gitignore já existe"
fi
echo ""

# Inicializar Git
echo "2. A inicializar Git..."
git init
echo "✅ Git inicializado"
echo ""

# Configurar utilizador
echo "3. A configurar utilizador Git..."
git config user.email "ferreira@fa360.pt"
git config user.name "Ferreira Arquitetos"
echo "✅ Utilizador configurado"
echo ""

# Adicionar ficheiros
echo "4. A adicionar ficheiros ao Git..."
git add .
echo "✅ Ficheiros adicionados"
echo ""

# Fazer commit
echo "5. A fazer commit..."
git commit -m "Initial commit: FA-360 Architecture Studio Platform - Complete platform with Dashboard, Proposals, Calculator, and more"
echo "✅ Commit feito"
echo ""

# Configurar remote
echo "6. A configurar remote para https://github.com/Jmrferreirarq/Kimi.git..."
git remote add origin https://github.com/Jmrferreirarq/Kimi.git 2>/dev/null || git remote set-url origin https://github.com/Jmrferreirarq/Kimi.git
echo "✅ Remote configurado"
echo ""

# Renomear branch para main
echo "7. A configurar branch main..."
git branch -M main
echo "✅ Branch configurada"
echo ""

echo "=== Setup Completo! ==="
echo ""
echo "Para fazer push para o GitHub, corre:"
echo ""
echo "  git push -u origin main"
echo ""
echo "Se der erro de autenticação, usa:"
echo "  git push -u origin main --force"
echo ""
echo "Ou configura token de acesso pessoal:"
echo "  git remote set-url origin https://TOKEN@github.com/Jmrferreirarq/Kimi.git"
echo ""
echo "📎 Repositório: https://github.com/Jmrferreirarq/Kimi"
