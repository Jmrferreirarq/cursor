const { chromium } = require('playwright');

const BASE = 'https://cursor-blond-two.vercel.app';

const ROUTES = [
  { name: 'Dashboard', path: '/' },
  { name: 'Propostas', path: '/proposals' },
  { name: 'Calculadora', path: '/calculator' },
  { name: 'Agente', path: '/agent' },
  { name: 'Planner/Publicar', path: '/planner' },
  { name: 'Legislacao', path: '/legislacao' },
  { name: 'Municipios', path: '/municipios' },
  { name: 'Projetos', path: '/projects' },
  { name: 'Clientes', path: '/clients' },
  { name: 'Financeiro', path: '/financial' },
  { name: 'Relatorios', path: '/reports' },
  { name: 'Media Hub', path: '/media' },
  { name: 'Marketing', path: '/marketing' },
  { name: 'Faturacao', path: '/billing' },
  { name: 'Definicoes', path: '/settings' },
  { name: 'Técnico', path: '/technical' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const results = [];

  for (const route of ROUTES) {
    try {
      const resp = await page.goto(BASE + route.path, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(800);
      const title = await page.title();
      const is404 = await page.locator('text=404').count() > 0 || await page.locator('text=Página não encontrada').count() > 0;
      const status = is404 ? 'ERROR 404' : 'OK';
      results.push({ name: route.name, path: route.path, status });
      console.log(`${status === 'OK' ? '✓' : '✗'} ${route.name} (${route.path}) — ${status}`);
    } catch(e) {
      results.push({ name: route.name, path: route.path, status: 'TIMEOUT/ERROR' });
      console.log(`✗ ${route.name} (${route.path}) — ERRO: ${e.message.split('\n')[0]}`);
    }
  }

  // Teste especial: verificar ano collapse nas propostas
  await page.goto(BASE + '/proposals', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const yearBtns = await page.locator('button').filter({ hasText: /2022|2023|2024|2025|2026/ }).count();
  console.log(`\nPropostas - botões de ano visíveis: ${yearBtns}`);

  // Testar calculadora - clicar em "Honorários de Arquitetura"
  await page.goto(BASE + '/calculator', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const calcCards = await page.locator('.cursor-pointer, button, [role="button"]').filter({ hasText: /Honorários|Custo|Avalia/i }).count();
  console.log(`Calculadora - cards clicáveis: ${calcCards}`);

  await browser.close();

  const errors = results.filter(r => r.status !== 'OK');
  console.log(`\n=== RESUMO: ${results.length - errors.length}/${results.length} OK | ${errors.length} com erros ===`);
  if (errors.length > 0) {
    console.log('Erros:', errors.map(e => `${e.name} (${e.path})`).join(', '));
  }
})();
