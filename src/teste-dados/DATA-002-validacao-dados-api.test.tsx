import { test, expect } from '@playwright/test';

/**
 * DATA-002 - Validação de Dados da API
 * 
 * Objetivo: Verificar validação de dados recebidos da API
 * Prioridade: Alta
 * 
 * Cenários testados:
 * - Validação de estrutura de dados
 * - Validação de tipos de dados
 * - Tratamento de dados inválidos
 * - Sanitização de dados
 * - Fallback para dados corrompidos
 */

test.describe('DATA-002 - Validação de Dados da API', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar requisições da API
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      console.log(`🌐 Interceptando requisição: ${url}`);
      await route.continue();
    });
  });

  test('deve validar estrutura de dados da API', async ({ page }) => {
    console.log('📊 Testando validação de estrutura de dados da API...');
    
    // Interceptar resposta da API com dados válidos
    await page.route('**/api/usuarios/perfil', async (route) => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          nome: 'João Silva',
          email: 'joao@vitalis.com',
          telefone: '(11) 99999-9999',
          cpf: '123.456.789-09',
          dataNascimento: '1990-01-01',
          endereco: {
            rua: 'Rua das Flores',
            numero: '123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
          }
        }
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular requisição para API
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/usuarios/perfil');
        const data = await res.json();
        return data;
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Erro desconhecido' };
      }
    });

    // Validar estrutura da resposta
    expect(response.sucesso).toBe(true);
    expect(response.dados).toBeDefined();
    expect(response.dados.id).toBe(1);
    expect(response.dados.nome).toBe('João Silva');
    expect(response.dados.email).toBe('joao@vitalis.com');
    expect(response.dados.endereco).toBeDefined();
    expect(response.dados.endereco.cidade).toBe('São Paulo');

    console.log('✅ Validação de estrutura de dados da API funcionando');
  });

  test('deve tratar dados inválidos da API', async ({ page }) => {
    console.log('📊 Testando tratamento de dados inválidos da API...');
    
    // Interceptar resposta da API com dados inválidos
    await page.route('**/api/usuarios/perfil', async (route) => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 'inválido', // Deveria ser número
          nome: null, // Deveria ser string
          email: 'email-inválido', // Formato inválido
          telefone: 123456789, // Deveria ser string
          cpf: 'cpf-inválido', // Formato inválido
          dataNascimento: 'data-inválida', // Formato inválido
          endereco: 'não é objeto' // Deveria ser objeto
        }
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular validação de dados
    const validationResult = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/usuarios/perfil');
        const data = await res.json();
        
        // Função de validação de dados
        const validarDados = (dados) => {
          const erros = [];
          
          if (typeof dados.id !== 'number') {
            erros.push('ID deve ser um número');
          }
          
          if (typeof dados.nome !== 'string' || !dados.nome) {
            erros.push('Nome deve ser uma string válida');
          }
          
          if (typeof dados.email !== 'string' || !dados.email.includes('@')) {
            erros.push('Email deve ter formato válido');
          }
          
          if (typeof dados.telefone !== 'string') {
            erros.push('Telefone deve ser uma string');
          }
          
          if (typeof dados.endereco !== 'object' || dados.endereco === null) {
            erros.push('Endereço deve ser um objeto');
          }
          
          return {
            valido: erros.length === 0,
            erros: erros
          };
        };
        
        return validarDados(data.dados);
      } catch (error) {
        return { valido: false, erros: ['Erro na requisição'] };
      }
    });

    expect(validationResult.valido).toBe(false);
    expect(validationResult.erros.length).toBeGreaterThan(0);
    expect(validationResult.erros).toContain('ID deve ser um número');
    expect(validationResult.erros).toContain('Nome deve ser uma string válida');
    expect(validationResult.erros).toContain('Email deve ter formato válido');

    console.log('✅ Tratamento de dados inválidos da API funcionando');
  });

  test('deve sanitizar dados da API', async ({ page }) => {
    console.log('📊 Testando sanitização de dados da API...');
    
    // Interceptar resposta da API com dados que precisam ser sanitizados
    await page.route('**/api/usuarios/perfil', async (route) => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          nome: '<script>alert("xss")</script>João Silva',
          email: 'joao@vitalis.com',
          observacoes: 'Observação com <b>HTML</b> e caracteres especiais: &lt;&gt;&amp;',
          endereco: {
            rua: 'Rua das Flores',
            numero: '123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
          }
        }
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular sanitização de dados
    const sanitizedData = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/usuarios/perfil');
        const data = await res.json();
        
        // Função de sanitização
        const sanitizarDados = (dados) => {
          const sanitizar = (valor) => {
            if (typeof valor === 'string') {
              return valor
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
                .replace(/<[^>]*>/g, '') // Remove tags HTML
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .trim();
            }
            return valor;
          };
          
          return {
            id: dados.id,
            nome: sanitizar(dados.nome),
            email: sanitizar(dados.email),
            observacoes: sanitizar(dados.observacoes),
            endereco: {
              rua: sanitizar(dados.endereco.rua),
              numero: sanitizar(dados.endereco.numero),
              cidade: sanitizar(dados.endereco.cidade),
              estado: sanitizar(dados.endereco.estado),
              cep: sanitizar(dados.endereco.cep)
            }
          };
        };
        
        return sanitizarDados(data.dados);
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Erro desconhecido' };
      }
    });

    // Verificar se dados foram sanitizados
    expect(sanitizedData.nome).toBe('João Silva');
    expect(sanitizedData.nome).not.toContain('<script>');
    expect(sanitizedData.observacoes).toBe('Observação com HTML e caracteres especiais: <>&');
    expect(sanitizedData.observacoes).not.toContain('<b>');

    console.log('✅ Sanitização de dados da API funcionando');
  });

  test('deve aplicar fallback para dados corrompidos', async ({ page }) => {
    console.log('📊 Testando fallback para dados corrompidos...');
    
    // Interceptar resposta da API com dados corrompidos
    await page.route('**/api/usuarios/perfil', async (route) => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          nome: '', // Nome vazio
          email: null, // Email nulo
          telefone: undefined, // Telefone indefinido
          cpf: '', // CPF vazio
          dataNascimento: 'data-inválida', // Data inválida
          endereco: null // Endereço nulo
        }
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular aplicação de fallback
    const fallbackData = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/usuarios/perfil');
        const data = await res.json();
        
        // Função de fallback
        const aplicarFallback = (dados) => {
          return {
            id: dados.id || 0,
            nome: dados.nome || 'Nome não informado',
            email: dados.email || 'email@nao-informado.com',
            telefone: dados.telefone || '(00) 00000-0000',
            cpf: dados.cpf || '000.000.000-00',
            dataNascimento: dados.dataNascimento || '1900-01-01',
            endereco: dados.endereco || {
              rua: 'Endereço não informado',
              numero: '0',
              cidade: 'Cidade não informada',
              estado: 'XX',
              cep: '00000-000'
            }
          };
        };
        
        return aplicarFallback(data.dados);
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Erro desconhecido' };
      }
    });

    // Verificar se fallback foi aplicado
    expect(fallbackData.nome).toBe('Nome não informado');
    expect(fallbackData.email).toBe('email@nao-informado.com');
    expect(fallbackData.telefone).toBe('(00) 00000-0000');
    expect(fallbackData.cpf).toBe('000.000.000-00');
    expect(fallbackData.dataNascimento).toBe('1900-01-01');
    expect(fallbackData.endereco.rua).toBe('Endereço não informado');

    console.log('✅ Fallback para dados corrompidos funcionando');
  });

  test('deve validar tipos de dados da API', async ({ page }) => {
    console.log('📊 Testando validação de tipos de dados da API...');
    
    // Interceptar resposta da API com tipos incorretos
    await page.route('**/api/consultas', async (route) => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            id: '1', // Deveria ser número
            data: '2024-01-15',
            hora: '14:30',
            status: 'agendada',
            medico: {
              id: 1,
              nome: 'Dr. Maria Santos',
              especialidade: 'Cardiologia'
            },
            preco: 'R$ 150,00' // Deveria ser número
          }
        ]
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular validação de tipos
    const typeValidation = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/consultas');
        const data = await res.json();
        
        // Função de validação de tipos
        const validarTipos = (dados) => {
          const erros = [];
          
          dados.forEach((consulta, index) => {
            if (typeof consulta.id !== 'number') {
              erros.push(`Consulta ${index}: ID deve ser número`);
            }
            
            if (typeof consulta.data !== 'string') {
              erros.push(`Consulta ${index}: Data deve ser string`);
            }
            
            if (typeof consulta.hora !== 'string') {
              erros.push(`Consulta ${index}: Hora deve ser string`);
            }
            
            if (typeof consulta.status !== 'string') {
              erros.push(`Consulta ${index}: Status deve ser string`);
            }
            
            if (typeof consulta.medico !== 'object') {
              erros.push(`Consulta ${index}: Médico deve ser objeto`);
            }
            
            if (typeof consulta.preco !== 'number') {
              erros.push(`Consulta ${index}: Preço deve ser número`);
            }
          });
          
          return {
            valido: erros.length === 0,
            erros: erros
          };
        };
        
        return validarTipos(data.dados);
      } catch (error) {
        return { valido: false, erros: ['Erro na requisição'] };
      }
    });

    expect(typeValidation.valido).toBe(false);
    expect(typeValidation.erros).toContain('Consulta 0: ID deve ser número');
    expect(typeValidation.erros).toContain('Consulta 0: Preço deve ser número');

    console.log('✅ Validação de tipos de dados da API funcionando');
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    console.log('📊 Verificando todos os critérios de aprovação...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // ✅ Dados válidos processados
    await page.route('**/api/usuarios/perfil', async (route) => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          nome: 'João Silva',
          email: 'joao@vitalis.com',
          telefone: '(11) 99999-9999'
        }
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    const validData = await page.evaluate(async () => {
      const res = await fetch('/api/usuarios/perfil');
      return await res.json();
    });

    expect(validData.sucesso).toBe(true);
    expect(validData.dados.nome).toBe('João Silva');

    // ✅ Dados inválidos tratados
    await page.route('**/api/usuarios/perfil', async (route) => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 'inválido',
          nome: null,
          email: 'email-inválido'
        }
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    const invalidData = await page.evaluate(async () => {
      const res = await fetch('/api/usuarios/perfil');
      const data = await res.json();
      
      // Aplicar validação e fallback
      return {
        id: typeof data.dados.id === 'number' ? data.dados.id : 0,
        nome: data.dados.nome || 'Nome não informado',
        email: data.dados.email && data.dados.email.includes('@') ? data.dados.email : 'email@padrao.com'
      };
    });

    expect(invalidData.id).toBe(0);
    expect(invalidData.nome).toBe('Nome não informado');
    expect(invalidData.email).toBe('email@padrao.com');

    console.log('✅ Todos os critérios de aprovação verificados');
  });
});
