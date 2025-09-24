import { test, expect } from '@playwright/test';

test.describe('INT-009 - Validação de Dados da API', () => {
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

  test('deve validar dados de consultas com campos obrigatórios', async ({ page }) => {
    // Interceptar com dados inválidos (faltando campos obrigatórios)
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              // date faltando
              time: '14:30',
              status: 'agendada',
              doctor: {
                name: 'Dr. Maria Santos'
                // specialty faltando
              }
            },
            {
              id: 2,
              date: '2024-01-20',
              time: '10:00',
              status: 'confirmada',
              doctor: {
                name: 'Dr. João Oliveira',
                specialty: 'Dermatologia'
              }
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que apenas a consulta válida é exibida
    await expect(page.locator('[data-testid="consultation-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="consultation-card"]')).toContainText('Dr. João Oliveira');
    
    // Verificar que a consulta inválida foi ignorada
    await expect(page.locator('[data-testid="consultation-card"]')).not.toContainText('Dr. Maria Santos');
  });

  test('deve sanitizar dados HTML/XSS', async ({ page }) => {
    // Interceptar com dados contendo HTML/XSS
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              date: '2024-01-15',
              time: '14:30',
              status: 'agendada',
              doctor: {
                name: 'Dr. <script>alert("XSS")</script>Maria Santos',
                specialty: 'Cardiologia'
              },
              notes: '<img src="x" onerror="alert(\'XSS\')">Observações'
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que o HTML foi sanitizado
    const doctorName = await page.textContent('[data-testid="doctor-name"]');
    expect(doctorName).not.toContain('<script>');
    expect(doctorName).not.toContain('alert');
    
    // Verificar que as observações foram sanitizadas
    const notes = await page.textContent('[data-testid="consultation-notes"]');
    expect(notes).not.toContain('<img');
    expect(notes).not.toContain('onerror');
    
    // Verificar que o texto foi exibido corretamente
    expect(doctorName).toContain('Dr. Maria Santos');
    expect(notes).toContain('Observações');
  });

  test('deve converter tipos de dados adequadamente', async ({ page }) => {
    // Interceptar com tipos incorretos
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: '1', // String em vez de number
              date: '2024-01-15',
              time: '14:30',
              status: 'agendada',
              doctor: {
                id: '2', // String em vez de number
                name: 'Dr. Maria Santos',
                specialty: 'Cardiologia'
              },
              price: '150.50', // String em vez de number
              duration: '30' // String em vez de number
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que os tipos foram convertidos
    const consultationId = await page.getAttribute('[data-testid="consultation-card"]', 'data-id');
    expect(consultationId).toBe('1'); // Mantido como string para exibição
    
    const price = await page.textContent('[data-testid="consultation-price"]');
    expect(price).toContain('R$ 150,50'); // Convertido para formato monetário
    
    const duration = await page.textContent('[data-testid="consultation-duration"]');
    expect(duration).toContain('30 min'); // Convertido para formato de tempo
  });

  test('deve tratar campos obrigatórios ausentes', async ({ page }) => {
    // Interceptar com dados incompletos
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              date: '2024-01-15',
              time: '14:30',
              status: 'agendada',
              doctor: {
                name: 'Dr. Maria Santos'
                // specialty ausente
              }
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que campos ausentes têm valores padrão
    await expect(page.locator('[data-testid="doctor-specialty"]')).toContainText('Não especificado');
    
    // Verificar que a consulta ainda é exibida
    await expect(page.locator('[data-testid="consultation-card"]')).toHaveCount(1);
  });

  test('deve validar formato de datas', async ({ page }) => {
    // Interceptar com datas em formatos inválidos
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              date: '15/01/2024', // Formato inválido
              time: '14:30',
              status: 'agendada',
              doctor: {
                name: 'Dr. Maria Santos',
                specialty: 'Cardiologia'
              }
            },
            {
              id: 2,
              date: '2024-01-20', // Formato válido
              time: '10:00',
              status: 'confirmada',
              doctor: {
                name: 'Dr. João Oliveira',
                specialty: 'Dermatologia'
              }
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que apenas a consulta com data válida é exibida
    await expect(page.locator('[data-testid="consultation-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="consultation-card"]')).toContainText('Dr. João Oliveira');
  });

  test('deve tratar arrays vazios ou nulos', async ({ page }) => {
    // Interceptar com array vazio
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [] // Array vazio
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar mensagem de "nenhuma consulta"
    await expect(page.locator('[data-testid="no-consultations-message"]')).toContainText('Nenhuma consulta encontrada');
    
    // Verificar que não há cards de consulta
    await expect(page.locator('[data-testid="consultation-card"]')).toHaveCount(0);
  });

  test('deve tratar objetos aninhados inválidos', async ({ page }) => {
    // Interceptar com objeto aninhado inválido
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              date: '2024-01-15',
              time: '14:30',
              status: 'agendada',
              doctor: null // Objeto nulo
            },
            {
              id: 2,
              date: '2024-01-20',
              time: '10:00',
              status: 'confirmada',
              doctor: {
                name: 'Dr. João Oliveira',
                specialty: 'Dermatologia'
              }
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que apenas a consulta com médico válido é exibida
    await expect(page.locator('[data-testid="consultation-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="consultation-card"]')).toContainText('Dr. João Oliveira');
  });

  test('deve validar limites de caracteres', async ({ page }) => {
    // Interceptar com dados muito longos
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              date: '2024-01-15',
              time: '14:30',
              status: 'agendada',
              doctor: {
                name: 'A'.repeat(1000), // Nome muito longo
                specialty: 'Cardiologia'
              },
              notes: 'B'.repeat(5000) // Observações muito longas
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar que o nome foi truncado
    const doctorName = await page.textContent('[data-testid="doctor-name"]');
    expect(doctorName!.length).toBeLessThanOrEqual(100);
    
    // Verificar que as observações foram truncadas
    const notes = await page.textContent('[data-testid="consultation-notes"]');
    expect(notes!.length).toBeLessThanOrEqual(500);
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    // Interceptar com dados mistos (válidos e inválidos)
    await page.route('**/api/consultations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              date: '2024-01-15',
              time: '14:30',
              status: 'agendada',
              doctor: {
                name: 'Dr. <script>alert("XSS")</script>Maria Santos',
                specialty: 'Cardiologia'
              }
            },
            {
              id: 2,
              // date ausente
              time: '10:00',
              status: 'confirmada',
              doctor: {
                name: 'Dr. João Oliveira',
                specialty: 'Dermatologia'
              }
            }
          ]
        })
      });
    });
    
    // Acessar dashboard
    await page.goto('/dashboard');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // ✅ Validação robusta
    await expect(page.locator('[data-testid="consultation-card"]')).toHaveCount(1);
    
    // ✅ Sanitização adequada
    const doctorName = await page.textContent('[data-testid="doctor-name"]');
    expect(doctorName).not.toContain('<script>');
    expect(doctorName).toContain('Dr. Maria Santos');
    
    // ✅ Conversão de tipos
    const consultationId = await page.getAttribute('[data-testid="consultation-card"]', 'data-id');
    expect(consultationId).toBe('1');
    
    // ✅ Fallback funcional
    await expect(page.locator('[data-testid="consultation-card"]')).toContainText('Dr. Maria Santos');
    
    // ✅ Segurança mantida
    expect(doctorName).not.toContain('alert');
  });
});
