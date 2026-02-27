# Guia: Ligar FA-360 ao GitHub

## Opção 1: Criar Novo Repositório (Recomendado)

### Passo 1: Preparar o Projeto

```bash
# Entrar na pasta do projeto
cd /mnt/okcomputer/output/app

# Criar ficheiro .gitignore
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
```

### Passo 2: Inicializar Git

```bash
# Inicializar repositório Git
git init

# Adicionar todos os ficheiros
git add .

# Primeiro commit
git commit -m "Initial commit: FA-360 Architecture Studio Platform"
```

### Passo 3: Criar Repositório no GitHub

1. Acede a https://github.com/new
2. Nome do repositório: `fa360-platform` (ou outro nome)
3. Descrição: "Plataforma de gestão para escritórios de arquitetura"
4. Escolhe: **Public** ou **Private**
5. **NÃO** inicializar com README (já temos)
6. Clica em **Create repository**

### Passo 4: Ligar e Fazer Push

```bash
# Adicionar remote (substituir USERNAME pelo teu username)
git remote add origin https://github.com/USERNAME/fa360-platform.git

# Fazer push
git branch -M main
git push -u origin main
```

---

## Opção 2: Usar Repositório Existente

Se já tens o repositório original do FA-360:

```bash
# Entrar na pasta do projeto
cd /mnt/okcomputer/output/app

# Inicializar Git
git init

# Adicionar remote do teu fork/reposiório existente
git remote add origin https://github.com/USERNAME/Workspace-FA-360.git

# Ou se já existe remote, atualizar:
git remote set-url origin https://github.com/USERNAME/Workspace-FA-360.git

# Adicionar ficheiros e fazer commit
git add .
git commit -m "Update: Complete platform rebuild with new features"

# Fazer push (forçar se necessário)
git push -f origin main
```

---

## Configurar Deploy Automático (Vercel/Netlify)

### Vercel (Recomendado)

1. Acede a https://vercel.com/new
2. Importa o repositório do GitHub
3. Configurações:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clica em **Deploy**

### Netlify

1. Acede a https://app.netlify.com/start
2. Conecta com GitHub
3. Seleciona o repositório
4. Configurações:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Clica em **Deploy site**

---

## Comandos Úteis

```bash
# Ver estado do git
git status

# Ver remotos configurados
git remote -v

# Adicionar ficheiros específicos
git add src/components/proposals/PDFPreview.tsx

# Fazer commit com mensagem
git commit -m "Fix: PDF preview improvements"

# Fazer push
git push origin main

# Atualizar projeto local
git pull origin main
```

---

## Estrutura do Projeto

```
fa360-platform/
├── src/
│   ├── components/     # Componentes React
│   ├── context/        # Contextos (Theme, Language, Time)
│   ├── data/           # Dados (RJUE tasks)
│   ├── pages/          # 17 páginas
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilitários
│   └── types/          # TypeScript types
├── public/             # Ficheiros estáticos
├── dist/               # Build output
├── package.json        # Dependências
└── README.md           # Documentação
```

---

## Dependências Principais

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "framer-motion": "^11.x",
  "recharts": "^2.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x",
  "sonner": "^1.x"
}
```

---

## Links Úteis

- GitHub: https://github.com
- Vercel: https://vercel.com
- Netlify: https://netlify.com
- Documentação React: https://react.dev
- Documentação Vite: https://vitejs.dev
