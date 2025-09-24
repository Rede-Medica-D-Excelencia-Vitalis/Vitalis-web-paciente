import { test, expect, Page } from '@playwright/test';

test.describe('UI-004 - Layout Mobile Landscape (667x375)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar viewport mobile landscape 667x375', async () => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(667);
    expect(viewport?.height).toBe(375);
  });

  test('deve verificar layout adaptado para landscape', async () => {
    // Verificar se o layout se adapta corretamente para landscape
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('deve verificar aproveitamento da largura disponível', async () => {
    // Verificar se o conteúdo aproveita a largura disponível
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
    
    const mainBox = await mainContent.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(400);
    expect(mainBox?.height).toBeGreaterThan(200);
  });

  test('deve verificar navegação ainda acessível', async () => {
    // Verificar se há navegação acessível
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Verificar se há links de navegação
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os links são acessíveis
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = navLinks.nth(i);
      if (await link.isVisible()) {
        const box = await link.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('deve verificar formulários funcionais', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há formulário de agendamento
    const form = page.locator('form, [data-testid*="form"], .agendamento-form');
    await expect(form).toBeVisible();
    
    // Verificar se os campos são funcionais
    const inputs = form.locator('input, select, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const box = await input.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        expect(box?.width).toBeGreaterThan(200);
      }
    }
  });

  test('deve verificar conteúdo não cortado', async () => {
    // Verificar se o conteúdo não está cortado
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
    
    const mainBox = await mainContent.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(0);
    expect(mainBox?.height).toBeGreaterThan(0);
    
    // Verificar se não há scroll horizontal excessivo
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    if (scrollWidth > clientWidth) {
      expect(scrollWidth - clientWidth).toBeLessThan(100);
    }
  });

  test('deve verificar header compacto', async () => {
    // Verificar se o header está compacto
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const headerBox = await header.boundingBox();
    expect(headerBox?.height).toBeLessThan(100);
  });

  test('deve verificar cards em 2 colunas se possível', async () => {
    // Verificar se há cards de estatísticas
    const cards = page.locator('[data-testid*="card"], .card, .stat-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os cards estão organizados em grid adequado para landscape
    const cardsContainer = page.locator('[data-testid*="cards"], .cards-container, .stats-grid');
    await expect(cardsContainer).toBeVisible();
    
    // Em landscape, pode haver 2 colunas
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('deve verificar lista de consultas otimizada', async () => {
    // Verificar se há lista de consultas
    const consultasList = page.locator('[data-testid*="consultas"], .consultas-list, .appointments-list');
    await expect(consultasList).toBeVisible();
    
    // Verificar se a lista está otimizada para landscape
    const consultasBox = await consultasList.boundingBox();
    expect(consultasBox?.width).toBeLessThanOrEqual(667);
    
    // Verificar se há itens na lista
    const consultasItems = consultasList.locator('li, .consultas-item, .appointment-item');
    const count = await consultasItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve verificar calendário adaptado', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há calendário
    const calendar = page.locator('[data-testid*="calendar"], .calendar, .date-picker');
    await expect(calendar).toBeVisible();
    
    // Verificar se o calendário está adaptado para landscape
    const calendarBox = await calendar.boundingBox();
    expect(calendarBox?.width).toBeLessThanOrEqual(667);
    expect(calendarBox?.height).toBeGreaterThan(200);
  });

  test('deve verificar botões acessíveis', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões são acessíveis
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
        await expect(button).toBeEnabled();
      }
    }
  });

  test('deve verificar formulários responsivos', async () => {
    await page.goto('/login');
    
    // Verificar se há formulário de login
    const form = page.locator('form, [data-testid*="form"], .login-form');
    await expect(form).toBeVisible();
    
    // Verificar se os campos são responsivos
    const inputs = form.locator('input, select, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const box = await input.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        expect(box?.width).toBeGreaterThan(200);
      }
    }
  });

  test('deve verificar performance mantida', async () => {
    // Verificar se a página carrega em tempo adequado
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Verificar se carregou em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    // Layout adaptado
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(667);
    expect(viewport?.height).toBe(375);
    
    // Conteúdo visível
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
    
    // Navegação funcional
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Formulários usáveis
    await page.goto('/agendamento');
    const form = page.locator('form, [data-testid*="form"], .agendamento-form');
    await expect(form).toBeVisible();
    
    // Performance mantida
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve monitorar métricas de interface mobile landscape', async () => {
    // Coletar métricas de interface
    const metrics = await page.evaluate(() => {
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        hasHeader: !!document.querySelector('header, [data-testid="header"], .header'),
        hasMain: !!document.querySelector('main, [data-testid="main-content"], .main-content'),
        cardCount: document.querySelectorAll('[data-testid*="card"], .card, .stat-card').length,
        navItemCount: document.querySelectorAll('nav a, [data-testid*="nav-link"], .nav-link').length,
        buttonCount: document.querySelectorAll('button, [role="button"], input[type="button"]').length
      };
    });
    
    expect(metrics.viewportWidth).toBe(667);
    expect(metrics.viewportHeight).toBe(375);
    expect(metrics.hasHeader).toBe(true);
    expect(metrics.hasMain).toBe(true);
    expect(metrics.cardCount).toBeGreaterThan(0);
    expect(metrics.navItemCount).toBeGreaterThan(0);
    expect(metrics.buttonCount).toBeGreaterThan(0);
  });

  test('deve verificar cenários de interface degradada', async () => {
    // Testar em resolução inadequada
    await page.setViewportSize({ width: 600, height: 300 });
    
    // Verificar se o layout ainda funciona
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se há scroll horizontal (indicador de problema)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    // Em resolução baixa, pode haver scroll horizontal, mas não deve ser excessivo
    if (scrollWidth > clientWidth) {
      expect(scrollWidth - clientWidth).toBeLessThan(50);
    }
  });
});
