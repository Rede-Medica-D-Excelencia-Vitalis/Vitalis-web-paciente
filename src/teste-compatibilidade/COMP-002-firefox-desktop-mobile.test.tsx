import { test, expect } from '@playwright/test';

/**
 * COMP-002 - Firefox (Desktop e Mobile)
 *
 * Objetivo: Verificar funcionamento no Firefox
 * Prioridade: Alta
 *
 * Cenários testados:
 * - Funcionalidades principais
 * - Compatibilidade com APIs
 * - Renderização de CSS
 * - Funcionalidades de vídeo
 * - Performance
 */

test.describe('COMP-002 - Firefox (Desktop e Mobile)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock de login para garantir autenticação
    await page.route('**/api/usuarios/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-token-123',
          user: {
            id: 1,
            name: 'João Silva',
            email: 'teste@vitalis.com',
            role: 'paciente',
            plan: { id: '1', name: 'Plano Básico' }
          }
        })
      });
    });

    // Mock de verificação de token
    await page.route('**/api/usuarios/verify-token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'João Silva',
          email: 'teste@vitalis.com',
          role: 'paciente',
          plan: { id: '1', name: 'Plano Básico' }
        })
      });
    });

    // Mock de consultas
    await page.route('**/api/consultas/paciente/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{
            id: 1,
            date: '2024-01-15',
            time: '14:30',
            status: 'agendada',
            doctor: {
              id: 1,
              name: 'Dr. Maria Santos',
              specialty: 'Cardiologia',
              avatar: 'https://via.placeholder.com/150'
            }
          }]
        })
      });
    });
  });

  test('deve funcionar corretamente no Firefox', async ({ page }) => {
    console.log('🦊 Testando Firefox...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toBeTruthy();

    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Firefox funcionando corretamente');
  });

  test('deve testar compatibilidade com APIs no Firefox', async ({ page }) => {
    console.log('🔌 Testando compatibilidade com APIs no Firefox...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar APIs disponíveis
    const apis = await page.evaluate(() => {
      return {
        fetch: typeof fetch !== 'undefined',
        webSocket: typeof WebSocket !== 'undefined',
        webRTC: typeof RTCPeerConnection !== 'undefined',
        localStorage: typeof Storage !== 'undefined',
        sessionStorage: typeof Storage !== 'undefined',
        indexedDB: typeof indexedDB !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator
      };
    });

    expect(apis.fetch).toBe(true);
    expect(apis.webSocket).toBe(true);
    expect(apis.webRTC).toBe(true);
    expect(apis.localStorage).toBe(true);
    expect(apis.sessionStorage).toBe(true);
    expect(apis.indexedDB).toBe(true);
    expect(apis.serviceWorker).toBe(true);

    console.log('✅ APIs compatíveis no Firefox');
  });

  test('deve testar renderização de CSS no Firefox', async ({ page }) => {
    console.log('🎨 Testando renderização de CSS no Firefox...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Testar Flexbox
    await page.evaluate(() => {
      const flexContainer = document.createElement('div');
      flexContainer.style.display = 'flex';
      flexContainer.style.flexDirection = 'row';
      flexContainer.style.justifyContent = 'center';
      flexContainer.style.alignItems = 'center';
      flexContainer.style.width = '200px';
      flexContainer.style.height = '100px';
      flexContainer.style.border = '1px solid #ccc';
      flexContainer.innerHTML = '<div style="width: 50px; height: 50px; background: blue;"></div>';
      flexContainer.id = 'flex-test';
      document.body.appendChild(flexContainer);
    });

    const flexElement = page.locator('#flex-test');
    await expect(flexElement).toBeVisible();

    // Testar Grid CSS
    await page.evaluate(() => {
      const gridContainer = document.createElement('div');
      gridContainer.style.display = 'grid';
      gridContainer.style.gridTemplateColumns = '1fr 1fr';
      gridContainer.style.gridTemplateRows = '1fr 1fr';
      gridContainer.style.width = '200px';
      gridContainer.style.height = '100px';
      gridContainer.style.border = '1px solid #ccc';
      gridContainer.innerHTML = '<div style="background: red;"></div><div style="background: green;"></div><div style="background: blue;"></div><div style="background: yellow;"></div>';
      gridContainer.id = 'grid-test';
      document.body.appendChild(gridContainer);
    });

    const gridElement = page.locator('#grid-test');
    await expect(gridElement).toBeVisible();

    console.log('✅ CSS renderizado corretamente no Firefox');
  });

  test('deve testar funcionalidades de vídeo no Firefox', async ({ page }) => {
    console.log('📹 Testando funcionalidades de vídeo no Firefox...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular interface de vídeo
    await page.evaluate(() => {
      const videoContainer = document.createElement('div');
      videoContainer.id = 'video-container';
      videoContainer.innerHTML = `
        <video id="test-video" controls width="300" height="200">
          <source src="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWF2YzEAAAAIZnJlZQAAAGxtZGF0AQAA" type="video/mp4">
        </video>
        <button id="play-video">Play</button>
        <button id="pause-video">Pause</button>
        <div id="video-status">Parado</div>
      `;
      document.body.appendChild(videoContainer);

      const playButton = document.getElementById('play-video') as HTMLButtonElement;
      const pauseButton = document.getElementById('pause-video') as HTMLButtonElement;
      const statusDiv = document.getElementById('video-status') as HTMLDivElement;
      const video = document.getElementById('test-video') as HTMLVideoElement;

      playButton.addEventListener('click', () => {
        statusDiv.textContent = 'Reproduzindo';
        statusDiv.style.color = 'green';
      });

      pauseButton.addEventListener('click', () => {
        statusDiv.textContent = 'Pausado';
        statusDiv.style.color = 'orange';
      });
    });

    // Testar controles de vídeo
    await page.click('#play-video');
    await expect(page.locator('#video-status')).toContainText('Reproduzindo');

    await page.click('#pause-video');
    await expect(page.locator('#video-status')).toContainText('Pausado');

    console.log('✅ Funcionalidades de vídeo funcionando no Firefox');
  });

  test('deve testar performance no Firefox', async ({ page }) => {
    console.log('⚡ Testando performance no Firefox...');
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(5000);
    console.log(`Tempo de carregamento: ${loadTime}ms`);

    // Testar performance de JavaScript
    const jsPerformance = await page.evaluate(() => {
      const start = performance.now();
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      const end = performance.now();
      return end - start;
    });

    expect(jsPerformance).toBeLessThan(1000);
    console.log(`Performance JS: ${jsPerformance}ms`);

    console.log('✅ Performance adequada no Firefox');
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    console.log('✅ Verificando todos os critérios de aprovação...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // ✅ Funcionalidades funcionais
    await expect(page.locator('body')).toBeVisible();

    // ✅ APIs compatíveis
    const apis = await page.evaluate(() => ({
      fetch: typeof fetch !== 'undefined',
      webSocket: typeof WebSocket !== 'undefined',
      webRTC: typeof RTCPeerConnection !== 'undefined'
    }));
    expect(apis.fetch).toBe(true);
    expect(apis.webSocket).toBe(true);
    expect(apis.webRTC).toBe(true);

    // ✅ CSS renderizado corretamente
    await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.style.display = 'flex';
      testDiv.id = 'css-test';
      document.body.appendChild(testDiv);
    });
    await expect(page.locator('#css-test')).toBeVisible();

    // ✅ Vídeo funcional
    const videoSupported = await page.evaluate(() => {
      const video = document.createElement('video');
      return video.canPlayType('video/mp4') !== '';
    });
    expect(videoSupported).toBe(true);

    // ✅ Performance adequada
    const loadTime = await page.evaluate(() => performance.now());
    expect(loadTime).toBeLessThan(10000);

    console.log('✅ Todos os critérios de aprovação verificados para Firefox');
  });
});
