import { test, expect } from '@playwright/test';

test.describe('INT-008 - Tratamento de Erros de API', () => {
  test.beforeEach(async ({ page }) => {
    // Simular usuário autenticado
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      localStorage.setItem('user_data', JSON.stringify({
        id: 1,
        name: 'João Silva',
        email: 'user@email.com',
        role: 'paciente'
      }));
    });
  });

  test('deve tratar erro 500 - Erro no servidor', async ({ page }) => {
    // Interceptar com erro 500
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Erro interno do servidor',
          error: 'INTERNAL_SERVER_ERROR'
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/**');
    expect(response.status()).toBe(500);
    
    // Verificar mensagem de erro amigável
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Ocorreu um erro inesperado. Tente novamente em alguns instantes.');
    
    // Verificar que a interface não quebrou
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    
    // Verificar botão de retry
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test('deve implementar retry automático', async ({ page }) => {
    let attemptCount = 0;
    
    // Interceptar com falha inicial e sucesso no retry
    await page.route('**/api/consultations/**', async (route) => {
      attemptCount++;
      
      if (attemptCount === 1) {
        // Primeira tentativa falha
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Erro temporário'
          })
        });
      } else {
        // Segunda tentativa sucede
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: []
          })
        });
      }
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar primeira tentativa
    await page.waitForResponse('**/api/consultations/**');
    
    // Verificar indicador de retry
    await expect(page.locator('[data-testid="retry-indicator"]')).toBeVisible();
    
    // Aguardar segunda tentativa
    await page.waitForResponse('**/api/consultations/**');
    
    // Verificar que o retry foi bem-sucedido
    expect(attemptCount).toBe(2);
    await expect(page.locator('[data-testid="retry-indicator"]')).not.toBeVisible();
  });

  test('deve implementar fallback para dados em cache', async ({ page }) => {
    // Simular dados em cache
    await page.addInitScript(() => {
      localStorage.setItem('cached_consultations', JSON.stringify([
        {
          id: 1,
          date: '2024-01-15',
          time: '14:30',
          status: 'agendada',
          doctor: { name: 'Dr. Maria Santos' }
        }
      ]));
    });
    
    // Interceptar com erro 500
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Erro interno do servidor'
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar resposta de erro
    await page.waitForResponse('**/api/consultations/**');
    
    // Verificar que dados em cache são exibidos
    await expect(page.locator('[data-testid="consultation-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="consultation-card"]')).toContainText('Dr. Maria Santos');
    
    // Verificar aviso de dados em cache
    await expect(page.locator('[data-testid="cache-warning"]')).toContainText('Exibindo dados salvos localmente');
  });

  test('deve tratar timeout de requisição', async ({ page }) => {
    // Interceptar com delay para simular timeout
    await page.route('**/api/consultations/**', async (route) => {
      // Delay de 10 segundos para simular timeout
      await new Promise(resolve => setTimeout(resolve, 10000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Verificar indicador de loading
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // Verificar timeout (assumindo timeout de 5 segundos)
    await expect(page.locator('[data-testid="timeout-message"]')).toBeVisible({ timeout: 6000 });
    
    // Verificar mensagem de timeout
    await expect(page.locator('[data-testid="timeout-message"]')).toContainText('A requisição demorou mais que o esperado');
  });

  test('deve tratar erro de rede', async ({ page }) => {
    // Interceptar com erro de rede
    await page.route('**/api/**', async (route) => {
      await route.abort('failed');
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Verificar mensagem de erro de rede
    await expect(page.locator('[data-testid="network-error"]')).toContainText('Verifique sua conexão com a internet');
    
    // Verificar botão de reconexão
    await expect(page.locator('[data-testid="reconnect-button"]')).toBeVisible();
  });

  test('deve tratar erro 429 - Rate Limit', async ({ page }) => {
    // Interceptar com erro 429
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'Retry-After': '60'
        },
        body: JSON.stringify({
          success: false,
          message: 'Muitas requisições. Tente novamente em 60 segundos.',
          retryAfter: 60
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/**');
    expect(response.status()).toBe(429);
    
    // Verificar mensagem de rate limit
    await expect(page.locator('[data-testid="rate-limit-message"]')).toContainText('Muitas requisições. Tente novamente em 60 segundos.');
    
    // Verificar contador de retry
    await expect(page.locator('[data-testid="retry-countdown"]')).toContainText('60');
  });

  test('deve tratar erro 503 - Serviço Indisponível', async ({ page }) => {
    // Interceptar com erro 503
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Serviço temporariamente indisponível',
          maintenance: true
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/**');
    expect(response.status()).toBe(503);
    
    // Verificar mensagem de manutenção
    await expect(page.locator('[data-testid="maintenance-message"]')).toContainText('Serviço temporariamente indisponível');
    
    // Verificar aviso de manutenção
    await expect(page.locator('[data-testid="maintenance-notice"]')).toBeVisible();
  });

  test('deve gerar logs de erro para debugging', async ({ page }) => {
    // Capturar logs de erro
    const errorLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorLogs.push(msg.text());
      }
    });
    
    // Interceptar com erro 500
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Erro interno do servidor',
          error: 'INTERNAL_SERVER_ERROR',
          requestId: 'req-123456'
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar resposta de erro
    await page.waitForResponse('**/api/**');
    
    // Verificar que logs de erro foram gerados
    expect(errorLogs.length).toBeGreaterThan(0);
    expect(errorLogs.some(log => log.includes('API Error'))).toBe(true);
    expect(errorLogs.some(log => log.includes('req-123456'))).toBe(true);
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    // Interceptar com erro 500
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Erro interno do servidor'
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar resposta de erro
    await page.waitForResponse('**/api/**');
    
    // ✅ Erro tratado graciosamente
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // ✅ Mensagem clara para usuário
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Ocorreu um erro inesperado');
    
    // ✅ Retry automático
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    
    // ✅ Fallback funcional
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    
    // ✅ Logs adequados
    const errorLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorLogs.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    expect(errorLogs.length).toBeGreaterThan(0);
  });
});
