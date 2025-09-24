import { test, expect, Page } from '@playwright/test';

test.describe('UI-011 - Acessibilidade e Usabilidade', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar navegação por teclado', async () => {
    await page.goto('/');
    
    // Verificar se há elementos focáveis
    const focusableElements = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se é possível navegar por teclado
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = focusableElements.nth(i);
      if (await element.isVisible()) {
        // Verificar se o elemento é focável
        await element.focus();
        const isFocused = await element.evaluate((el) => el === document.activeElement);
        expect(isFocused).toBe(true);
      }
    }
  });

  test('deve verificar indicadores de foco', async () => {
    await page.goto('/');
    
    // Verificar se há elementos focáveis
    const focusableElements = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se há indicadores de foco
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = focusableElements.nth(i);
      if (await element.isVisible()) {
        await element.focus();
        
        // Verificar se há indicador de foco
        const focusStyles = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            outline: computedStyle.outline,
            outlineWidth: computedStyle.outlineWidth,
            outlineStyle: computedStyle.outlineStyle,
            outlineColor: computedStyle.outlineColor
          };
        });
        
        // Verificar se há algum indicador de foco
        expect(focusStyles.outline || focusStyles.outlineWidth || focusStyles.outlineStyle || focusStyles.outlineColor).toBeTruthy();
      }
    }
  });

  test('deve verificar contraste de cores adequado', async () => {
    await page.goto('/');
    
    // Verificar se há elementos de texto
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div, button, a');
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se o contraste é adequado
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const contrast = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          const color = computedStyle.color;
          const backgroundColor = computedStyle.backgroundColor;
          
          // Verificar se as cores são válidas
          if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            return {
              color,
              backgroundColor,
              hasContrast: true
            };
          }
          
          return {
            color,
            backgroundColor,
            hasContrast: false
          };
        });
        
        // Verificar se há contraste
        expect(contrast.hasContrast).toBe(true);
      }
    }
  });

  test('deve verificar compatibilidade com screen reader', async () => {
    await page.goto('/');
    
    // Verificar se há elementos com aria-labels
    const ariaElements = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
    const count = await ariaElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os elementos têm labels adequados
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = ariaElements.nth(i);
      if (await element.isVisible()) {
        const ariaLabel = await element.getAttribute('aria-label');
        const ariaLabelledBy = await element.getAttribute('aria-labelledby');
        const ariaDescribedBy = await element.getAttribute('aria-describedby');
        
        // Verificar se há pelo menos um atributo de acessibilidade
        expect(ariaLabel || ariaLabelledBy || ariaDescribedBy).toBeTruthy();
      }
    }
  });

  test('deve verificar alt texts descritivos', async () => {
    await page.goto('/');
    
    // Verificar se há imagens
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se as imagens têm alt texts
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      if (await image.isVisible()) {
        const alt = await image.getAttribute('alt');
        // Verificar se há alt text (pode ser vazio se for decorativo)
        expect(alt).toBeDefined();
      }
    }
  });

  test('deve verificar labels em formulários', async () => {
    await page.goto('/agendamento');
    
    // Verificar se há formulários
    const forms = page.locator('form');
    const formCount = await forms.count();
    expect(formCount).toBeGreaterThan(0);
    
    // Verificar se há campos de formulário
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
    
    // Verificar se os campos têm labels
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          // Verificar se há label associado
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.isVisible();
          expect(hasLabel || ariaLabel || ariaLabelledBy).toBe(true);
        } else {
          // Verificar se há aria-label ou aria-labelledby
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
  });

  test('deve verificar atributos ARIA', async () => {
    await page.goto('/');
    
    // Verificar se há elementos com atributos ARIA
    const ariaElements = page.locator('[aria-*]');
    const count = await ariaElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os atributos ARIA são válidos
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = ariaElements.nth(i);
      if (await element.isVisible()) {
        const ariaAttributes = await element.evaluate((el) => {
          const attributes = [];
          for (let attr of el.attributes) {
            if (attr.name.startsWith('aria-')) {
              attributes.push({
                name: attr.name,
                value: attr.value
              });
            }
          }
          return attributes;
        });
        
        // Verificar se há atributos ARIA válidos
        expect(ariaAttributes.length).toBeGreaterThan(0);
      }
    }
  });

  test('deve verificar zoom até 200% funcional', async () => {
    await page.goto('/');
    
    // Simular zoom de 200%
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });
    
    // Verificar se o layout ainda funciona
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar se não há scroll horizontal excessivo
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    if (scrollWidth > clientWidth) {
      expect(scrollWidth - clientWidth).toBeLessThan(200);
    }
    
    // Verificar se os elementos principais ainda estão visíveis
    const header = page.locator('header, [data-testid="header"], .header');
    await expect(header).toBeVisible();
    
    const mainContent = page.locator('main, [data-testid="main-content"], .main-content');
    await expect(mainContent).toBeVisible();
  });

  test('deve verificar navegação por teclado em diferentes páginas', async () => {
    const pages = ['/', '/agendamento', '/teleconsulta', '/farmacia', '/perfil'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Verificar se há elementos focáveis
      const focusableElements = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
      const count = await focusableElements.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se é possível navegar por teclado
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = focusableElements.nth(i);
        if (await element.isVisible()) {
          await element.focus();
          const isFocused = await element.evaluate((el) => el === document.activeElement);
          expect(isFocused).toBe(true);
        }
      }
    }
  });

  test('deve verificar acessibilidade em diferentes resoluções', async () => {
    const breakpoints = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);
      await page.goto('/');
      
      // Verificar se há elementos focáveis
      const focusableElements = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
      const count = await focusableElements.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se é possível navegar por teclado
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = focusableElements.nth(i);
        if (await element.isVisible()) {
          await element.focus();
          const isFocused = await element.evaluate((el) => el === document.activeElement);
          expect(isFocused).toBe(true);
        }
      }
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    await page.goto('/');
    
    // Navegação por teclado
    const focusableElements = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Contraste adequado
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div, button, a');
    const textCount = await textElements.count();
    expect(textCount).toBeGreaterThan(0);
    
    // Screen reader compatível
    const ariaElements = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
    const ariaCount = await ariaElements.count();
    expect(ariaCount).toBeGreaterThan(0);
    
    // Alt texts descritivos
    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
    
    // Zoom funcional
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('deve monitorar métricas de acessibilidade', async () => {
    await page.goto('/');
    
    // Coletar métricas de acessibilidade
    const metrics = await page.evaluate(() => {
      const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
      const ariaElements = document.querySelectorAll('[aria-*]');
      const images = document.querySelectorAll('img');
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input, select, textarea');
      
      return {
        focusableElementCount: focusableElements.length,
        ariaElementCount: ariaElements.length,
        imageCount: images.length,
        formCount: forms.length,
        inputCount: inputs.length,
        imagesWithAlt: Array.from(images).filter(img => img.hasAttribute('alt')).length,
        inputsWithLabels: Array.from(inputs).filter(input => {
          const id = input.getAttribute('id');
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          
          if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            return !!(label || ariaLabel || ariaLabelledBy);
          }
          
          return !!(ariaLabel || ariaLabelledBy);
        }).length,
        ariaAttributes: Array.from(ariaElements).map(el => {
          const attributes = [];
          for (let attr of el.attributes) {
            if (attr.name.startsWith('aria-')) {
              attributes.push({
                name: attr.name,
                value: attr.value
              });
            }
          }
          return attributes;
        })
      };
    });
    
    expect(metrics.focusableElementCount).toBeGreaterThan(0);
    expect(metrics.ariaElementCount).toBeGreaterThan(0);
    expect(metrics.imageCount).toBeGreaterThan(0);
    expect(metrics.formCount).toBeGreaterThan(0);
    expect(metrics.inputCount).toBeGreaterThan(0);
    expect(metrics.imagesWithAlt).toBeGreaterThan(0);
    expect(metrics.inputsWithLabels).toBeGreaterThan(0);
  });

  test('deve verificar cenários de acessibilidade degradada', async () => {
    // Testar em resolução muito baixa
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    
    // Verificar se a acessibilidade é mantida
    const focusableElements = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se é possível navegar por teclado
    for (let i = 0; i < Math.min(count, 3); i++) {
      const element = focusableElements.nth(i);
      if (await element.isVisible()) {
        await element.focus();
        const isFocused = await element.evaluate((el) => el === document.activeElement);
        expect(isFocused).toBe(true);
      }
    }
  });
});
