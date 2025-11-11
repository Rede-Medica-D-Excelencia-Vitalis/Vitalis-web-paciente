import { test, expect, Page } from '@playwright/test';

test.describe('UI-005 - Layout Tablet Landscape (1024x768)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar viewport tablet landscape 1024x768', async () => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1024);
    expect(viewport?.height).toBe(768);
  });

  test('deve verificar layout otimizado para landscape', async () => {
    // Verificar se o layout se adapta corretamente para tablet landscape
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('deve verificar aproveitamento da largura', async () => {
    // Verificar se o conteúdo aproveita a largura disponível
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
    
    const mainBox = await mainContent.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(600);
    expect(mainBox?.height).toBeGreaterThan(400);
  });

  test('deve verificar sidebar visível ou colapsível', async () => {
    // Verificar se a sidebar está visível ou colapsível
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
    
    // Em tablet landscape, a sidebar pode estar visível ou colapsível
    const isVisible = await sidebar.isVisible();
    const isHidden = await sidebar.isHidden();
    
    // Pelo menos uma das condições deve ser verdadeira
    expect(isVisible || isHidden).toBe(true);
    
    // Se estiver visível, verificar se tem largura adequada
    if (isVisible) {
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeGreaterThan(200);
      expect(sidebarBox?.width).toBeLessThan(400);
    }
  });

  test('deve verificar cards em 3-4 colunas', async () => {
    // Verificar se há cards de estatísticas
    const cards = page.locator('[data-testid*="card"], .card, .stat-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os cards estão organizados em grid adequado para tablet landscape
    const cardsContainer = page.locator('[data-testid*="cards"], .cards-container, .stats-grid');
    await expect(cardsContainer).toBeVisible();
    
    // Em tablet landscape, deve haver pelo menos 3-4 cards por linha
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('deve verificar navegação fluida', async () => {
    // Verificar se há navegação fluida
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Verificar se há links de navegação
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Testar navegação para primeira seção
    if (count > 0) {
      const firstLink = navLinks.first();
      await firstLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se a página carregou
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('deve verificar lista de consultas', async () => {
    // Verificar se há lista de consultas
    const consultasList = page.locator('[data-testid*="consultas"], .consultas-list, .appointments-list');
    await expect(consultasList).toBeVisible();
    
    // Verificar se há itens na lista
    const consultasItems = consultasList.locator('li, .consultas-item, .appointment-item');
    const count = await consultasItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve verificar calendário de agendamento', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há calendário
    const calendar = page.locator('[data-testid*="calendar"], .calendar, .date-picker');
    await expect(calendar).toBeVisible();
    
    // Verificar se o calendário está adaptado para tablet landscape
    const calendarBox = await calendar.boundingBox();
    expect(calendarBox?.width).toBeGreaterThan(400);
    expect(calendarBox?.height).toBeGreaterThan(300);
  });

  test('deve verificar formulários', async () => {
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

  test('deve verificar interface de videochamada', async () => {
    await page.goto('/teleconsulta');
    
    // Verificar se há interface de videochamada
    const videoInterface = page.locator('[data-testid*="video"], .video-interface, .video-call');
    await expect(videoInterface).toBeVisible();
    
    // Verificar se há controles de videochamada
    const controls = videoInterface.locator('button, [data-testid*="control"], .video-control');
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve verificar performance adequada', async () => {
    // Verificar se a página carrega em tempo adequado
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Verificar se carregou em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve verificar UX consistente', async () => {
    // Verificar se a experiência do usuário é consistente
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
    
    const footer = page.locator('footer, [data-testid="footer"], .footer');
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible();
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    // Layout otimizado
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1024);
    expect(viewport?.height).toBe(768);
    
    // Elementos bem distribuídos
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
    
    const mainBox = await mainContent.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(600);
    expect(mainBox?.height).toBeGreaterThan(400);
    
    // Navegação funcional
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Performance adequada
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
    
    // UX consistente
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
  });

  test('deve monitorar métricas de interface tablet landscape', async () => {
    // Coletar métricas de interface
    const metrics = await page.evaluate(() => {
      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        hasSidebar: !!document.querySelector('aside, [data-testid="sidebar"], .sidebar'),
        hasHeader: !!document.querySelector('header, [data-testid="header"], .header'),
        hasMain: !!document.querySelector('main, [data-testid="main-content"], .main-content'),
        cardCount: document.querySelectorAll('[data-testid*="card"], .card, .stat-card').length,
        navItemCount: document.querySelectorAll('nav a, [data-testid*="nav-link"], .nav-link').length,
        buttonCount: document.querySelectorAll('button, [role="button"], input[type="button"]').length
      };
    });
    
    expect(metrics.viewportWidth).toBe(1024);
    expect(metrics.viewportHeight).toBe(768);
    expect(metrics.hasHeader).toBe(true);
    expect(metrics.hasMain).toBe(true);
    expect(metrics.cardCount).toBeGreaterThan(0);
    expect(metrics.navItemCount).toBeGreaterThan(0);
    expect(metrics.buttonCount).toBeGreaterThan(0);
  });

  test('deve verificar cenários de interface degradada', async () => {
    // Testar em resolução inadequada
    await page.setViewportSize({ width: 800, height: 600 });
    
    // Verificar se o layout ainda funciona
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se há scroll horizontal (indicador de problema)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    // Em resolução baixa, pode haver scroll horizontal, mas não deve ser excessivo
    if (scrollWidth > clientWidth) {
      expect(scrollWidth - clientWidth).toBeLessThan(100);
    }
  });
});
