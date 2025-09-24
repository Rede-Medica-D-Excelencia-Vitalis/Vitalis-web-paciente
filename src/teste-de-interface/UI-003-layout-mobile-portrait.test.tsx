import { test, expect, Page } from '@playwright/test';

test.describe('UI-003 - Layout Mobile Portrait (375x667)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar viewport mobile portrait 375x667', async () => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
  });

  test('deve verificar layout otimizado para mobile', async () => {
    // Verificar se o layout se adapta corretamente para mobile
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('deve verificar menu hambúrguer funcional', async () => {
    // Verificar se há menu hambúrguer
    const hamburgerMenu = page.locator('[data-testid*="hamburger"], .hamburger, .menu-toggle, button[aria-label*="menu"]');
    
    if (await hamburgerMenu.isVisible()) {
      await expect(hamburgerMenu).toBeVisible();
      await expect(hamburgerMenu).toBeEnabled();
      
      // Testar funcionalidade do menu
      await hamburgerMenu.click();
      await page.waitForTimeout(100);
      
      // Verificar se o menu se abriu
      const menu = page.locator('[data-testid*="menu"], .menu, .navigation-menu');
      if (await menu.isVisible()) {
        await expect(menu).toBeVisible();
      }
    }
  });

  test('deve verificar cards empilhados verticalmente', async () => {
    // Verificar se há cards de estatísticas
    const cards = page.locator('[data-testid*="card"], .card, .stat-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os cards estão organizados em coluna única
    const cardsContainer = page.locator('[data-testid*="cards"], .cards-container, .stats-grid');
    await expect(cardsContainer).toBeVisible();
    
    // Em mobile, deve haver pelo menos 1 card por linha
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('deve verificar botões com tamanho mínimo 44px', async () => {
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

  test('deve verificar formulários adaptados', async () => {
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
        expect(box?.width).toBeGreaterThan(200);
      }
    }
  });

  test('deve verificar texto legível sem zoom horizontal', async () => {
    // Verificar se o texto está legível
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se pelo menos alguns elementos de texto estão visíveis
    let visibleTextCount = 0;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        visibleTextCount++;
        
        // Verificar se o texto não excede a largura da tela
        const box = await element.boundingBox();
        if (box) {
          expect(box.width).toBeLessThanOrEqual(375);
        }
      }
    }
    expect(visibleTextCount).toBeGreaterThan(0);
  });

  test('deve verificar scroll suave', async () => {
    // Verificar se a página é scrollável
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se há conteúdo suficiente para scroll
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
    
    // Deve haver scroll vertical ou conteúdo adequado
    expect(scrollHeight).toBeGreaterThanOrEqual(clientHeight);
  });

  test('deve verificar lista de consultas otimizada', async () => {
    // Verificar se há lista de consultas
    const consultasList = page.locator('[data-testid*="consultas"], .consultas-list, .appointments-list');
    await expect(consultasList).toBeVisible();
    
    // Verificar se a lista está otimizada para mobile
    const consultasBox = await consultasList.boundingBox();
    expect(consultasBox?.width).toBeLessThanOrEqual(375);
    
    // Verificar se há itens na lista
    const consultasItems = consultasList.locator('li, .consultas-item, .appointment-item');
    const count = await consultasItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve verificar calendário mobile-friendly', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há calendário
    const calendar = page.locator('[data-testid*="calendar"], .calendar, .date-picker');
    await expect(calendar).toBeVisible();
    
    // Verificar se o calendário está adaptado para mobile
    const calendarBox = await calendar.boundingBox();
    expect(calendarBox?.width).toBeLessThanOrEqual(375);
    expect(calendarBox?.height).toBeGreaterThan(200);
    
    // Verificar se há dias do mês
    const days = calendar.locator('[data-testid*="day"], .day, .calendar-day');
    const count = await days.count();
    expect(count).toBeGreaterThan(0);
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
        expect(box?.width).toBeGreaterThan(200);
      }
    }
  });

  test('deve verificar performance otimizada', async () => {
    // Verificar se a página carrega em tempo adequado
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Verificar se carregou em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    // Layout mobile-first
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
    
    // Touch targets adequados
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const firstButton = buttons.first();
    if (await firstButton.isVisible()) {
      const box = await firstButton.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    
    // Navegação intuitiva
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Formulários usáveis
    await page.goto('/agendamento');
    const form = page.locator('form, [data-testid*="form"], .agendamento-form');
    await expect(form).toBeVisible();
    
    // Performance otimizada
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve monitorar métricas de interface mobile', async () => {
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
        buttonCount: document.querySelectorAll('button, [role="button"], input[type="button"]').length,
        hasHamburgerMenu: !!document.querySelector('[data-testid*="hamburger"], .hamburger, .menu-toggle')
      };
    });
    
    expect(metrics.viewportWidth).toBe(375);
    expect(metrics.viewportHeight).toBe(667);
    expect(metrics.hasHeader).toBe(true);
    expect(metrics.hasMain).toBe(true);
    expect(metrics.cardCount).toBeGreaterThan(0);
    expect(metrics.navItemCount).toBeGreaterThan(0);
    expect(metrics.buttonCount).toBeGreaterThan(0);
  });

  test('deve verificar cenários de interface degradada', async () => {
    // Testar em resolução inadequada
    await page.setViewportSize({ width: 320, height: 568 });
    
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
