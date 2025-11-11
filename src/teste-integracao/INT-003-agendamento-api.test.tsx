import { test, expect } from '@playwright/test';

test.describe('INT-003 - Agendamento via API', () => {
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

    // Interceptar requisições da API de agendamento
    await page.route('**/api/appointments', async (route) => {
      const request = route.request();
      const authHeader = request.headers()['authorization'];
      const postData = request.postDataJSON();
      
      // Verificar autenticação
      if (authHeader && authHeader.includes('Bearer')) {
        // Verificar dados do agendamento
        if (postData.paciente_id && postData.medico_id && postData.data && postData.hora) {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              message: 'Agendamento realizado com sucesso',
              appointment: {
                id: 123,
                date: postData.data,
                time: postData.hora,
                status: 'agendada'
              }
            })
          });
        } else {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              message: 'Dados inválidos'
            })
          });
        }
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Token de autenticação inválido'
          })
        });
      }
    });
  });

  test('deve realizar agendamento com sucesso', async ({ page }) => {
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Selecionar data
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-15"]');
    
    // Selecionar médico
    await page.click('[data-testid="doctor-select"]');
    await page.click('[data-testid="doctor-option-2"]');
    
    // Selecionar horário
    await page.click('[data-testid="time-slot-14:30"]');
    
    // Adicionar observações
    await page.fill('[data-testid="observations-input"]', 'Consulta de rotina');
    
    // Monitorar requisição
    const requestPromise = page.waitForRequest('**/api/appointments');
    const responsePromise = page.waitForResponse('**/api/appointments');
    
    // Clicar em "Confirmar Agendamento"
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // Verificar requisição POST autenticada
    expect(request.method()).toBe('POST');
    expect(request.url()).toContain('/api/appointments');
    
    // Verificar header de autorização
    const authHeader = request.headers()['authorization'];
    expect(authHeader).toContain('Bearer');
    
    // Verificar payload
    const postData = request.postDataJSON();
    expect(postData.paciente_id).toBe(1);
    expect(postData.medico_id).toBe(2);
    expect(postData.data).toBe('2024-01-15');
    expect(postData.hora).toBe('14:30');
    expect(postData.tipo).toBe('consulta');
    expect(postData.observacoes).toBe('Consulta de rotina');
    
    // Verificar resposta da API
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.message).toBe('Agendamento realizado com sucesso');
    expect(responseData.appointment.id).toBe(123);
    expect(responseData.appointment.status).toBe('agendada');
    
    // Verificar tela de confirmação
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Agendamento realizado com sucesso');
    await expect(page.locator('[data-testid="appointment-id"]')).toContainText('123');
  });

  test('deve tratar erro 400 - Dados inválidos', async ({ page }) => {
    // Interceptar com erro 400
    await page.route('**/api/appointments', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Dados inválidos'
        })
      });
    });
    
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Tentar agendar sem selecionar médico
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-15"]');
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/appointments');
    expect(response.status()).toBe(400);
    
    // Verificar mensagem de erro
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Dados inválidos');
  });

  test('deve tratar erro 409 - Horário já ocupado', async ({ page }) => {
    // Interceptar com erro 409
    await page.route('**/api/appointments', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Horário já ocupado'
        })
      });
    });
    
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Preencher dados do agendamento
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-15"]');
    await page.click('[data-testid="doctor-select"]');
    await page.click('[data-testid="doctor-option-2"]');
    await page.click('[data-testid="time-slot-14:30"]');
    
    // Tentar agendar
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/appointments');
    expect(response.status()).toBe(409);
    
    // Verificar mensagem de erro
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Horário já ocupado');
  });

  test('deve tratar erro 422 - Validação falhou', async ({ page }) => {
    // Interceptar com erro 422
    await page.route('**/api/appointments', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Validação falhou',
          errors: {
            data: ['Data deve ser futura'],
            hora: ['Horário inválido']
          }
        })
      });
    });
    
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Preencher dados inválidos
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-01"]'); // Data passada
    await page.click('[data-testid="doctor-select"]');
    await page.click('[data-testid="doctor-option-2"]');
    await page.click('[data-testid="time-slot-14:30"]');
    
    // Tentar agendar
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/appointments');
    expect(response.status()).toBe(422);
    
    // Verificar mensagens de validação
    await expect(page.locator('[data-testid="validation-error-data"]')).toContainText('Data deve ser futura');
    await expect(page.locator('[data-testid="validation-error-hora"]')).toContainText('Horário inválido');
  });

  test('deve tratar erro 500 - Erro no servidor', async ({ page }) => {
    // Interceptar com erro 500
    await page.route('**/api/appointments', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Erro interno do servidor'
        })
      });
    });
    
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Preencher dados do agendamento
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-15"]');
    await page.click('[data-testid="doctor-select"]');
    await page.click('[data-testid="doctor-option-2"]');
    await page.click('[data-testid="time-slot-14:30"]');
    
    // Tentar agendar
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/appointments');
    expect(response.status()).toBe(500);
    
    // Verificar mensagem de erro
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Erro interno do servidor');
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Tentar agendar sem preencher campos obrigatórios
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Verificar validações
    await expect(page.locator('[data-testid="date-error"]')).toContainText('Data é obrigatória');
    await expect(page.locator('[data-testid="doctor-error"]')).toContainText('Médico é obrigatório');
    await expect(page.locator('[data-testid="time-error"]')).toContainText('Horário é obrigatório');
    
    // Verificar que não houve requisição
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/appointments')) {
        requests.push(request.url());
      }
    });
    
    await page.waitForTimeout(1000);
    expect(requests).toHaveLength(0);
  });

  test('deve verificar performance do agendamento', async ({ page }) => {
    const startTime = Date.now();
    
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Preencher dados do agendamento
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-15"]');
    await page.click('[data-testid="doctor-select"]');
    await page.click('[data-testid="doctor-option-2"]');
    await page.click('[data-testid="time-slot-14:30"]');
    
    // Monitorar tempo de resposta
    const requestPromise = page.waitForRequest('**/api/appointments');
    const responsePromise = page.waitForResponse('**/api/appointments');
    
    // Confirmar agendamento
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Aguardar requisição e resposta
    await requestPromise;
    const response = await responsePromise;
    const endTime = Date.now();
    
    // Verificar tempo de resposta (deve ser menor que 3 segundos)
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(3000);
    
    // Verificar status da resposta
    expect(response.status()).toBe(201);
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    // Acessar página de agendamento
    await page.goto('/agendamento');
    
    // Preencher dados do agendamento
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-2024-01-15"]');
    await page.click('[data-testid="doctor-select"]');
    await page.click('[data-testid="doctor-option-2"]');
    await page.click('[data-testid="time-slot-14:30"]');
    await page.fill('[data-testid="observations-input"]', 'Consulta de rotina');
    
    // Monitorar requisição
    const requestPromise = page.waitForRequest('**/api/appointments');
    const responsePromise = page.waitForResponse('**/api/appointments');
    
    // Confirmar agendamento
    await page.click('[data-testid="confirm-appointment-button"]');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // ✅ Requisição autenticada
    expect(request.method()).toBe('POST');
    const authHeader = request.headers()['authorization'];
    expect(authHeader).toContain('Bearer');
    
    // ✅ Payload correto
    const postData = request.postDataJSON();
    expect(postData.paciente_id).toBe(1);
    expect(postData.medico_id).toBe(2);
    expect(postData.data).toBe('2024-01-15');
    expect(postData.hora).toBe('14:30');
    
    // ✅ Resposta da API válida
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.appointment).toBeDefined();
    
    // ✅ Agendamento salvo
    expect(responseData.appointment.id).toBe(123);
    expect(responseData.appointment.status).toBe('agendada');
    
    // ✅ Confirmação exibida
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Agendamento realizado com sucesso');
  });
});
