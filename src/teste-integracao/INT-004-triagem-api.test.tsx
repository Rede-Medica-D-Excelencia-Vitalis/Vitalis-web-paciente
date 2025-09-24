import { test, expect } from '@playwright/test';

test.describe('INT-004 - Triagem via API', () => {
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

    // Interceptar requisições da API de triagem
    await page.route('**/api/triagem/save', async (route) => {
      const request = route.request();
      const authHeader = request.headers()['authorization'];
      const postData = request.postDataJSON();
      
      // Verificar autenticação
      if (authHeader && authHeader.includes('Bearer')) {
        // Verificar dados da triagem
        if (postData.paciente_id && postData.sintomas && postData.nivel_risco) {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              message: 'Triagem salva com sucesso',
              triagem_id: 456
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

  test('deve salvar triagem com sucesso', async ({ page }) => {
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Completar questionário de triagem
    await page.click('[data-testid="symptom-febre"]');
    await page.click('[data-testid="symptom-dor-cabeca"]');
    await page.click('[data-testid="symptom-nausea"]');
    
    // Responder perguntas adicionais
    await page.click('[data-testid="question-1-option-sim"]');
    await page.click('[data-testid="question-2-option-nao"]');
    await page.click('[data-testid="question-3-option-sim"]');
    
    // Aguardar análise da IA
    await page.waitForSelector('[data-testid="ai-analysis-complete"]');
    
    // Verificar resultado da análise
    await expect(page.locator('[data-testid="risk-level"]')).toContainText('Moderado');
    await expect(page.locator('[data-testid="recommended-specialties"]')).toContainText('Clínica Geral');
    await expect(page.locator('[data-testid="recommendations"]')).toContainText('Recomenda-se consulta em 24h');
    
    // Monitorar requisição de salvamento
    const requestPromise = page.waitForRequest('**/api/triagem/save');
    const responsePromise = page.waitForResponse('**/api/triagem/save');
    
    // Clicar em "Salvar Triagem"
    await page.click('[data-testid="save-triage-button"]');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // Verificar requisição POST autenticada
    expect(request.method()).toBe('POST');
    expect(request.url()).toContain('/api/triagem/save');
    
    // Verificar header de autorização
    const authHeader = request.headers()['authorization'];
    expect(authHeader).toContain('Bearer');
    
    // Verificar payload
    const postData = request.postDataJSON();
    expect(postData.paciente_id).toBe(1);
    expect(postData.sintomas).toContain('febre');
    expect(postData.sintomas).toContain('dor de cabeça');
    expect(postData.sintomas).toContain('náusea');
    expect(postData.nivel_risco).toBe('moderado');
    expect(postData.especialidades_recomendadas).toContain('clínica geral');
    expect(postData.observacoes).toContain('Recomenda-se consulta em 24h');
    expect(postData.perguntas_respostas).toHaveLength(3);
    
    // Verificar resposta da API
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.message).toBe('Triagem salva com sucesso');
    expect(responseData.triagem_id).toBe(456);
    
    // Verificar resultado exibido ao usuário
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Triagem salva com sucesso');
    await expect(page.locator('[data-testid="triage-id"]')).toContainText('456');
  });

  test('deve tratar erro 400 - Dados inválidos', async ({ page }) => {
    // Interceptar com erro 400
    await page.route('**/api/triagem/save', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Dados inválidos'
        })
      });
    });
    
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Tentar salvar triagem incompleta
    await page.click('[data-testid="save-triage-button"]');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/triagem/save');
    expect(response.status()).toBe(400);
    
    // Verificar mensagem de erro
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Dados inválidos');
  });

  test('deve tratar erro 422 - Validação falhou', async ({ page }) => {
    // Interceptar com erro 422
    await page.route('**/api/triagem/save', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Validação falhou',
          errors: {
            sintomas: ['Pelo menos um sintoma deve ser selecionado'],
            nivel_risco: ['Nível de risco é obrigatório']
          }
        })
      });
    });
    
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Completar triagem com dados inválidos
    await page.click('[data-testid="save-triage-button"]');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/triagem/save');
    expect(response.status()).toBe(422);
    
    // Verificar mensagens de validação
    await expect(page.locator('[data-testid="validation-error-sintomas"]')).toContainText('Pelo menos um sintoma deve ser selecionado');
    await expect(page.locator('[data-testid="validation-error-nivel-risco"]')).toContainText('Nível de risco é obrigatório');
  });

  test('deve tratar erro 500 - Erro no servidor', async ({ page }) => {
    // Interceptar com erro 500
    await page.route('**/api/triagem/save', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Erro interno do servidor'
        })
      });
    });
    
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Completar triagem
    await page.click('[data-testid="symptom-febre"]');
    await page.click('[data-testid="question-1-option-sim"]');
    await page.waitForSelector('[data-testid="ai-analysis-complete"]');
    
    // Tentar salvar
    await page.click('[data-testid="save-triage-button"]');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/triagem/save');
    expect(response.status()).toBe(500);
    
    // Verificar mensagem de erro
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Erro interno do servidor');
  });

  test('deve validar sintomas obrigatórios', async ({ page }) => {
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Tentar salvar sem selecionar sintomas
    await page.click('[data-testid="save-triage-button"]');
    
    // Verificar validação
    await expect(page.locator('[data-testid="symptoms-error"]')).toContainText('Selecione pelo menos um sintoma');
    
    // Verificar que não houve requisição
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/triagem/save')) {
        requests.push(request.url());
      }
    });
    
    await page.waitForTimeout(1000);
    expect(requests).toHaveLength(0);
  });

  test('deve verificar análise da IA', async ({ page }) => {
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Completar questionário
    await page.click('[data-testid="symptom-febre"]');
    await page.click('[data-testid="symptom-dor-cabeca"]');
    await page.click('[data-testid="question-1-option-sim"]');
    await page.click('[data-testid="question-2-option-nao"]');
    
    // Verificar indicador de análise
    await expect(page.locator('[data-testid="ai-analyzing"]')).toBeVisible();
    
    // Aguardar conclusão da análise
    await page.waitForSelector('[data-testid="ai-analysis-complete"]');
    
    // Verificar resultado da análise
    await expect(page.locator('[data-testid="risk-level"]')).toBeVisible();
    await expect(page.locator('[data-testid="recommended-specialties"]')).toBeVisible();
    await expect(page.locator('[data-testid="recommendations"]')).toBeVisible();
  });

  test('deve verificar performance da triagem', async ({ page }) => {
    const startTime = Date.now();
    
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Completar triagem
    await page.click('[data-testid="symptom-febre"]');
    await page.click('[data-testid="symptom-dor-cabeca"]');
    await page.click('[data-testid="question-1-option-sim"]');
    await page.click('[data-testid="question-2-option-nao"]');
    
    // Aguardar análise da IA
    await page.waitForSelector('[data-testid="ai-analysis-complete"]');
    
    // Monitorar tempo de salvamento
    const requestPromise = page.waitForRequest('**/api/triagem/save');
    const responsePromise = page.waitForResponse('**/api/triagem/save');
    
    // Salvar triagem
    await page.click('[data-testid="save-triage-button"]');
    
    // Aguardar requisição e resposta
    await requestPromise;
    const response = await responsePromise;
    const endTime = Date.now();
    
    // Verificar tempo de resposta (deve ser menor que 5 segundos)
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(5000);
    
    // Verificar status da resposta
    expect(response.status()).toBe(201);
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    // Acessar página de triagem
    await page.goto('/triagem');
    
    // Completar triagem
    await page.click('[data-testid="symptom-febre"]');
    await page.click('[data-testid="symptom-dor-cabeca"]');
    await page.click('[data-testid="question-1-option-sim"]');
    await page.click('[data-testid="question-2-option-nao"]');
    
    // Aguardar análise da IA
    await page.waitForSelector('[data-testid="ai-analysis-complete"]');
    
    // Monitorar requisição
    const requestPromise = page.waitForRequest('**/api/triagem/save');
    const responsePromise = page.waitForResponse('**/api/triagem/save');
    
    // Salvar triagem
    await page.click('[data-testid="save-triage-button"]');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // ✅ Requisição autenticada
    expect(request.method()).toBe('POST');
    const authHeader = request.headers()['authorization'];
    expect(authHeader).toContain('Bearer');
    
    // ✅ Payload completo
    const postData = request.postDataJSON();
    expect(postData.paciente_id).toBe(1);
    expect(postData.sintomas).toBeDefined();
    expect(postData.nivel_risco).toBeDefined();
    expect(postData.especialidades_recomendadas).toBeDefined();
    expect(postData.perguntas_respostas).toBeDefined();
    
    // ✅ Resposta da API válida
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.triagem_id).toBeDefined();
    
    // ✅ Triagem salva
    expect(responseData.triagem_id).toBe(456);
    
    // ✅ Resultado exibido
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Triagem salva com sucesso');
  });
});
