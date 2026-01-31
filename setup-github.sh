#!/bin/bash

# Script para configurar FA-360 no GitHub
# Correr na pasta do projeto

echo "=== FA-360 GitHub Setup ==="
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "Erro: Não estás na pasta do projeto!"
    echo "Por favor, corre este script na pasta onde está o package.json"
    exit 1
fi

# Criar .gitignore
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
EOF

# Inicializar Git
echo "2. A inicializar Git..."
git init

# Adicionar ficheiros
echo "3. A adicionar ficheiros..."
git add .

# Commit inicial
echo "4. A fazer primeiro commit..."
git commit -m "Initial commit: FA-360 Architecture Studio Platform"

# Perguntar pelo username do GitHub
echo ""
echo "=== Configurar GitHub Remote ==="
echo ""
read -p "Qual é o teu username do GitHub? " USERNAME
read -p "Qual é o nome do repositório? (default: fa360-platform) " REPO
REPO=${REPO:-fa360-platform}

# Adicionar remote
echo "5. A adicionar remote..."
git remote add origin "https://github.com/$USERNAME/$REPO.git"

# Renomear branch para main
echo "6. A configurar branch main..."
git branch -M main

echo ""
echo "=== Setup Completo! ==="
echo ""
echo "Para fazer push, corre:"
echo "  git push -u origin main"
echo ""
echo "Ou se já existe o repositório e queres forçar:"
echo "  git push -f origin main"
echo ""
echo "Verifica o estado com: git status"
