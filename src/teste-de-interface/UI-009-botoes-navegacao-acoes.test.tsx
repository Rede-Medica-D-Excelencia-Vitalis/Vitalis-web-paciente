import { test, expect, Page } from '@playwright/test';

test.describe('UI-009 - Botões de Navegação e Ações', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar botões de ação principal', async () => {
    // Verificar se há botões de ação principal
    const primaryButtons = page.locator('button[type="submit"], .btn-primary, [data-testid*="primary-button"], button:has-text("Entrar"), button:has-text("Cadastrar"), button:has-text("Confirmar")');
    const count = await primaryButtons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões estão visíveis e habilitados
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = primaryButtons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    }
  });

  test('deve verificar botões de navegação', async () => {
    // Verificar se há botões de navegação
    const navButtons = page.locator('button:has-text("Voltar"), button:has-text("Próximo"), button:has-text("Cancelar"), [data-testid*="nav-button"], .btn-nav');
    const count = await navButtons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões estão visíveis e habilitados
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = navButtons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    }
  });

  test('deve verificar botões de filtro e busca', async () => {
    // Verificar se há botões de filtro e busca
    const filterButtons = page.locator('button:has-text("Filtrar"), button:has-text("Buscar"), button:has-text("Pesquisar"), [data-testid*="filter-button"], [data-testid*="search-button"], .btn-filter, .btn-search');
    const count = await filterButtons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões estão visíveis e habilitados
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = filterButtons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    }
  });

  test('deve verificar botões de toggle', async () => {
    // Verificar se há botões de toggle
    const toggleButtons = page.locator('button[aria-label*="menu"], button[aria-label*="chat"], button[aria-label*="tela cheia"], [data-testid*="toggle-button"], .btn-toggle');
    const count = await toggleButtons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões estão visíveis e habilitados
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = toggleButtons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    }
  });

  test('deve verificar botões de ação secundária', async () => {
    // Verificar se há botões de ação secundária
    const secondaryButtons = page.locator('button:has-text("Cancelar"), button:has-text("Voltar"), button:has-text("Fechar"), [data-testid*="secondary-button"], .btn-secondary');
    const count = await secondaryButtons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões estão visíveis e habilitados
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = secondaryButtons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    }
  });

  test('deve verificar feedback visual claro', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões têm feedback visual
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Verificar se o botão tem estilos visuais
        const styles = await button.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            border: computedStyle.border,
            borderRadius: computedStyle.borderRadius,
            padding: computedStyle.padding
          };
        });
        
        expect(styles.backgroundColor).toBeTruthy();
        expect(styles.color).toBeTruthy();
      }
    }
  });

  test('deve verificar estados visuais distintos', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar estados dos botões
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Verificar estado normal
        await expect(button).toBeVisible();
        
        // Verificar se o botão não está desabilitado por padrão
        const isDisabled = await button.isDisabled();
        expect(isDisabled).toBe(false);
        
        // Verificar se o botão tem cursor pointer
        const cursor = await button.evaluate((el) => window.getComputedStyle(el).cursor);
        expect(cursor).toBe('pointer');
      }
    }
  });

  test('deve verificar ações executadas corretamente', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Testar cliques nos botões
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Verificar se o botão é clicável
        await expect(button).toBeEnabled();
        
        // Clicar no botão
        await button.click();
        
        // Verificar se não houve erro
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    }
  });

  test('deve verificar acessibilidade via teclado', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões são acessíveis via teclado
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Verificar se o botão tem tabindex
        const tabIndex = await button.getAttribute('tabindex');
        expect(tabIndex).toBeTruthy();
        
        // Verificar se o botão tem aria-label ou texto
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        expect(ariaLabel || text).toBeTruthy();
      }
    }
  });

  test('deve verificar consistência visual', async () => {
    // Verificar se há botões na página
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões têm estilos consistentes
    const buttonStyles = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const styles = await button.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            border: computedStyle.border,
            borderRadius: computedStyle.borderRadius,
            padding: computedStyle.padding,
            fontSize: computedStyle.fontSize,
            fontFamily: computedStyle.fontFamily
          };
        });
        buttonStyles.push(styles);
      }
    }
    
    // Verificar se há consistência nos estilos
    if (buttonStyles.length > 1) {
      const firstStyle = buttonStyles[0];
      for (let i = 1; i < buttonStyles.length; i++) {
        const style = buttonStyles[i];
        // Verificar se os estilos são similares (não exatamente iguais, mas consistentes)
        expect(style.fontFamily).toBe(firstStyle.fontFamily);
        expect(style.fontSize).toBe(firstStyle.fontSize);
      }
    }
  });

  test('deve verificar botões em diferentes resoluções', async () => {
    const breakpoints = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(100);
      
      // Verificar se há botões na página
      const buttons = page.locator('button, [role="button"], input[type="button"]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se os botões estão visíveis
      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          await expect(button).toBeVisible();
          
          // Verificar se o botão tem tamanho adequado para touch
          const box = await button.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    // Feedback visual
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Estados distintos
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    }
    
    // Ações corretas
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    }
    
    // Acessibilidade
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        expect(ariaLabel || text).toBeTruthy();
      }
    }
    
    // Consistência
    const buttonStyles = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const styles = await button.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            fontFamily: computedStyle.fontFamily,
            fontSize: computedStyle.fontSize
          };
        });
        buttonStyles.push(styles);
      }
    }
    
    if (buttonStyles.length > 1) {
      const firstStyle = buttonStyles[0];
      for (let i = 1; i < buttonStyles.length; i++) {
        const style = buttonStyles[i];
        expect(style.fontFamily).toBe(firstStyle.fontFamily);
        expect(style.fontSize).toBe(firstStyle.fontSize);
      }
    }
  });

  test('deve monitorar métricas de botões', async () => {
    // Coletar métricas de botões
    const metrics = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, [role="button"], input[type="button"]');
      
      return {
        buttonCount: buttons.length,
        primaryButtonCount: document.querySelectorAll('button[type="submit"], .btn-primary, [data-testid*="primary-button"]').length,
        navButtonCount: document.querySelectorAll('button:has-text("Voltar"), button:has-text("Próximo"), button:has-text("Cancelar")').length,
        filterButtonCount: document.querySelectorAll('button:has-text("Filtrar"), button:has-text("Buscar"), button:has-text("Pesquisar")').length,
        toggleButtonCount: document.querySelectorAll('button[aria-label*="menu"], button[aria-label*="chat"], button[aria-label*="tela cheia"]').length,
        secondaryButtonCount: document.querySelectorAll('button:has-text("Cancelar"), button:has-text("Voltar"), button:has-text("Fechar"), .btn-secondary').length,
        accessibleButtonCount: Array.from(buttons).filter(button => {
          const ariaLabel = button.getAttribute('aria-label');
          const text = button.textContent?.trim();
          return !!(ariaLabel || text);
        }).length,
        enabledButtonCount: Array.from(buttons).filter(button => !button.disabled).length
      };
    });
    
    expect(metrics.buttonCount).toBeGreaterThan(0);
    expect(metrics.accessibleButtonCount).toBeGreaterThan(0);
    expect(metrics.enabledButtonCount).toBeGreaterThan(0);
  });

  test('deve verificar cenários de botões degradados', async () => {
    // Testar em resolução muito baixa
    await page.setViewportSize({ width: 320, height: 568 });
    
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os botões ainda são funcionais
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
        
        // Verificar se o botão tem tamanho adequado para touch
        const box = await button.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});
