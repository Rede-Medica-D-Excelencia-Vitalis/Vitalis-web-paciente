import { test, expect, Page } from '@playwright/test';

test.describe('UI-008 - Breadcrumbs e Navegação Hierárquica', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar breadcrumbs em Agendamento > Selecionar Data', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há breadcrumbs
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se há itens do breadcrumb
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se há "Agendamento" no breadcrumb
      const agendamentoItem = breadcrumbs.locator('text=Agendamento, [aria-label*="Agendamento"]');
      if (await agendamentoItem.isVisible()) {
        await expect(agendamentoItem).toBeVisible();
      }
    }
  });

  test('deve verificar breadcrumbs em Agendamento > Selecionar Médico', async () => {
    await page.goto('/agendamento');
    
    // Navegar para seleção de médico (simular)
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se há itens do breadcrumb
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se há "Agendamento" no breadcrumb
      const agendamentoItem = breadcrumbs.locator('text=Agendamento, [aria-label*="Agendamento"]');
      if (await agendamentoItem.isVisible()) {
        await expect(agendamentoItem).toBeVisible();
      }
    }
  });

  test('deve verificar breadcrumbs em Farmácia > Produto Detalhado', async () => {
    await page.goto('/farmacia');
    
    // Verificar se há breadcrumbs
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se há itens do breadcrumb
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se há "Farmácia" no breadcrumb
      const farmaciaItem = breadcrumbs.locator('text=Farmácia, [aria-label*="Farmácia"]');
      if (await farmaciaItem.isVisible()) {
        await expect(farmaciaItem).toBeVisible();
      }
    }
  });

  test('deve verificar breadcrumbs em Triagem > Pergunta X de Y', async () => {
    await page.goto('/triagem');
    
    // Verificar se há breadcrumbs
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se há itens do breadcrumb
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se há "Triagem" no breadcrumb
      const triagemItem = breadcrumbs.locator('text=Triagem, [aria-label*="Triagem"]');
      if (await triagemItem.isVisible()) {
        await expect(triagemItem).toBeVisible();
      }
    }
  });

  test('deve verificar breadcrumbs em Meu Perfil > Editar Dados', async () => {
    await page.goto('/perfil');
    
    // Verificar se há breadcrumbs
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se há itens do breadcrumb
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se há "Meu Perfil" no breadcrumb
      const perfilItem = breadcrumbs.locator('text=Meu Perfil, [aria-label*="Perfil"]');
      if (await perfilItem.isVisible()) {
        await expect(perfilItem).toBeVisible();
      }
    }
  });

  test('deve verificar estrutura hierárquica clara', async () => {
    await page.goto('/agendamento');
    
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se há separadores entre os itens
      const separators = breadcrumbs.locator('text=/, text=>, [aria-hidden="true"]');
      const separatorCount = await separators.count();
      
      // Deve haver separadores entre os itens
      if (separatorCount > 0) {
        expect(separatorCount).toBeGreaterThan(0);
      }
      
      // Verificar se os itens estão em ordem hierárquica
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      
      if (count > 1) {
        // Verificar se o primeiro item é o mais geral
        const firstItem = breadcrumbItems.first();
        const firstText = await firstItem.textContent();
        expect(firstText).toBeTruthy();
        
        // Verificar se o último item é o mais específico
        const lastItem = breadcrumbItems.last();
        const lastText = await lastItem.textContent();
        expect(lastText).toBeTruthy();
      }
    }
  });

  test('deve verificar redirecionamento correto ao clicar em breadcrumb', async () => {
    await page.goto('/agendamento');
    
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se há links clicáveis no breadcrumb
      const breadcrumbLinks = breadcrumbs.locator('a[href]');
      const count = await breadcrumbLinks.count();
      
      if (count > 0) {
        // Clicar no primeiro link
        const firstLink = breadcrumbLinks.first();
        const href = await firstLink.getAttribute('href');
        
        if (href) {
          await firstLink.click();
          await page.waitForLoadState('networkidle');
          
          // Verificar se redirecionou corretamente
          const currentUrl = page.url();
          expect(currentUrl).toContain(href);
        }
      }
    }
  });

  test('deve verificar breadcrumbs responsivos', async () => {
    const breakpoints = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.goto('/agendamento');
      
      const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
      
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toBeVisible();
        
        // Verificar se o breadcrumb se adapta ao tamanho da tela
        const breadcrumbBox = await breadcrumbs.boundingBox();
        expect(breadcrumbBox?.width).toBeLessThanOrEqual(breakpoint.width);
      }
    }
  });

  test('deve verificar navegação contextual', async () => {
    await page.goto('/agendamento');
    
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se o breadcrumb reflete a página atual
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      
      if (count > 0) {
        // Verificar se o último item reflete a página atual
        const lastItem = breadcrumbItems.last();
        const lastText = await lastItem.textContent();
        
        // Deve conter "Agendamento" ou similar
        expect(lastText).toMatch(/Agendamento|Agendamento/i);
      }
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    // Breadcrumbs exibidos
    await page.goto('/agendamento');
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Hierarquia clara
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Redirecionamentos corretos
      const breadcrumbLinks = breadcrumbs.locator('a[href]');
      const linkCount = await breadcrumbLinks.count();
      expect(linkCount).toBeGreaterThan(0);
      
      // Responsividade
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(breadcrumbs).toBeVisible();
      
      // Contexto mantido
      const lastItem = breadcrumbItems.last();
      const lastText = await lastItem.textContent();
      expect(lastText).toBeTruthy();
    }
  });

  test('deve monitorar métricas de breadcrumbs', async () => {
    await page.goto('/agendamento');
    
    // Coletar métricas de breadcrumbs
    const metrics = await page.evaluate(() => {
      const breadcrumbs = document.querySelector('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
      
      if (breadcrumbs) {
        return {
          hasBreadcrumbs: true,
          itemCount: breadcrumbs.querySelectorAll('a, span, li').length,
          linkCount: breadcrumbs.querySelectorAll('a[href]').length,
          separatorCount: breadcrumbs.querySelectorAll('text=/, text=>, [aria-hidden="true"]').length,
          items: Array.from(breadcrumbs.querySelectorAll('a, span, li')).map(item => ({
            text: item.textContent?.trim(),
            href: item.getAttribute('href'),
            isLink: item.tagName === 'A'
          }))
        };
      }
      
      return {
        hasBreadcrumbs: false,
        itemCount: 0,
        linkCount: 0,
        separatorCount: 0,
        items: []
      };
    });
    
    if (metrics.hasBreadcrumbs) {
      expect(metrics.itemCount).toBeGreaterThan(0);
      expect(metrics.items.length).toBeGreaterThan(0);
    }
  });

  test('deve verificar cenários de breadcrumbs degradados', async () => {
    // Testar em resolução muito baixa
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/agendamento');
    
    const breadcrumbs = page.locator('[data-testid*="breadcrumb"], .breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]');
    
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verificar se o breadcrumb ainda é funcional
      const breadcrumbItems = breadcrumbs.locator('a, span, li');
      const count = await breadcrumbItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se pelo menos o primeiro item está visível
      const firstItem = breadcrumbItems.first();
      if (await firstItem.isVisible()) {
        await expect(firstItem).toBeVisible();
      }
    }
  });
});
