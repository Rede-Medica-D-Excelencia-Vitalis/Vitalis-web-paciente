import { test, expect, Page } from '@playwright/test';

test.describe('UI-001 - Layout Desktop (1920x1080)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar viewport desktop 1920x1080', async () => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);
    expect(viewport?.height).toBe(1080);
  });

  test('deve verificar layout responsivo para desktop', async () => {
    // Verificar se o layout se adapta corretamente para desktop
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('deve verificar header com logo e menu', async () => {
    // Verificar se o header está visível
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    // Verificar se há logo
    const logo = page.locator('img[alt*="logo"], [data-testid="logo"], .logo');
    await expect(logo).toBeVisible();
    
    // Verificar se há menu de navegação
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
  });

  test('deve verificar sidebar de navegação visível', async () => {
    // Verificar se a sidebar está visível em desktop
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
    await expect(sidebar).toBeVisible();
    
    // Verificar se a sidebar tem largura adequada
    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox?.width).toBeGreaterThan(200);
  });

  test('deve verificar itens de navegação na sidebar', async () => {
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
    await expect(sidebar).toBeVisible();
    
    // Verificar se há itens de navegação
    const navItems = sidebar.locator('a, button, [role="button"]');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os itens estão visíveis
    for (let i = 0; i < count; i++) {
      await expect(navItems.nth(i)).toBeVisible();
    }
  });

  test('deve verificar cards de estatísticas em 5 colunas', async () => {
    // Verificar se há cards de estatísticas
    const cards = page.locator('[data-testid*="card"], .card, .stat-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os cards estão organizados em grid
    const cardsContainer = page.locator('[data-testid*="cards"], .cards-container, .stats-grid');
    await expect(cardsContainer).toBeVisible();
    
    // Verificar se há pelo menos 5 cards (para 5 colunas)
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('deve verificar distribuição adequada dos elementos', async () => {
    // Verificar se não há sobreposição de elementos
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
    
    // Verificar se o conteúdo principal está bem posicionado
    const mainBox = await mainContent.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(800);
    expect(mainBox?.height).toBeGreaterThan(400);
  });

  test('deve verificar lista de consultas bem estruturada', async () => {
    // Verificar se há lista de consultas
    const consultasList = page.locator('[data-testid*="consultas"], .consultas-list, .appointments-list');
    await expect(consultasList).toBeVisible();
    
    // Verificar se há itens na lista
    const consultasItems = consultasList.locator('li, .consultas-item, .appointment-item');
    const count = await consultasItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve verificar formulário de agendamento com layout adequado', async () => {
    // Navegar para página de agendamento
    await page.goto('/agendamento');
    
    // Verificar se há formulário de agendamento
    const form = page.locator('form, [data-testid*="form"], .agendamento-form');
    await expect(form).toBeVisible();
    
    // Verificar se há campos de formulário
    const inputs = form.locator('input, select, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve verificar funcionalidade dos formulários', async () => {
    await page.goto('/agendamento');
    
    const form = page.locator('form, [data-testid*="form"], .agendamento-form');
    await expect(form).toBeVisible();
    
    // Verificar se os campos são interativos
    const firstInput = form.locator('input').first();
    await firstInput.click();
    await firstInput.fill('teste');
    await expect(firstInput).toHaveValue('teste');
  });

  test('deve verificar botões e controles acessíveis', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões são clicáveis
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });

  test('deve verificar calendário de agendamento', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há calendário
    const calendar = page.locator('[data-testid*="calendar"], .calendar, .date-picker');
    await expect(calendar).toBeVisible();
    
    // Verificar se há dias do mês
    const days = calendar.locator('[data-testid*="day"], .day, .calendar-day');
    const count = await days.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve verificar interação com calendário', async () => {
    await page.goto('/agendamento');
    
    const calendar = page.locator('[data-testid*="calendar"], .calendar, .date-picker');
    await expect(calendar).toBeVisible();
    
    // Verificar se é possível clicar em um dia
    const firstDay = calendar.locator('[data-testid*="day"], .day, .calendar-day').first();
    if (await firstDay.isVisible()) {
      await firstDay.click();
      // Verificar se houve alguma mudança visual
      await expect(firstDay).toBeVisible();
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

  test('deve verificar controles de videochamada', async () => {
    await page.goto('/teleconsulta');
    
    const videoInterface = page.locator('[data-testid*="video"], .video-interface, .video-call');
    await expect(videoInterface).toBeVisible();
    
    // Verificar se os controles são funcionais
    const muteButton = videoInterface.locator('[data-testid*="mute"], .mute-button');
    if (await muteButton.isVisible()) {
      await muteButton.click();
      await expect(muteButton).toBeVisible();
    }
  });

  test('deve verificar navegação fluida entre seções', async () => {
    // Verificar se é possível navegar entre seções
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

  test('deve verificar acessibilidade da navegação', async () => {
    const navLinks = page.locator('nav a, [data-testid*="nav-link"], .nav-link');
    const count = await navLinks.count();
    
    // Verificar se os links têm texto ou aria-label
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('deve verificar texto legível sem zoom', async () => {
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
      }
    }
    expect(visibleTextCount).toBeGreaterThan(0);
  });

  test('deve verificar contraste e visibilidade dos elementos', async () => {
    // Verificar se os elementos principais estão visíveis
    const mainElements = page.locator('header, main, aside, footer');
    const count = await mainElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = mainElements.nth(i);
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        expect(box?.width).toBeGreaterThan(0);
        expect(box?.height).toBeGreaterThan(0);
      }
    }
  });

  test('deve verificar performance adequada para desktop', async () => {
    // Verificar se a página carrega em tempo adequado
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Verificar se carregou em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve verificar responsividade em diferentes tamanhos', async () => {
    // Testar em diferentes tamanhos de viewport
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1366, height: 768 }
    ];
    
    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(100);
      
      // Verificar se o layout ainda está funcional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    // Layout responsivo
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);
    expect(viewport?.height).toBe(1080);
    
    // Elementos bem posicionados
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar');
    await expect(sidebar).toBeVisible();
    
    // Navegação fluida
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Formulários funcionais
    await page.goto('/agendamento');
    const form = page.locator('form, [data-testid*="form"], .agendamento-form');
    await expect(form).toBeVisible();
    
    // Performance adequada
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
  });

  test('deve monitorar métricas de interface desktop', async () => {
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
        navItemCount: document.querySelectorAll('nav a, [data-testid*="nav-link"], .nav-link').length
      };
    });
    
    expect(metrics.viewportWidth).toBe(1920);
    expect(metrics.viewportHeight).toBe(1080);
    expect(metrics.hasSidebar).toBe(true);
    expect(metrics.hasHeader).toBe(true);
    expect(metrics.hasMain).toBe(true);
    expect(metrics.cardCount).toBeGreaterThan(0);
    expect(metrics.navItemCount).toBeGreaterThan(0);
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
      expect(scrollWidth - clientWidth).toBeLessThan(200);
    }
  });
});
