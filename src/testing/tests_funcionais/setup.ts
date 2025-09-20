import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Estende os matchers do Vitest com os do jest-dom
expect.extend(matchers)

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup()
})

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  },
  writable: true,
})

// Mock do sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  },
  writable: true,
})

// Mock do window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: () => {},
    replace: () => {},
    reload: () => {},
  },
  writable: true,
})

// Mock do ResizeObserver para componentes Radix UI
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Suprimir warnings conhecidos do React que não afetam a funcionalidade dos testes
const originalConsoleError = console.error
console.error = (...args) => {
  const message = args[0]
  if (
    typeof message === 'string' &&
    (message.includes('Warning: An update to') ||
     message.includes('act(...)') ||
     message.includes('React Router Future Flag') ||
     message.includes('ResizeObserver is not defined'))
  ) {
    // Suprimir estes warnings específicos
    return
  }
  originalConsoleError(...args)
}
