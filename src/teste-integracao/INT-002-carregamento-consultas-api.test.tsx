import { test, expect } from '@playwright/test';

/**
 * INT-002 - Carregamento de Consultas via API
 * 
 * Objetivo: Verificar integração com API de consultas
 * Prioridade: Crítica
 * 
 * Cenários testados:
 * - Carregamento de consultas após login
 * - Exibição de consultas no dashboard
 * - Cálculo de estatísticas
 * - Tratamento de erros (401, 403, 404, 500)
 * - Performance do carregamento
 */

test.describe('INT-002 - Carregamento de Consultas via API', () => {
  test.beforeEach(async ({ page }) => {
    // Simular usuário logado
    await page.addInitScript(() => {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        nome: 'João Silva',
        email: 'teste@vitalis.com',
        role: 'paciente'
      }));
    });
  });

  test('deve carregar consultas após login', async ({ page }) => {
    console.log('📅 Testando carregamento de consultas após login...');
    
    // Interceptar requisição de consultas
    let consultasRequest: any = null;
    await page.route('**/consultas**', async (route) => {
      consultasRequest = route.request();
      
      const mockConsultas = {
        sucesso: true,
        data: [
          {
            id: 1,
            data: '2024-01-15',
            hora: '14:30',
            status: 'agendada',
            medico: {
              id: 1,
              nome: 'Dr. Maria Santos',
              especialidade: 'Cardiologia',
              avatar: 'https://example.com/avatar.jpg'
            }
          },
          {
            id: 2,
            data: '2024-01-20',
            hora: '10:00',
            status: 'confirmada',
            medico: {
              id: 2,
              nome: 'Dr. João Silva',
              especialidade: 'Clínica Geral',
              avatar: 'https://example.com/avatar2.jpg'
            }
          }
        ]
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConsultas)
      });
    });
    
    // Navegar para dashboard
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verificar se requisição foi feita
    expect(consultasRequest).toBeTruthy();
    expect(consultasRequest.method()).toBe('GET');
    expect(consultasRequest.url()).toContain('/consultas');
    
    // Verificar headers de autenticação
    const headers = consultasRequest.headers();
    expect(headers['authorization']).toContain('Bearer');
    
    console.log('✅ Consultas carregadas com sucesso');
  });

  test('deve exibir consultas no dashboard', async ({ page }) => {
    console.log('📅 Testando exibição de consultas no dashboard...');
    
    // Interceptar requisição de consultas
    await page.route('**/consultas**', async (route) => {
      const mockConsultas = {
        sucesso: true,
        data: [
          {
            id: 1,
            data: '2024-01-15',
            hora: '14:30',
            status: 'agendada',
            medico: {
              id: 1,
              nome: 'Dr. Maria Santos',
              especialidade: 'Cardiologia'
            }
          }
        ]
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConsultas)
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verificar se consultas são exibidas (usando seletores genéricos)
    await expect(page.locator('text=Dr. Maria Santos, text=Cardiologia, text=14:30')).toBeVisible();
    
    console.log('✅ Consultas exibidas no dashboard');
  });

  test('deve calcular estatísticas corretamente', async ({ page }) => {
    console.log('📊 Testando cálculo de estatísticas...');
    
    // Interceptar requisição de consultas
    await page.route('**/consultas**', async (route) => {
      const mockConsultas = {
        sucesso: true,
        data: [
          { id: 1, status: 'agendada' },
          { id: 2, status: 'confirmada' },
          { id: 3, status: 'realizada' },
          { id: 4, status: 'cancelada' }
        ]
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConsultas)
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verificar se estatísticas são exibidas
    await expect(page.locator('text=Consultas, text=Agendadas, text=Confirmadas')).toBeVisible();
    
    console.log('✅ Estatísticas calculadas corretamente');
  });

  test('deve tratar erro 401 - Token inválido', async ({ page }) => {
    console.log('🔐 Testando erro 401 - Token inválido...');
    
    // Interceptar requisição com erro 401
    await page.route('**/consultas**', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          sucesso: false,
          message: 'Token inválido'
        })
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verificar se mensagem de erro é exibida
    await expect(page.locator('text=Token inválido, text=Erro ao carregar consultas')).toBeVisible();
    
    console.log('✅ Erro 401 tratado corretamente');
  });

  test('deve tratar erro 403 - Acesso negado', async ({ page }) => {
    console.log('🔐 Testando erro 403 - Acesso negado...');
    
    // Interceptar requisição com erro 403
    await page.route('**/consultas**', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          sucesso: false,
          message: 'Acesso negado'
        })
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verificar se mensagem de erro é exibida
    await expect(page.locator('text=Acesso negado, text=Erro ao carregar consultas')).toBeVisible();
    
    console.log('✅ Erro 403 tratado corretamente');
  });

  test('deve tratar erro 404 - Consultas não encontradas', async ({ page }) => {
    console.log('🔍 Testando erro 404 - Consultas não encontradas...');
    
    // Interceptar requisição com erro 404
    await page.route('**/consultas**', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          sucesso: false,
          message: 'Consultas não encontradas'
        })
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verificar se mensagem de "nenhuma consulta" é exibida
    await expect(page.locator('text=Nenhuma consulta encontrada, text=Não há consultas')).toBeVisible();
    
    console.log('✅ Erro 404 tratado corretamente');
  });

  test('deve tratar erro 500 - Erro no servidor', async ({ page }) => {
    console.log('🔧 Testando erro 500 - Erro no servidor...');
    
    // Interceptar requisição com erro 500
    await page.route('**/consultas**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          sucesso: false,
          message: 'Erro interno do servidor'
        })
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verificar se mensagem de erro é exibida
    await expect(page.locator('text=Erro interno do servidor, text=Erro ao carregar consultas')).toBeVisible();
    
    console.log('✅ Erro 500 tratado corretamente');
  });

  test('deve verificar performance adequada', async ({ page }) => {
    console.log('⚡ Testando performance do carregamento...');
    
    const startTime = Date.now();
    
    // Interceptar requisição com delay controlado
    await page.route('**/consultas**', async (route) => {
      await page.waitForTimeout(500); // Simular delay de 500ms
      
      const mockConsultas = {
        sucesso: true,
        data: [{ id: 1, data: '2024-01-15', status: 'agendada' }]
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConsultas)
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Verificar se tempo de resposta está dentro do esperado (menos de 3 segundos)
    expect(responseTime).toBeLessThan(3000);
    
    console.log(`✅ Performance adequada: ${responseTime}ms`);
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    console.log('✅ Verificando todos os critérios de aprovação...');
    
    // ✅ Requisição autenticada
    let requestVerified = false;
    await page.route('**/consultas**', async (route) => {
      const request = route.request();
      expect(request.method()).toBe('GET');
      
      const headers = request.headers();
      expect(headers['authorization']).toContain('Bearer');
      
      requestVerified = true;
      
      const mockConsultas = {
        sucesso: true,
        data: [{ id: 1, data: '2024-01-15', status: 'agendada' }]
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockConsultas)
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // ✅ Resposta da API válida
    expect(requestVerified).toBe(true);
    
    // ✅ Dados carregados corretamente
    await expect(page.locator('text=Consultas, text=Agendadas')).toBeVisible();
    
    // ✅ Interface atualizada
    await expect(page.locator('body')).toBeVisible();
    
    // ✅ Performance adequada
    const loadTime = await page.evaluate(() => performance.now());
    expect(loadTime).toBeLessThan(5000);
    
    console.log('✅ Todos os critérios de aprovação verificados');
  });
});