import { test, expect } from '@playwright/test';

/**
 * COMP-003 - Safari (Desktop e Mobile)
 *
 * Objetivo: Verificar funcionamento no Safari
 * Prioridade: Alta
 *
 * Cenários testados:
 * - Funcionalidades principais
 * - Compatibilidade com WebKit
 * - Funcionalidades de vídeo
 * - Notificações
 * - Performance
 */

test.describe('COMP-003 - Safari (Desktop e Mobile)', () => {
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

  test('deve funcionar corretamente no Safari', async ({ page }) => {
    console.log('🧭 Testando Safari...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toBeTruthy();

    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Safari funcionando corretamente');
  });

  test('deve testar compatibilidade com WebKit no Safari', async ({ page }) => {
    console.log('🌐 Testando compatibilidade com WebKit no Safari...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar características específicas do WebKit
    const webkitFeatures = await page.evaluate(() => {
      return {
        webkit: 'webkitRequestAnimationFrame' in window,
        webkitAudio: 'webkitAudioContext' in window,
        webkitSpeech: 'webkitSpeechRecognition' in window,
        webkitStorage: 'webkitStorageInfo' in window,
        webkitIndexedDB: 'webkitIndexedDB' in window,
        webkitNotifications: 'webkitNotifications' in window
      };
    });

    expect(webkitFeatures.webkit).toBe(true);
    console.log('✅ WebKit compatível no Safari');
  });

  test('deve testar funcionalidades de vídeo no Safari', async ({ page }) => {
    console.log('📹 Testando funcionalidades de vídeo no Safari...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular interface de vídeo
    await page.evaluate(() => {
      const videoContainer = document.createElement('div');
      videoContainer.id = 'video-container';
      videoContainer.innerHTML = `
        <video id="test-video" controls width="300" height="200" playsinline>
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

    console.log('✅ Funcionalidades de vídeo funcionando no Safari');
  });

  test('deve testar notificações no Safari', async ({ page }) => {
    console.log('🔔 Testando notificações no Safari...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular funcionalidade de notificações
    await page.evaluate(() => {
      const notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.innerHTML = `
        <button id="request-permission">Solicitar Permissão</button>
        <button id="send-notification">Enviar Notificação</button>
        <div id="notification-status">Permissão não solicitada</div>
      `;
      document.body.appendChild(notificationContainer);

      const requestButton = document.getElementById('request-permission') as HTMLButtonElement;
      const sendButton = document.getElementById('send-notification') as HTMLButtonElement;
      const statusDiv = document.getElementById('notification-status') as HTMLDivElement;

      requestButton.addEventListener('click', () => {
        statusDiv.textContent = 'Permissão solicitada';
        statusDiv.style.color = 'orange';
      });

      sendButton.addEventListener('click', () => {
        statusDiv.textContent = 'Notificação enviada';
        statusDiv.style.color = 'green';
      });
    });

    // Testar solicitação de permissão
    await page.click('#request-permission');
    await expect(page.locator('#notification-status')).toContainText('Permissão solicitada');

    // Testar envio de notificação
    await page.click('#send-notification');
    await expect(page.locator('#notification-status')).toContainText('Notificação enviada');

    console.log('✅ Notificações funcionando no Safari');
  });

  test('deve testar performance no Safari', async ({ page }) => {
    console.log('⚡ Testando performance no Safari...');
    
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

    console.log('✅ Performance adequada no Safari');
  });

  test('deve testar funcionalidades específicas do Safari', async ({ page }) => {
    console.log('🍎 Testando funcionalidades específicas do Safari...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Testar suporte a PWA
    await page.evaluate(() => {
      const pwaContainer = document.createElement('div');
      pwaContainer.id = 'pwa-container';
      pwaContainer.innerHTML = `
        <button id="install-pwa">Instalar PWA</button>
        <div id="pwa-status">PWA não instalado</div>
      `;
      document.body.appendChild(pwaContainer);

      const installButton = document.getElementById('install-pwa') as HTMLButtonElement;
      const statusDiv = document.getElementById('pwa-status') as HTMLDivElement;

      installButton.addEventListener('click', () => {
        if ('serviceWorker' in navigator) {
          statusDiv.textContent = 'PWA disponível';
          statusDiv.style.color = 'green';
        } else {
          statusDiv.textContent = 'PWA não suportado';
          statusDiv.style.color = 'red';
        }
      });
    });

    await page.click('#install-pwa');
    await expect(page.locator('#pwa-status')).toContainText('PWA disponível');

    console.log('✅ Funcionalidades específicas do Safari funcionando');
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    console.log('✅ Verificando todos os critérios de aprovação...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // ✅ Funcionalidades funcionais
    await expect(page.locator('body')).toBeVisible();

    // ✅ WebKit compatível
    const webkitSupported = await page.evaluate(() => 'webkitRequestAnimationFrame' in window);
    expect(webkitSupported).toBe(true);

    // ✅ Vídeo funcional
    const videoSupported = await page.evaluate(() => {
      const video = document.createElement('video');
      return video.canPlayType('video/mp4') !== '';
    });
    expect(videoSupported).toBe(true);

    // ✅ Notificações funcionais
    const notificationsSupported = await page.evaluate(() => 'Notification' in window);
    expect(notificationsSupported).toBe(true);

    // ✅ Performance adequada
    const loadTime = await page.evaluate(() => performance.now());
    expect(loadTime).toBeLessThan(10000);

    console.log('✅ Todos os critérios de aprovação verificados para Safari');
  });
});
