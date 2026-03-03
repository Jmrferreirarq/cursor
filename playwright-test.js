const { chromium } = require('playwright');

const TARGET_URL = 'https://cursor-blond-two.vercel.app';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('=== Teste FA-360 ===\n');

  // 1. Dashboard
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: './playwright-01-dashboard.png' });
  console.log('1. Dashboard carregado:', await page.title());

  // 2. Navegar para Propostas
  try {
    const proposalsLink = page.locator('nav a, a').filter({ hasText: /proposta/i }).first();
    await proposalsLink.click({ timeout: 5000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: './playwright-02-proposals.png', fullPage: true });

    const yearButtons = await page.locator('button').filter({ hasText: /^202[2-6]/ }).all();
    console.log(`2. Propostas abertas. Anos encontrados: ${yearButtons.length}`);
    for (const b of yearButtons) {
      const t = (await b.innerText()).split('\n')[0].trim();
      console.log(`   Ano: ${t}`);
    }

    if (yearButtons.length > 0) {
      await yearButtons[0].click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: './playwright-03-year-expanded.png', fullPage: true });
      console.log('3. Primeiro ano expandido');
    }
  } catch(e) {
    console.log('2. Erro em Propostas:', e.message);
  }

  // 3. Testar Calculadora
  try {
    await page.goto(TARGET_URL + '/calculator', { waitUntil: 'networkidle' });
    await page.screenshot({ path: './playwright-04-calculator.png', fullPage: true });
    console.log('4. Calculadora carregada');
  } catch(e) {
    console.log('4. Calculadora erro:', e.message);
  }

  // 4. Agente interno
  try {
    await page.goto(TARGET_URL + '/agent', { waitUntil: 'networkidle' });
    await page.screenshot({ path: './playwright-05-agent.png', fullPage: true });
    console.log('5. Agente carregado');
  } catch(e) {
    console.log('5. Agente erro:', e.message);
  }

  // 5. Publicar
  try {
    await page.goto(TARGET_URL + '/publish', { waitUntil: 'networkidle' });
    await page.screenshot({ path: './playwright-06-publish.png', fullPage: true });
    console.log('6. Publicar carregado');
  } catch(e) {
    console.log('6. Publicar erro:', e.message);
  }

  // 6. Legislação
  try {
    await page.goto(TARGET_URL + '/legislation', { waitUntil: 'networkidle' });
    await page.screenshot({ path: './playwright-07-legislation.png', fullPage: true });
    console.log('7. Legislação carregada');
  } catch(e) {
    console.log('7. Legislação erro:', e.message);
  }

  console.log('\n=== Teste concluído. Screenshots guardadas. ===');
  await browser.close();
})();
