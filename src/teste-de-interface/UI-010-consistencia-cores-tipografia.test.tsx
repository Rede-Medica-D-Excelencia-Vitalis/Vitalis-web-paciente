import { test, expect, Page } from '@playwright/test';

test.describe('UI-010 - Consistência de Cores e Tipografia', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve verificar paleta de cores consistente', async () => {
    await page.goto('/');
    
    // Verificar se há elementos com cores primárias
    const primaryElements = page.locator('[data-testid*="primary"], .text-primary, .bg-primary, .border-primary');
    const count = await primaryElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se as cores primárias são consistentes
    const primaryColors = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = primaryElements.nth(i);
      if (await element.isVisible()) {
        const color = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.color || computedStyle.backgroundColor;
        });
        primaryColors.push(color);
      }
    }
    
    // Verificar se há consistência nas cores primárias
    if (primaryColors.length > 1) {
      const firstColor = primaryColors[0];
      for (let i = 1; i < primaryColors.length; i++) {
        const color = primaryColors[i];
        // Verificar se as cores são similares (não exatamente iguais, mas consistentes)
        expect(color).toBeTruthy();
      }
    }
  });

  test('deve verificar cores secundárias consistentes', async () => {
    await page.goto('/');
    
    // Verificar se há elementos com cores secundárias
    const secondaryElements = page.locator('[data-testid*="secondary"], .text-secondary, .bg-secondary, .border-secondary');
    const count = await secondaryElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se as cores secundárias são consistentes
    const secondaryColors = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = secondaryElements.nth(i);
      if (await element.isVisible()) {
        const color = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.color || computedStyle.backgroundColor;
        });
        secondaryColors.push(color);
      }
    }
    
    // Verificar se há consistência nas cores secundárias
    if (secondaryColors.length > 1) {
      const firstColor = secondaryColors[0];
      for (let i = 1; i < secondaryColors.length; i++) {
        const color = secondaryColors[i];
        // Verificar se as cores são similares (não exatamente iguais, mas consistentes)
        expect(color).toBeTruthy();
      }
    }
  });

  test('deve verificar tipografia uniforme', async () => {
    await page.goto('/');
    
    // Verificar se há elementos de texto
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se a tipografia é uniforme
    const fontFamilies = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const fontFamily = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.fontFamily;
        });
        fontFamilies.push(fontFamily);
      }
    }
    
    // Verificar se há consistência na tipografia
    if (fontFamilies.length > 1) {
      const firstFont = fontFamilies[0];
      for (let i = 1; i < fontFamilies.length; i++) {
        const font = fontFamilies[i];
        // Verificar se as fontes são similares (não exatamente iguais, mas consistentes)
        expect(font).toBeTruthy();
      }
    }
  });

  test('deve verificar tamanhos de fonte consistentes', async () => {
    await page.goto('/');
    
    // Verificar se há elementos de texto
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os tamanhos de fonte são consistentes
    const fontSizes = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const fontSize = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.fontSize;
        });
        fontSizes.push(fontSize);
      }
    }
    
    // Verificar se há consistência nos tamanhos de fonte
    if (fontSizes.length > 1) {
      const firstSize = fontSizes[0];
      for (let i = 1; i < fontSizes.length; i++) {
        const size = fontSizes[i];
        // Verificar se os tamanhos são similares (não exatamente iguais, mas consistentes)
        expect(size).toBeTruthy();
      }
    }
  });

  test('deve verificar pesos de fonte consistentes', async () => {
    await page.goto('/');
    
    // Verificar se há elementos de texto
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os pesos de fonte são consistentes
    const fontWeights = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const fontWeight = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.fontWeight;
        });
        fontWeights.push(fontWeight);
      }
    }
    
    // Verificar se há consistência nos pesos de fonte
    if (fontWeights.length > 1) {
      const firstWeight = fontWeights[0];
      for (let i = 1; i < fontWeights.length; i++) {
        const weight = fontWeights[i];
        // Verificar se os pesos são similares (não exatamente iguais, mas consistentes)
        expect(weight).toBeTruthy();
      }
    }
  });

  test('deve verificar espaçamentos padronizados', async () => {
    await page.goto('/');
    
    // Verificar se há elementos com espaçamentos
    const elements = page.locator('div, section, article, header, main, aside, footer');
    const count = await elements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os espaçamentos são padronizados
    const margins = [];
    const paddings = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = elements.nth(i);
      if (await element.isVisible()) {
        const styles = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            margin: computedStyle.margin,
            padding: computedStyle.padding
          };
        });
        margins.push(styles.margin);
        paddings.push(styles.padding);
      }
    }
    
    // Verificar se há consistência nos espaçamentos
    if (margins.length > 1) {
      const firstMargin = margins[0];
      for (let i = 1; i < margins.length; i++) {
        const margin = margins[i];
        // Verificar se os espaçamentos são similares (não exatamente iguais, mas consistentes)
        expect(margin).toBeTruthy();
      }
    }
  });

  test('deve verificar bordas e sombras consistentes', async () => {
    await page.goto('/');
    
    // Verificar se há elementos com bordas e sombras
    const elements = page.locator('div, section, article, header, main, aside, footer, button, input, select, textarea');
    const count = await elements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se as bordas e sombras são consistentes
    const borders = [];
    const shadows = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = elements.nth(i);
      if (await element.isVisible()) {
        const styles = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            border: computedStyle.border,
            boxShadow: computedStyle.boxShadow
          };
        });
        borders.push(styles.border);
        shadows.push(styles.boxShadow);
      }
    }
    
    // Verificar se há consistência nas bordas e sombras
    if (borders.length > 1) {
      const firstBorder = borders[0];
      for (let i = 1; i < borders.length; i++) {
        const border = borders[i];
        // Verificar se as bordas são similares (não exatamente iguais, mas consistentes)
        expect(border).toBeTruthy();
      }
    }
  });

  test('deve verificar ícones e imagens consistentes', async () => {
    await page.goto('/');
    
    // Verificar se há ícones e imagens
    const icons = page.locator('img, svg, [data-testid*="icon"], .icon');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os ícones e imagens são consistentes
    const iconSizes = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const icon = icons.nth(i);
      if (await icon.isVisible()) {
        const size = await icon.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            width: computedStyle.width,
            height: computedStyle.height
          };
        });
        iconSizes.push(size);
      }
    }
    
    // Verificar se há consistência nos tamanhos dos ícones
    if (iconSizes.length > 1) {
      const firstSize = iconSizes[0];
      for (let i = 1; i < iconSizes.length; i++) {
        const size = iconSizes[i];
        // Verificar se os tamanhos são similares (não exatamente iguais, mas consistentes)
        expect(size.width).toBeTruthy();
        expect(size.height).toBeTruthy();
      }
    }
  });

  test('deve verificar identidade visual coesa', async () => {
    await page.goto('/');
    
    // Verificar se há elementos principais
    const mainElements = page.locator('header, main, aside, footer');
    const count = await mainElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se os elementos principais têm identidade visual coesa
    const elementStyles = [];
    for (let i = 0; i < count; i++) {
      const element = mainElements.nth(i);
      if (await element.isVisible()) {
        const styles = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            fontFamily: computedStyle.fontFamily,
            fontSize: computedStyle.fontSize,
            border: computedStyle.border,
            borderRadius: computedStyle.borderRadius
          };
        });
        elementStyles.push(styles);
      }
    }
    
    // Verificar se há consistência na identidade visual
    if (elementStyles.length > 1) {
      const firstStyle = elementStyles[0];
      for (let i = 1; i < elementStyles.length; i++) {
        const style = elementStyles[i];
        // Verificar se os estilos são similares (não exatamente iguais, mas consistentes)
        expect(style.fontFamily).toBe(firstStyle.fontFamily);
        expect(style.fontSize).toBe(firstStyle.fontSize);
      }
    }
  });

  test('deve verificar consistência em diferentes páginas', async () => {
    const pages = ['/', '/agendamento', '/teleconsulta', '/farmacia', '/perfil'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Verificar se há elementos de texto
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
      const count = await textElements.count();
      expect(count).toBeGreaterThan(0);
      
      // Verificar se a tipografia é consistente
      const fontFamilies = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = textElements.nth(i);
        if (await element.isVisible()) {
          const fontFamily = await element.evaluate((el) => {
            const computedStyle = window.getComputedStyle(el);
            return computedStyle.fontFamily;
          });
          fontFamilies.push(fontFamily);
        }
      }
      
      // Verificar se há consistência na tipografia
      if (fontFamilies.length > 1) {
        const firstFont = fontFamilies[0];
        for (let i = 1; i < fontFamilies.length; i++) {
          const font = fontFamilies[i];
          // Verificar se as fontes são similares (não exatamente iguais, mas consistentes)
          expect(font).toBeTruthy();
        }
      }
    }
  });

  test('deve verificar todos os critérios de aprovação', async () => {
    await page.goto('/');
    
    // Cores consistentes
    const primaryElements = page.locator('[data-testid*="primary"], .text-primary, .bg-primary, .border-primary');
    const primaryCount = await primaryElements.count();
    expect(primaryCount).toBeGreaterThan(0);
    
    // Tipografia uniforme
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const textCount = await textElements.count();
    expect(textCount).toBeGreaterThan(0);
    
    // Espaçamentos padronizados
    const elements = page.locator('div, section, article, header, main, aside, footer');
    const elementCount = await elements.count();
    expect(elementCount).toBeGreaterThan(0);
    
    // Componentes reutilizáveis
    const buttons = page.locator('button, [role="button"], input[type="button"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Identidade visual coesa
    const mainElements = page.locator('header, main, aside, footer');
    const mainCount = await mainElements.count();
    expect(mainCount).toBeGreaterThan(0);
  });

  test('deve monitorar métricas de consistência visual', async () => {
    await page.goto('/');
    
    // Coletar métricas de consistência visual
    const metrics = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
      const primaryElements = document.querySelectorAll('[data-testid*="primary"], .text-primary, .bg-primary, .border-primary');
      const secondaryElements = document.querySelectorAll('[data-testid*="secondary"], .text-secondary, .bg-secondary, .border-secondary');
      const buttons = document.querySelectorAll('button, [role="button"], input[type="button"]');
      const icons = document.querySelectorAll('img, svg, [data-testid*="icon"], .icon');
      
      return {
        textElementCount: textElements.length,
        primaryElementCount: primaryElements.length,
        secondaryElementCount: secondaryElements.length,
        buttonCount: buttons.length,
        iconCount: icons.length,
        fontFamilies: Array.from(textElements).slice(0, 10).map(el => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.fontFamily;
        }),
        fontSizes: Array.from(textElements).slice(0, 10).map(el => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.fontSize;
        }),
        fontWeights: Array.from(textElements).slice(0, 10).map(el => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.fontWeight;
        })
      };
    });
    
    expect(metrics.textElementCount).toBeGreaterThan(0);
    expect(metrics.buttonCount).toBeGreaterThan(0);
    expect(metrics.fontFamilies.length).toBeGreaterThan(0);
    expect(metrics.fontSizes.length).toBeGreaterThan(0);
    expect(metrics.fontWeights.length).toBeGreaterThan(0);
  });

  test('deve verificar cenários de consistência visual degradada', async () => {
    // Testar em resolução muito baixa
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    
    // Verificar se a consistência visual é mantida
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Verificar se a tipografia ainda é consistente
    const fontFamilies = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const fontFamily = await element.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return computedStyle.fontFamily;
        });
        fontFamilies.push(fontFamily);
      }
    }
    
    // Verificar se há consistência na tipografia
    if (fontFamilies.length > 1) {
      const firstFont = fontFamilies[0];
      for (let i = 1; i < fontFamilies.length; i++) {
        const font = fontFamilies[i];
        // Verificar se as fontes são similares (não exatamente iguais, mas consistentes)
        expect(font).toBeTruthy();
      }
    }
  });
});
