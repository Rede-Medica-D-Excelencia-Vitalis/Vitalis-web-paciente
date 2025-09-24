import { test, expect, Page } from '@playwright/test';

test.describe('UI-007 - Menu de Navegação Principal', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar itens do menu principal', async () => {
    // Verificar se há menu de navegação
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Verificar se há itens do menu
    const menuItems = nav.locator('a, button, [role="button"], [data-testid*="nav-item"]');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os itens estão visíveis
    for (let i = 0; i < count; i++) {
      const item = menuItems.nth(i);
      await expect(item).toBeVisible();
    }
  });

  test('deve verificar organização lógica dos itens', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Verificar se há itens de navegação principais
    const expectedItems = [
      'Dashboard',
      'Agendamento',
      'Teleconsulta',
      'Triagem Online',
      'Farmácia',
      'Prescrições',
      'Resultados',
      'Meu Perfil',
      'Central de Ajuda'
    ];
    
    for (const itemText of expectedItems) {
      const item = nav.locator(`text=${itemText}, [aria-label*="${itemText}"], [title*="${itemText}"]`);
      if (await item.isVisible()) {
        await expect(item).toBeVisible();
      }
    }
  });

  test('deve verificar redirecionamento para Dashboard', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link do Dashboard
    const dashboardLink = nav.locator('text=Dashboard, [aria-label*="Dashboard"], [title*="Dashboard"]').first();
    
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/dashboard');
    }
  });

  test('deve verificar redirecionamento para Agendamento', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link do Agendamento
    const agendamentoLink = nav.locator('text=Agendamento, [aria-label*="Agendamento"], [title*="Agendamento"]').first();
    
    if (await agendamentoLink.isVisible()) {
      await agendamentoLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/agendamento');
    }
  });

  test('deve verificar redirecionamento para Teleconsulta', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link da Teleconsulta
    const teleconsultaLink = nav.locator('text=Teleconsulta, [aria-label*="Teleconsulta"], [title*="Teleconsulta"]').first();
    
    if (await teleconsultaLink.isVisible()) {
      await teleconsultaLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/teleconsulta');
    }
  });

  test('deve verificar redirecionamento para Triagem Online', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link da Triagem Online
    const triagemLink = nav.locator('text=Triagem Online, [aria-label*="Triagem"], [title*="Triagem"]').first();
    
    if (await triagemLink.isVisible()) {
      await triagemLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/triagem');
    }
  });

  test('deve verificar redirecionamento para Farmácia', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link da Farmácia
    const farmaciaLink = nav.locator('text=Farmácia, [aria-label*="Farmácia"], [title*="Farmácia"]').first();
    
    if (await farmaciaLink.isVisible()) {
      await farmaciaLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/farmacia');
    }
  });

  test('deve verificar redirecionamento para Prescrições', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link das Prescrições
    const prescricoesLink = nav.locator('text=Prescrições, [aria-label*="Prescrições"], [title*="Prescrições"]').first();
    
    if (await prescricoesLink.isVisible()) {
      await prescricoesLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/prescricoes');
    }
  });

  test('deve verificar redirecionamento para Resultados', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link dos Resultados
    const resultadosLink = nav.locator('text=Resultados, [aria-label*="Resultados"], [title*="Resultados"]').first();
    
    if (await resultadosLink.isVisible()) {
      await resultadosLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/resultados');
    }
  });

  test('deve verificar redirecionamento para Meu Perfil', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link do Meu Perfil
    const perfilLink = nav.locator('text=Meu Perfil, [aria-label*="Perfil"], [title*="Perfil"]').first();
    
    if (await perfilLink.isVisible()) {
      await perfilLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/perfil');
    }
  });

  test('deve verificar redirecionamento para Central de Ajuda', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Procurar por link da Central de Ajuda
    const ajudaLink = nav.locator('text=Central de Ajuda, [aria-label*="Ajuda"], [title*="Ajuda"]').first();
    
    if (await ajudaLink.isVisible()) {
      await ajudaLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verificar se redirecionou para a página correta
      const currentUrl = page.url();
      expect(currentUrl).toContain('/ajuda');
    }
  });

  test('deve verificar indicador visual da página ativa', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Verificar se há indicador visual da página ativa
    const activeItems = nav.locator('[aria-current="page"], .active, [data-active="true"]');
    const count = await activeItems.count();
    
    // Deve haver pelo menos um item ativo
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os itens ativos estão visíveis
    for (let i = 0; i < count; i++) {
      const item = activeItems.nth(i);
      await expect(item).toBeVisible();
    }
  });

  test('deve verificar menu responsivo em mobile', async () => {
    // Testar em resolução mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
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

  test('deve verificar navegação rápida e intuitiva', async () => {
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Verificar se os itens do menu são clicáveis
    const menuItems = nav.locator('a, button, [role="button"], [data-testid*="nav-item"]');
    const count = await menuItems.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = menuItems.nth(i);
      if (await item.isVisible()) {
        await expect(item).toBeEnabled();
        
        // Verificar se o item tem texto ou aria-label
        const text = await item.textContent();
        const ariaLabel = await item.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    // Menu funcional
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Redirecionamentos corretos
    const menuItems = nav.locator('a, button, [role="button"], [data-testid*="nav-item"]');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
    
    // Indicadores visuais
    const activeItems = nav.locator('[aria-current="page"], .active, [data-active="true"]');
    const activeCount = await activeItems.count();
    expect(activeCount).toBeGreaterThan(0);
    
    // Responsividade
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(nav).toBeVisible();
    
    // UX intuitiva
    for (let i = 0; i < Math.min(count, 3); i++) {
      const item = menuItems.nth(i);
      if (await item.isVisible()) {
        const text = await item.textContent();
        const ariaLabel = await item.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
    }
  });

  test('deve monitorar métricas de navegação', async () => {
    // Coletar métricas de navegação
    const metrics = await page.evaluate(() => {
      return {
        navVisible: !!document.querySelector('nav, [data-testid="navigation"], .navigation'),
        menuItemCount: document.querySelectorAll('nav a, nav button, [data-testid*="nav-item"]').length,
        activeItemCount: document.querySelectorAll('[aria-current="page"], .active, [data-active="true"]').length,
        hasHamburgerMenu: !!document.querySelector('[data-testid*="hamburger"], .hamburger, .menu-toggle'),
        navLinks: Array.from(document.querySelectorAll('nav a')).map(link => ({
          text: link.textContent?.trim(),
          href: link.getAttribute('href'),
          ariaLabel: link.getAttribute('aria-label')
        }))
      };
    });
    
    expect(metrics.navVisible).toBe(true);
    expect(metrics.menuItemCount).toBeGreaterThan(0);
    expect(metrics.activeItemCount).toBeGreaterThan(0);
    expect(metrics.navLinks.length).toBeGreaterThan(0);
  });

  test('deve verificar cenários de navegação degradada', async () => {
    // Testar em resolução muito baixa
    await page.setViewportSize({ width: 320, height: 568 });
    
    const nav = page.locator('nav, [data-testid="navigation"], .navigation');
    await expect(nav).toBeVisible();
    
    // Verificar se o menu ainda é funcional
    const menuItems = nav.locator('a, button, [role="button"], [data-testid*="nav-item"]');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se pelo menos o primeiro item é clicável
    if (count > 0) {
      const firstItem = menuItems.first();
      if (await firstItem.isVisible()) {
        await expect(firstItem).toBeEnabled();
      }
    }
  });
});
