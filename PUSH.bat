@echo off
chcp 65001 >nul
echo.
echo ============================================
echo     FA-360 - Push para GitHub
echo ============================================
echo.

:: Verificar se está na pasta correta
if not exist "package.json" (
    echo ❌ Erro: Não estás na pasta "app"!
    echo    Certifica-te que estas na pasta correta
    pause
    exit /b 1
)

echo ✅ Pasta confirmada: %cd%
echo.

:: Verificar estado do git
echo 📊 Estado do Git:
git status --short
echo.

:: Verificar remote
echo 🔗 Remote configurado:
git remote -v
echo.

:: Perguntar se quer fazer push
set /p RESPOSTA="Queres fazer push para o GitHub? (s/n): "

if /i "%RESPOSTA%"=="s" (
    echo.
    echo 🚀 A fazer push...
    echo.
    
    git push -u origin main
    
    if %errorlevel% == 0 (
        echo.
        echo ============================================
        echo           ✅ PUSH BEM-SUCEDIDO!
        echo ============================================
        echo.
        echo 📎 Verifica em: https://github.com/Jmrferreirarq/Kimi
        echo.
    ) else (
        echo.
        echo ⚠️ Push falhou.
        echo.
        set /p FORCE="Queres tentar com force? (s/n): "
        if /i "%FORCE%"=="s" (
            git push -f origin main
            echo.
            echo ============================================
            echo        ✅ FORCE PUSH CONCLUÍDO!
            echo ============================================
            echo.
            echo 📎 Verifica em: https://github.com/Jmrferreirarq/Kimi
            echo.
        )
    )
) else (
    echo Push cancelado.
)

pause
