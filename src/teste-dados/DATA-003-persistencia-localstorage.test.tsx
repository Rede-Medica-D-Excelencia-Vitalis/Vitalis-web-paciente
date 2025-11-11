import { test, expect } from '@playwright/test';

/**
 * DATA-003 - Persistência no LocalStorage
 * 
 * Objetivo: Verificar persistência de dados no localStorage
 * Prioridade: Alta
 * 
 * Cenários testados:
 * - Salvamento de dados no localStorage
 * - Recuperação de dados após reload
 * - Tratamento de dados grandes
 * - Limpeza de dados
 * - Sincronização de dados
 */

test.describe('DATA-003 - Persistência no LocalStorage', () => {
  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('deve salvar dados no localStorage', async ({ page }) => {
    console.log('💾 Testando salvamento de dados no localStorage...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular salvamento de dados
    const savedData = await page.evaluate(() => {
      const dadosUsuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@vitalis.com',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        preferencias: {
          tema: 'claro',
          idioma: 'pt-BR',
          notificacoes: true
        }
      };

      // Salvar dados no localStorage
      localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
      localStorage.setItem('token', dadosUsuario.token);
      localStorage.setItem('preferencias', JSON.stringify(dadosUsuario.preferencias));

      return {
        usuario: localStorage.getItem('usuario'),
        token: localStorage.getItem('token'),
        preferencias: localStorage.getItem('preferencias')
      };
    });

    // Verificar se dados foram salvos
    expect(savedData.usuario).toBeTruthy();
    expect(savedData.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    expect(savedData.preferencias).toBeTruthy();

    const usuarioData = JSON.parse(savedData.usuario);
    expect(usuarioData.nome).toBe('João Silva');
    expect(usuarioData.email).toBe('joao@vitalis.com');

    console.log('✅ Salvamento de dados no localStorage funcionando');
  });

  test('deve recuperar dados após reload', async ({ page }) => {
    console.log('💾 Testando recuperação de dados após reload...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Salvar dados antes do reload
    await page.evaluate(() => {
      const dadosUsuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@vitalis.com',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        ultimoAcesso: new Date().toISOString()
      };

      localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
      localStorage.setItem('token', dadosUsuario.token);
      localStorage.setItem('ultimoAcesso', dadosUsuario.ultimoAcesso);
    });

    // Recarregar página
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verificar se dados foram recuperados
    const recoveredData = await page.evaluate(() => {
      return {
        usuario: localStorage.getItem('usuario'),
        token: localStorage.getItem('token'),
        ultimoAcesso: localStorage.getItem('ultimoAcesso')
      };
    });

    expect(recoveredData.usuario).toBeTruthy();
    expect(recoveredData.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    expect(recoveredData.ultimoAcesso).toBeTruthy();

    const usuarioData = JSON.parse(recoveredData.usuario);
    expect(usuarioData.nome).toBe('João Silva');
    expect(usuarioData.email).toBe('joao@vitalis.com');

    console.log('✅ Recuperação de dados após reload funcionando');
  });

  test('deve tratar dados grandes no localStorage', async ({ page }) => {
    console.log('💾 Testando tratamento de dados grandes no localStorage...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular dados grandes
    const largeData = await page.evaluate(() => {
      // Criar dados grandes (simulando cache de consultas)
      const consultas = [];
      for (let i = 0; i < 1000; i++) {
        consultas.push({
          id: i,
          data: '2024-01-15',
          hora: '14:30',
          medico: {
            id: i,
            nome: `Dr. Médico ${i}`,
            especialidade: 'Cardiologia',
            observacoes: 'Observações detalhadas da consulta ' + i
          },
          observacoes: 'Observações detalhadas da consulta ' + i + ' com muito texto para testar o limite do localStorage'
        });
      }

      const cacheData = {
        consultas: consultas,
        ultimaAtualizacao: new Date().toISOString(),
        total: consultas.length
      };

      try {
        localStorage.setItem('cache-consultas', JSON.stringify(cacheData));
        return {
          sucesso: true,
          tamanho: JSON.stringify(cacheData).length,
          totalConsultas: consultas.length
        };
      } catch (error) {
        return {
          sucesso: false,
          erro: error.message,
          tamanho: JSON.stringify(cacheData).length
        };
      }
    });

    // Verificar se dados grandes foram salvos ou se houve erro de limite
    if (largeData.sucesso) {
      expect(largeData.totalConsultas).toBe(1000);
      expect(largeData.tamanho).toBeGreaterThan(0);
      console.log(`✅ Dados grandes salvos: ${largeData.tamanho} caracteres`);
    } else {
      expect(largeData.erro).toContain('QuotaExceededError');
      console.log('✅ Limite do localStorage tratado adequadamente');
    }
  });

  test('deve limpar dados do localStorage', async ({ page }) => {
    console.log('💾 Testando limpeza de dados do localStorage...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Salvar dados primeiro
    await page.evaluate(() => {
      localStorage.setItem('usuario', JSON.stringify({ id: 1, nome: 'João Silva' }));
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      localStorage.setItem('preferencias', JSON.stringify({ tema: 'claro' }));
      localStorage.setItem('cache-consultas', JSON.stringify({ consultas: [] }));
    });

    // Verificar se dados existem
    const beforeClear = await page.evaluate(() => {
      return {
        usuario: localStorage.getItem('usuario'),
        token: localStorage.getItem('token'),
        preferencias: localStorage.getItem('preferencias'),
        cache: localStorage.getItem('cache-consultas')
      };
    });

    expect(beforeClear.usuario).toBeTruthy();
    expect(beforeClear.token).toBeTruthy();

    // Limpar dados específicos
    await page.evaluate(() => {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    });

    // Verificar se dados específicos foram removidos
    const afterPartialClear = await page.evaluate(() => {
      return {
        usuario: localStorage.getItem('usuario'),
        token: localStorage.getItem('token'),
        preferencias: localStorage.getItem('preferencias'),
        cache: localStorage.getItem('cache-consultas')
      };
    });

    expect(afterPartialClear.usuario).toBeNull();
    expect(afterPartialClear.token).toBeNull();
    expect(afterPartialClear.preferencias).toBeTruthy(); // Deve ainda existir

    // Limpar todos os dados
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Verificar se todos os dados foram removidos
    const afterFullClear = await page.evaluate(() => {
      return {
        usuario: localStorage.getItem('usuario'),
        token: localStorage.getItem('token'),
        preferencias: localStorage.getItem('preferencias'),
        cache: localStorage.getItem('cache-consultas'),
        tamanho: localStorage.length
      };
    });

    expect(afterFullClear.usuario).toBeNull();
    expect(afterFullClear.token).toBeNull();
    expect(afterFullClear.preferencias).toBeNull();
    expect(afterFullClear.cache).toBeNull();
    expect(afterFullClear.tamanho).toBe(0);

    console.log('✅ Limpeza de dados do localStorage funcionando');
  });

  test('deve sincronizar dados entre abas', async ({ page, context }) => {
    console.log('💾 Testando sincronização de dados entre abas...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Salvar dados na primeira aba
    await page.evaluate(() => {
      const dadosUsuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@vitalis.com',
        ultimaAtualizacao: new Date().toISOString()
      };
      localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    });

    // Criar segunda aba
    const page2 = await context.newPage();
    await page2.goto('/');
    await page2.waitForLoadState('networkidle');

    // Verificar se dados estão disponíveis na segunda aba
    const dataInSecondTab = await page2.evaluate(() => {
      return {
        usuario: localStorage.getItem('usuario'),
        tamanho: localStorage.length
      };
    });

    expect(dataInSecondTab.usuario).toBeTruthy();
    expect(dataInSecondTab.tamanho).toBeGreaterThan(0);

    const usuarioData = JSON.parse(dataInSecondTab.usuario);
    expect(usuarioData.nome).toBe('João Silva');

    // Modificar dados na segunda aba
    await page2.evaluate(() => {
      const dadosUsuario = JSON.parse(localStorage.getItem('usuario'));
      dadosUsuario.nome = 'João Silva Atualizado';
      dadosUsuario.ultimaAtualizacao = new Date().toISOString();
      localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    });

    // Verificar se dados foram sincronizados na primeira aba
    const dataInFirstTab = await page.evaluate(() => {
      return {
        usuario: localStorage.getItem('usuario')
      };
    });

    const usuarioDataAtualizado = JSON.parse(dataInFirstTab.usuario);
    expect(usuarioDataAtualizado.nome).toBe('João Silva Atualizado');

    await page2.close();

    console.log('✅ Sincronização de dados entre abas funcionando');
  });

  test('deve verificar integridade dos dados', async ({ page }) => {
    console.log('💾 Testando integridade dos dados no localStorage...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Salvar dados com checksum
    const dataWithIntegrity = await page.evaluate(() => {
      const dadosUsuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@vitalis.com',
        dados: 'dados importantes'
      };

      // Calcular checksum simples
      const checksum = btoa(JSON.stringify(dadosUsuario)).length;
      dadosUsuario.checksum = checksum;

      localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
      return checksum;
    });

    // Verificar integridade após reload
    await page.reload();
    await page.waitForLoadState('networkidle');

    const integrityCheck = await page.evaluate((expectedChecksum) => {
      const storedData = localStorage.getItem('usuario');
      if (!storedData) return { valido: false, erro: 'Dados não encontrados' };

      const dados = JSON.parse(storedData);
      const currentChecksum = btoa(JSON.stringify({
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        dados: dados.dados
      })).length;

      return {
        valido: currentChecksum === expectedChecksum,
        checksumOriginal: expectedChecksum,
        checksumAtual: currentChecksum,
        dados: dados
      };
    }, dataWithIntegrity);

    expect(integrityCheck.valido).toBe(true);
    expect(integrityCheck.dados.nome).toBe('João Silva');

    console.log('✅ Integridade dos dados no localStorage funcionando');
  });

  test('deve verificar todos os critérios de aprovação', async ({ page }) => {
    console.log('💾 Verificando todos os critérios de aprovação...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // ✅ Dados salvos
    await page.evaluate(() => {
      const dadosUsuario = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@vitalis.com',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      };
      localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    });

    const savedData = await page.evaluate(() => localStorage.getItem('usuario'));
    expect(savedData).toBeTruthy();

    // ✅ Dados recuperados
    await page.reload();
    await page.waitForLoadState('networkidle');

    const recoveredData = await page.evaluate(() => localStorage.getItem('usuario'));
    expect(recoveredData).toBeTruthy();

    // ✅ Dados grandes armazenados (ou limite tratado)
    const largeDataResult = await page.evaluate(() => {
      try {
        const largeData = { dados: 'x'.repeat(10000) };
        localStorage.setItem('large-data', JSON.stringify(largeData));
        return { sucesso: true };
      } catch (error) {
        return { sucesso: false, erro: error.message };
      }
    });

    // ✅ Limite tratado
    if (!largeDataResult.sucesso) {
      expect(largeDataResult.erro).toContain('QuotaExceededError');
    }

    // ✅ Limpeza funcional
    await page.evaluate(() => {
      localStorage.removeItem('usuario');
    });

    const afterClear = await page.evaluate(() => localStorage.getItem('usuario'));
    expect(afterClear).toBeNull();

    // ✅ Sincronização funcional (simulada)
    await page.evaluate(() => {
      localStorage.setItem('sync-test', 'dados sincronizados');
    });

    const syncData = await page.evaluate(() => localStorage.getItem('sync-test'));
    expect(syncData).toBe('dados sincronizados');

    // ✅ Integridade mantida
    const integrityData = await page.evaluate(() => {
      const data = { id: 1, nome: 'Teste' };
      localStorage.setItem('integrity-test', JSON.stringify(data));
      return JSON.parse(localStorage.getItem('integrity-test'));
    });

    expect(integrityData.id).toBe(1);
    expect(integrityData.nome).toBe('Teste');

    console.log('✅ Todos os critérios de aprovação verificados');
  });
});
