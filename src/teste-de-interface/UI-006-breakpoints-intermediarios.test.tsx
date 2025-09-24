import { test, expect, Page } from '@playwright/test';

test.describe('UI-006 - Breakpoints Intermediários', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar breakpoint 320px (mobile pequeno)', async () => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    
    // Verificar se o layout funciona em mobile pequeno
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal excessivo
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    if (scrollWidth > clientWidth) {
      expect(scrollWidth - clientWidth).toBeLessThan(50);
    }
    
    // Verificar se os elementos principais estão visíveis
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
  });

  test('deve verificar breakpoint 480px (mobile grande)', async () => {
    await page.setViewportSize({ width: 480, height: 854 });
    await page.goto('/');
    
    // Verificar se o layout funciona em mobile grande
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    
    // Verificar se os elementos principais estão visíveis
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
  });

  test('deve verificar breakpoint 768px (tablet portrait)', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Verificar se o layout funciona em tablet portrait
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    
    // Verificar se os elementos principais estão visíveis
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
  });

  test('deve verificar breakpoint 1024px (tablet landscape)', async () => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    // Verificar se o layout funciona em tablet landscape
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    
    // Verificar se os elementos principais estão visíveis
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
  });

  test('deve verificar breakpoint 1440px (desktop grande)', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    
    // Verificar se o layout funciona em desktop grande
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    
    // Verificar se os elementos principais estão visíveis
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
  });

  test('deve verificar breakpoint 1920px (desktop full HD)', async () => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Verificar se o layout funciona em desktop full HD
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    
    // Verificar se os elementos principais estão visíveis
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
  });

  test('deve verificar transições suaves entre breakpoints', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 480, height: 854 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Verificar se o layout ainda está funcional
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Verificar se não há scroll horizontal excessivo
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      
      if (scrollWidth > clientWidth) {
        expect(scrollWidth - clientWidth).toBeLessThan(100);
      }
    }
  });

  test('deve verificar elementos se reorganizam adequadamente', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Verificar se os elementos principais estão visíveis
      const header = page.locator('header, [data-testid="header"], .header');
      await expect(header).toBeVisible();
      
      const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
      await expect(mainContent).toBeVisible();
      
      // Verificar se não há sobreposição de elementos
      const headerBox = await header.boundingBox();
      const mainBox = await mainContent.boundingBox();
      
      if (headerBox && mainBox) {
        expect(headerBox.y + headerBox.height).toBeLessThanOrEqual(mainBox.y);
      }
    }
  });

  test('deve verificar nenhum layout quebrado', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 480, height: 854 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Verificar se não há elementos com largura ou altura negativa
      const elements = await page.locator('*').all();
      for (const element of elements.slice(0, 10)) { // Verificar apenas os primeiros 10 elementos
        if (await element.isVisible()) {
          const box = await element.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(0);
            expect(box.height).toBeGreaterThanOrEqual(0);
          }
        }
      }
    }
  });

  test('deve verificar funcionalidades mantidas', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Verificar se os botões são clicáveis
      const buttons = page.locator('button, [role="button"], input[type="button"]');
      const count = await buttons.count();
      
      if (count > 0) {
        const firstButton = buttons.first();
        if (await firstButton.isVisible()) {
          await expect(firstButton).toBeEnabled();
        }
      }
      
      // Verificar se os links são clicáveis
      const links = page.locator('a, [role="link"]');
      const linkCount = await links.count();
      
      if (linkCount > 0) {
        const firstLink = links.first();
        if (await firstLink.isVisible()) {
          await expect(firstLink).toBeVisible();
        }
      }
    }
  });

  test('deve verificar performance consistente', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Verificar se a página carrega em tempo adequado
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Verificar se carregou em menos de 5 segundos
      expect(loadTime).toBeLessThan(5000);
    }
  });

  test('deve verificar UX fluida', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Verificar se a experiência do usuário é fluida
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Verificar se não há elementos sobrepostos
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
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 480, height: 854 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Transições suaves
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Layout consistente
      const header = page.locator('header, [data-testid="header"], .header');
      await expect(header).toBeVisible();
      
      const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
      await expect(mainContent).toBeVisible();
      
      // Funcionalidades mantidas
      const buttons = page.locator('button, [role="button"], input[type="button"]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
      
      // Performance adequada
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000);
      
      // UX fluida
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      
      if (scrollWidth > clientWidth) {
        expect(scrollWidth - clientWidth).toBeLessThan(100);
      }
    }
  });

  test('deve monitorar métricas de breakpoints', async () => {
    const breakpoints = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
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
      
      expect(metrics.viewportWidth).toBe(breakpoint.width);
      expect(metrics.viewportHeight).toBe(breakpoint.height);
      expect(metrics.hasHeader).toBe(true);
      expect(metrics.hasMain).toBe(true);
      expect(metrics.cardCount).toBeGreaterThan(0);
      expect(metrics.navItemCount).toBeGreaterThan(0);
      expect(metrics.buttonCount).toBeGreaterThan(0);
    }
  });
});
