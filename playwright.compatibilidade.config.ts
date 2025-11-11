import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para Testes de Compatibilidade
 * 
 * Este arquivo configura os testes de compatibilidade para diferentes
 * navegadores e dispositivos, garantindo que a aplicação funcione
 * corretamente em todas as plataformas suportadas.
 */

export default defineConfig({
  // Diretório dos testes de compatibilidade
  testDir: './src/teste-compatibilidade',
  
  // Configurações gerais
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Configurações de relatório
  reporter: [
    ['html', { outputFolder: 'docs/playwright-report-compatibilidade' }],
    ['json', { outputFile: 'docs/playwright-results-compatibilidade.json' }],
    ['junit', { outputFile: 'docs/playwright-results-compatibilidade.xml' }]
  ],
  
  // Configurações globais
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Timeout para testes de compatibilidade (mais tempo para dispositivos móveis)
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  // Configuração do servidor de desenvolvimento
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutos para iniciar o servidor
  },
  
  // Projetos de teste para diferentes navegadores e dispositivos
  projects: [
    // ===== NAVEGADORES DESKTOP =====
    
    // Chrome Desktop
    {
      name: 'chrome-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        // Configurações específicas para Chrome
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--enable-features=NetworkService,NetworkServiceLogging'
          ]
        }
      },
    },
    
    // Firefox Desktop
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        // Configurações específicas para Firefox
        launchOptions: {
          firefoxUserPrefs: {
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true
          }
        }
      },
    },
    
    // Safari Desktop (WebKit)
    {
      name: 'safari-desktop',
      use: { 
        ...devices['Desktop Safari'],
        // Configurações específicas para Safari
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // ===== DISPOSITIVOS MÓVEIS =====
    
    // iPhone 12 (iOS Safari)
    {
      name: 'iphone-12',
      use: { 
        ...devices['iPhone 12'],
        // Configurações específicas para iPhone
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // iPhone 12 Pro (iOS Safari)
    {
      name: 'iphone-12-pro',
      use: { 
        ...devices['iPhone 12 Pro'],
        // Configurações específicas para iPhone Pro
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // Pixel 5 (Android Chrome)
    {
      name: 'pixel-5',
      use: { 
        ...devices['Pixel 5'],
        // Configurações específicas para Android
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--enable-features=NetworkService,NetworkServiceLogging'
          ]
        }
      },
    },
    
    // Galaxy S21 (Android Chrome)
    {
      name: 'galaxy-s21',
      use: { 
        ...devices['Galaxy S21'],
        // Configurações específicas para Galaxy
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--enable-features=NetworkService,NetworkServiceLogging'
          ]
        }
      },
    },
    
    // ===== TABLETS =====
    
    // iPad (Safari)
    {
      name: 'ipad',
      use: { 
        ...devices['iPad'],
        // Configurações específicas para iPad
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // iPad Pro (Safari)
    {
      name: 'ipad-pro',
      use: { 
        ...devices['iPad Pro'],
        // Configurações específicas para iPad Pro
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // ===== TAMANHOS ESPECÍFICOS =====
    
    // Mobile Pequeno (320px)
    {
      name: 'mobile-pequeno',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 320, height: 568 },
        // Configurações para mobile pequeno
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // Mobile Grande (414px)
    {
      name: 'mobile-grande',
      use: {
        ...devices['iPhone 12 Pro Max'],
        viewport: { width: 414, height: 896 },
        // Configurações para mobile grande
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // Tablet Pequeno (768px)
    {
      name: 'tablet-pequeno',
      use: {
        ...devices['iPad'],
        viewport: { width: 768, height: 1024 },
        // Configurações para tablet pequeno
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // Tablet Grande (1024px)
    {
      name: 'tablet-grande',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 },
        // Configurações para tablet grande
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },
    
    // Desktop Grande (1920px)
    {
      name: 'desktop-grande',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Configurações para desktop grande
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--enable-features=NetworkService,NetworkServiceLogging'
          ]
        }
      },
    },
  ],
  
  // Configurações de timeout
  timeout: 30000, // 30 segundos por teste
  expect: {
    timeout: 10000, // 10 segundos para expectativas
  },
  
  // Configurações de retry
  retries: process.env.CI ? 2 : 0,
  
  // Configurações de workers
  workers: process.env.CI ? 1 : undefined,
  
  // Configurações de output
  outputDir: 'test-results-compatibilidade',
  
  // Configurações de global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,
});
