import { test, expect } from '@playwright/test';

test.describe('INT-005 - Produtos da Farmácia via API', () => {
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

    // Interceptar requisições da API de produtos
    await page.route('**/api/pharmacy/products**', async (route) => {
      const request = route.request();
      const authHeader = request.headers()['authorization'];
      const url = new URL(request.url());
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      const page = url.searchParams.get('page') || '1';
      const limit = url.searchParams.get('limit') || '20';
      
      // Verificar autenticação
      if (authHeader && authHeader.includes('Bearer')) {
        // Simular dados de produtos
        const products = [
          {
            id: 1,
            name: 'Paracetamol 500mg',
            price: 15.90,
            originalPrice: 19.90,
            image: 'https://example.com/paracetamol.jpg',
            farmacia_nome: 'Farmácia Central',
            category: 'medicamentos',
            description: 'Analgésico e antitérmico'
          },
          {
            id: 2,
            name: 'Ibuprofeno 400mg',
            price: 12.50,
            originalPrice: 15.00,
            image: 'https://example.com/ibuprofeno.jpg',
            farmacia_nome: 'Farmácia Popular',
            category: 'medicamentos',
            description: 'Anti-inflamatório'
          },
          {
            id: 3,
            name: 'Vitamina C 1000mg',
            price: 25.00,
            originalPrice: 30.00,
            image: 'https://example.com/vitamina-c.jpg',
            farmacia_nome: 'Farmácia Saúde',
            category: 'suplementos',
            description: 'Suplemento vitamínico'
          }
        ];
        
        // Filtrar produtos por categoria e busca
        let filteredProducts = products;
        if (category) {
          filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        if (search) {
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        // Paginação
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: paginatedProducts,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: filteredProducts.length
            }
          })
        });
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

  test('deve carregar produtos da farmácia', async ({ page }) => {
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Monitorar requisição
    const requestPromise = page.waitForRequest('**/api/pharmacy/products**');
    const responsePromise = page.waitForResponse('**/api/pharmacy/products**');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // Verificar requisição GET autenticada
    expect(request.method()).toBe('GET');
    expect(request.url()).toContain('/api/pharmacy/products');
    
    // Verificar header de autorização
    const authHeader = request.headers()['authorization'];
    expect(authHeader).toContain('Bearer');
    
    // Verificar resposta da API
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.data).toHaveLength(3);
    expect(responseData.pagination).toBeDefined();
    
    // Verificar dados dos produtos
    expect(responseData.data[0].id).toBe(1);
    expect(responseData.data[0].name).toBe('Paracetamol 500mg');
    expect(responseData.data[0].price).toBe(15.90);
    expect(responseData.data[0].category).toBe('medicamentos');
  });

  test('deve exibir produtos na interface', async ({ page }) => {
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar se os produtos são exibidos
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3);
    
    // Verificar dados do primeiro produto
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct.locator('[data-testid="product-name"]')).toContainText('Paracetamol 500mg');
    await expect(firstProduct.locator('[data-testid="product-price"]')).toContainText('R$ 15,90');
    await expect(firstProduct.locator('[data-testid="product-original-price"]')).toContainText('R$ 19,90');
    await expect(firstProduct.locator('[data-testid="product-pharmacy"]')).toContainText('Farmácia Central');
    await expect(firstProduct.locator('[data-testid="product-category"]')).toContainText('Medicamentos');
  });

  test('deve filtrar produtos por categoria', async ({ page }) => {
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar carregamento inicial
    await page.waitForLoadState('networkidle');
    
    // Monitorar requisição de filtro
    const requestPromise = page.waitForRequest('**/api/pharmacy/products**');
    const responsePromise = page.waitForResponse('**/api/pharmacy/products**');
    
    // Filtrar por categoria "medicamentos"
    await page.click('[data-testid="category-filter-medicamentos"]');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // Verificar parâmetros da requisição
    const url = new URL(request.url());
    expect(url.searchParams.get('category')).toBe('medicamentos');
    
    // Verificar resposta filtrada
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    expect(responseData.data).toHaveLength(2); // Apenas medicamentos
    expect(responseData.data.every((p: any) => p.category === 'medicamentos')).toBe(true);
  });

  test('deve buscar produtos por nome', async ({ page }) => {
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar carregamento inicial
    await page.waitForLoadState('networkidle');
    
    // Monitorar requisição de busca
    const requestPromise = page.waitForRequest('**/api/pharmacy/products**');
    const responsePromise = page.waitForResponse('**/api/pharmacy/products**');
    
    // Buscar por "paracetamol"
    await page.fill('[data-testid="search-input"]', 'paracetamol');
    await page.click('[data-testid="search-button"]');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // Verificar parâmetros da requisição
    const url = new URL(request.url());
    expect(url.searchParams.get('search')).toBe('paracetamol');
    
    // Verificar resposta da busca
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    expect(responseData.data).toHaveLength(1);
    expect(responseData.data[0].name).toContain('Paracetamol');
  });

  test('deve implementar paginação', async ({ page }) => {
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar carregamento inicial
    await page.waitForLoadState('networkidle');
    
    // Verificar informações de paginação
    await expect(page.locator('[data-testid="pagination-info"]')).toContainText('Página 1 de 1');
    await expect(page.locator('[data-testid="total-products"]')).toContainText('3 produtos');
    
    // Verificar botões de paginação
    await expect(page.locator('[data-testid="prev-page-button"]')).toBeDisabled();
    await expect(page.locator('[data-testid="next-page-button"]')).toBeDisabled();
  });

  test('deve tratar erro 401 - Token inválido', async ({ page }) => {
    // Limpar token de autenticação
    await page.addInitScript(() => {
      localStorage.removeItem('auth_token');
    });
    
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/pharmacy/products**');
    expect(response.status()).toBe(401);
    
    // Verificar redirecionamento para login
    await expect(page).toHaveURL('/login');
  });

  test('deve tratar erro 404 - Produtos não encontrados', async ({ page }) => {
    // Interceptar com erro 404
    await page.route('**/api/pharmacy/products**', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Nenhum produto encontrado'
        })
      });
    });
    
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/pharmacy/products**');
    expect(response.status()).toBe(404);
    
    // Verificar mensagem de "nenhum produto"
    await expect(page.locator('[data-testid="no-products-message"]')).toContainText('Nenhum produto encontrado');
  });

  test('deve tratar erro 500 - Erro no servidor', async ({ page }) => {
    // Interceptar com erro 500
    await page.route('**/api/pharmacy/products**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Erro interno do servidor'
        })
      });
    });
    
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar resposta de erro
    const response = await page.waitForResponse('**/api/pharmacy/products**');
    expect(response.status()).toBe(500);
    
    // Verificar mensagem de erro
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Erro interno do servidor');
  });

  test('deve verificar performance do carregamento', async ({ page }) => {
    const startTime = Date.now();
    
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // Verificar que o carregamento foi rápido (menos de 3 segundos)
    expect(loadTime).toBeLessThan(3000);
    
    // Verificar que os produtos foram carregados
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3);
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    // Acessar farmácia online
    await page.goto('/farmacia');
    
    // Monitorar requisição
    const requestPromise = page.waitForRequest('**/api/pharmacy/products**');
    const responsePromise = page.waitForResponse('**/api/pharmacy/products**');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Aguardar requisição e resposta
    const request = await requestPromise;
    const response = await responsePromise;
    
    // ✅ Requisição autenticada
    expect(request.method()).toBe('GET');
    const authHeader = request.headers()['authorization'];
    expect(authHeader).toContain('Bearer');
    
    // ✅ Resposta da API válida
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.data).toBeDefined();
    expect(responseData.pagination).toBeDefined();
    
    // ✅ Produtos carregados
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3);
    
    // ✅ Busca funcional
    await page.fill('[data-testid="search-input"]', 'paracetamol');
    await page.click('[data-testid="search-button"]');
    await page.waitForLoadState('networkidle');
    
    // ✅ Paginação adequada
    await expect(page.locator('[data-testid="pagination-info"]')).toBeVisible();
  });
});
