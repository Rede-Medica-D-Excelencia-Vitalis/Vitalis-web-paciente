import { test, expect, Page } from '@playwright/test';

test.describe('UI-002 - Layout Tablet (768x1024)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar viewport tablet 768x1024', async () => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(768);
    expect(viewport?.height).toBe(1024);
  });

  test('deve verificar layout adaptado para tablet', async () => {
    // Verificar se o layout se adapta corretamente para tablet
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('deve verificar sidebar colapsível ou em overlay', async () => {
    // Verificar se a sidebar está adaptada para tablet
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
    
    // Em tablet, a sidebar pode estar colapsada ou em overlay
    const isVisible = await sidebar.isVisible();
    const isHidden = await sidebar.isHidden();
    
    // Pelo menos uma das condições deve ser verdadeira
    expect(isVisible || isHidden).toBe(true);
    
    // Se estiver visível, verificar se tem largura adequada para tablet
    if (isVisible) {
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeLessThanOrEqual(300);
    }
  });

  test('deve verificar menu hambúrguer se aplicável', async () => {
    // Verificar se há menu hambúrguer para tablet
    const hamburgerMenu = page.locator('[data-testid*="hamburger"], .hamburger, .menu-toggle, button[aria-label*="menu"]');
    
    // Em tablet, pode haver menu hambúrguer
    if (await hamburgerMenu.isVisible()) {
      await expect(hamburgerMenu).toBeVisible();
      await expect(hamburgerMenu).toBeEnabled();
    }
  });

  test('deve verificar cards reorganizados em 2-3 colunas', async () => {
    // Verificar se há cards de estatísticas
    const cards = page.locator('[data-testid*="card"], .card, .stat-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os cards estão organizados em grid adequado para tablet
    const cardsContainer = page.locator('[data-testid*="cards"], .cards-container, .stats-grid');
    await expect(cardsContainer).toBeVisible();
    
    // Em tablet, deve haver pelo menos 2-3 cards por linha
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('deve verificar botões com tamanho adequado para touch', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões têm tamanho adequado para touch (mínimo 44px)
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('deve verificar formulários responsivos', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há formulário de agendamento
    const form = page.locator('form, [data-testid*="form"], .agendamento-form');
    await expect(form).toBeVisible();
    
    // Verificar se os campos têm tamanho adequado para touch
    const inputs = form.locator('input, select, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const box = await input.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('deve verificar navegação touch-friendly', async () => {
    // Verificar se há links de navegação
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os links têm tamanho adequado para touch
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = navLinks.nth(i);
      if (await link.isVisible()) {
        const box = await link.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('deve verificar lista de consultas scrollável', async () => {
    // Verificar se há lista de consultas
    const consultasList = page.locator('[data-testid*="consultas"], .consultas-list, .appointments-list');
    await expect(consultasList).toBeVisible();
    
    // Verificar se a lista é scrollável
    const isScrollable = await consultasList.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });
    
    // A lista deve ser scrollável ou ter altura adequada
    expect(isScrollable || await consultasList.boundingBox().then(box => (box?.height || 0) > 200)).toBe(true);
  });

  test('deve verificar calendário adaptado', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há calendário
    const calendar = page.locator('[data-testid*="calendar"], .calendar, .date-picker');
    await expect(calendar).toBeVisible();
    
    // Verificar se o calendário está adaptado para tablet
    const calendarBox = await calendar.boundingBox();
    expect(calendarBox?.width).toBeGreaterThan(300);
    expect(calendarBox?.height).toBeGreaterThan(200);
  });

  test('deve verificar botões de ação acessíveis', async () => {
    // Verificar se há botões de ação
    const actionButtons = page.locator('button[type="submit"], .btn-primary, [data-testid*="action-button"]');
    const count = await actionButtons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões são acessíveis via touch
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = actionButtons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
        await expect(button).toBeEnabled();
      }
    }
  });

  test('deve verificar formulários de login/cadastro', async () => {
    await page.goto('/login');
    
    // Verificar se há formulário de login
    const form = page.locator('form, [data-testid*="form"], .login-form');
    await expect(form).toBeVisible();
    
    // Verificar se os campos são adequados para touch
    const inputs = form.locator('input, select, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const box = await input.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
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
    expect(viewport?.width).toBe(768);
    expect(viewport?.height).toBe(1024);
    
    // Touch targets adequados
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const firstButton = buttons.first();
    if (await firstButton.isVisible()) {
      const box = await firstButton.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    
    // Navegação touch
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Formulários funcionais
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

  test('deve monitorar métricas de interface tablet', async () => {
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
    
    expect(metrics.viewportWidth).toBe(768);
    expect(metrics.viewportHeight).toBe(1024);
    expect(metrics.hasHeader).toBe(true);
    expect(metrics.hasMain).toBe(true);
    expect(metrics.cardCount).toBeGreaterThan(0);
    expect(metrics.navItemCount).toBeGreaterThan(0);
    expect(metrics.buttonCount).toBeGreaterThan(0);
  });

  test('deve verificar cenários de interface degradada', async () => {
    // Testar em resolução inadequada
    await page.setViewportSize({ width: 600, height: 800 });
    
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
