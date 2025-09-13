import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Wrapper customizado para testes
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock de dados para testes
export const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  cpf: '123.456.789-00',
  phone: '(11) 99999-9999',
  birthdate: '1990-01-01',
  address: {
    cep: '01234-567',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP'
  },
  plan: {
    id: '1',
    name: 'Plano Básico',
    price: 99.90,
    period: 'month' as const,
    nextBilling: '2024-02-01'
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

export const mockToken = 'mock-jwt-token-123456789'

export const mockLoginResponse = {
  token: mockToken,
  user: mockUser
}
