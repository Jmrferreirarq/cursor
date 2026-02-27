import json

data = json.load(open('fa360_import.json', encoding='utf-8'))
data_json = json.dumps(data, ensure_ascii=False)

html = (
    '<!DOCTYPE html>\n'
    '<html lang="pt">\n'
    '<head><meta charset="UTF-8"><title>FA360 - Importar Dados</title>\n'
    '<style>body{font-family:sans-serif;max-width:520px;margin:80px auto;text-align:center;color:#333}'
    '.btn{background:#0d9488;color:#fff;border:none;padding:14px 32px;font-size:16px;border-radius:8px;cursor:pointer;margin-top:20px}'
    '.btn:hover{background:#0f766e}.ok{color:#0d9488;font-size:18px;margin-top:20px}</style>\n'
    '</head>\n'
    '<body>\n'
    '<h2>FA360 \u2014 Importar Dados Excel</h2>\n'
    '<p>Clica no bot\u00e3o para carregar os dados do ficheiro FA_.xls na plataforma.</p>\n'
    '<p><strong>41 clientes &middot; 16 projetos &middot; 171 propostas &middot; 13 especialistas &middot; 8 licen\u00e7as &middot; 30 visitas</strong></p>\n'
    '<button class="btn" id="btn">Importar Dados</button>\n'
    '<div id="msg"></div>\n'
    '<script>\n'
    'const DATA = ' + data_json + ';\n'
    'document.getElementById("btn").addEventListener("click", function() {\n'
    '  localStorage.setItem("fa360_data", JSON.stringify(DATA));\n'
    '  document.getElementById("msg").innerHTML = "<p style=\'color:#0d9488;font-size:18px;margin-top:20px\'>Dados importados! A redirecionar...</p>";\n'
    '  setTimeout(function(){ window.location.href = "/"; }, 1500);\n'
    '});\n'
    '</script>\n'
    '</body></html>\n'
)

out = 'app/public/inject-data.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)
print('Criado:', out)
print('Tamanho:', round(len(html)/1024, 1), 'KB')
