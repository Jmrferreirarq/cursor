@echo off
chcp 65001 >nul
echo.
echo ============================================
echo     FA-360 - Instalador Windows
echo     Repositório: Jmrferreirarq/Kimi
echo ============================================
echo.

:: Verificar se está na pasta correta
if not exist "package.json" (
    echo ❌ Erro: Não estás na pasta do projeto!
    echo    Certifica-te que extraste o ficheiro e estas na pasta "app"
    pause
    exit /b 1
)

echo ✅ Pasta do projeto confirmada
echo.

:: Criar .gitignore
echo 📝 A criar .gitignore...
(
echo # Dependencies
echo node_modules
echo .pnp
echo .pnp.js
echo.
echo # Build
echo dist
echo dist-ssr
echo *.local
echo.
echo # Environment
echo .env
echo .env.local
echo .env.*.local
echo.
echo # IDE
echo .vscode/*
echo !.vscode/extensions.json
echo .idea
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo pnpm-debug.log*
echo lerna-debug.log*
) > .gitignore
echo ✅ .gitignore criado
echo.

:: Inicializar Git
echo 🔧 A inicializar Git...
git init
git config user.email "ferreira@fa360.pt"
git config user.name "Ferreira Arquitetos"
echo ✅ Git inicializado
echo.

:: Adicionar ficheiros
echo ➕ A adicionar ficheiros...
git add .
echo ✅ Ficheiros adicionados
echo.

:: Commit
echo 💾 A fazer commit...
git commit -m "Initial commit: FA-360 Architecture Studio Platform"
echo ✅ Commit feito
echo.

:: Configurar remote
echo 🔗 A configurar remote...
git remote add origin https://github.com/Jmrferreirarq/Kimi.git 2>nul || git remote set-url origin https://github.com/Jmrferreirarq/Kimi.git
echo ✅ Remote configurado
echo.

:: Branch main
echo 🌿 A configurar branch main...
git branch -M main
echo ✅ Branch main configurada
echo.

echo ============================================
echo           ✅ SETUP COMPLETO!
echo ============================================
echo.
echo Próximo passo: FAZER PUSH
echo.
echo    👉  git push -u origin main
echo.
echo Se der erro de autenticação:
echo    1. Vai a https://github.com/settings/tokens
echo    2. Gera um token (classic)
echo    3. Usa o token como password
echo.
echo 📎 Repositório: https://github.com/Jmrferreirarq/Kimi
echo.
pause
