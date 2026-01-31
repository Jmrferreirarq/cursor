#!/bin/bash

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║              FA-360 - Push para GitHub                        ║"
echo "║         https://github.com/Jmrferreirarq/Kimi                 ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se estamos na pasta app
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Não estás na pasta 'app'!"
    echo "   Corre primeiro: cd app"
    exit 1
fi

echo "✅ Pasta confirmada: $(pwd)"
echo ""

# Verificar estado do git
echo "📊 Estado do Git:"
git status --short
echo ""

# Verificar remote
echo "🔗 Remote configurado:"
git remote -v
echo ""

# Perguntar se quer fazer push
read -p "Queres fazer push para o GitHub? (s/n): " RESPOSTA

if [ "$RESPOSTA" = "s" ] || [ "$RESPOSTA" = "S" ]; then
    echo ""
    echo "🚀 A fazer push..."
    echo ""
    
    # Tentar push normal
    if git push -u origin main; then
        echo ""
        echo "╔═══════════════════════════════════════════════════════════════╗"
        echo "║              ✅ PUSH BEM-SUCEDIDO!                            ║"
        echo "╚═══════════════════════════════════════════════════════════════╝"
        echo ""
        echo "📎 Verifica em: https://github.com/Jmrferreirarq/Kimi"
        echo ""
    else
        echo ""
        echo "⚠️  Push falhou. Tentando com force..."
        echo ""
        
        read -p "Queres forçar o push? (s/n): " FORCE
        if [ "$FORCE" = "s" ] || [ "$FORCE" = "S" ]; then
            git push -f origin main
            echo ""
            echo "╔═══════════════════════════════════════════════════════════════╗"
            echo "║              ✅ FORCE PUSH CONCLUÍDO!                         ║"
            echo "╚═══════════════════════════════════════════════════════════════╝"
            echo ""
            echo "📎 Verifica em: https://github.com/Jmrferreirarq/Kimi"
            echo ""
        else
            echo "Push cancelado."
        fi
    fi
else
    echo "Push cancelado."
fi
