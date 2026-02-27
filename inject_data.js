const { chromium } = require('C:\\Users\\José Ferreira\\.agents\\skills\\playwright\\node_modules\\playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'http://localhost:5173';
const JSON_PATH = 'C:\\Users\\José Ferreira\\.verdent\\verdent-projects\\Ferreirarquitetos\\fa360_import.json';

(async () => {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 15000 });

  await page.evaluate((payload) => {
    localStorage.setItem('fa360_data', JSON.stringify(payload));
  }, data);

  console.log('Dados injetados no localStorage com sucesso.');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const counts = await page.evaluate(() => {
    try {
      const d = JSON.parse(localStorage.getItem('fa360_data') || '{}');
      return {
        clients: d.clients?.length || 0,
        projects: d.projects?.length || 0,
        proposals: d.proposals?.length || 0,
        specialists: d.specialists?.length || 0,
        licenses: d.licenses?.length || 0,
        constructionVisits: d.constructionVisits?.length || 0,
      };
    } catch { return null; }
  });

  console.log('\nDados na plataforma:');
  console.log('  Clientes:       ' + counts.clients);
  console.log('  Projetos:       ' + counts.projects);
  console.log('  Propostas:      ' + counts.proposals);
  console.log('  Especialistas:  ' + counts.specialists);
  console.log('  Licencas:       ' + counts.licenses);
  console.log('  Visitas obra:   ' + counts.constructionVisits);
  console.log('\nPlataforma aberta. Pode navegar livremente.');
})();
