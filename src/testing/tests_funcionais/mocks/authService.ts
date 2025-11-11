import { mockUser, mockLoginResponse } from '../utils'

// Mock simples para vitest (será substituído pelo vitest em runtime)
const vi = {
  fn: () => ({
    mockResolvedValue: (value: any) => Promise.resolve(value),
    mockRejectedValue: (error: any) => Promise.reject(error),
    mockImplementation: (fn: Function) => fn,
    mockClear: () => {},
  })
}

export const mockAuthService = {
  login: vi.fn().mockResolvedValue(mockLoginResponse),
  register: vi.fn().mockResolvedValue(mockLoginResponse),
  verifyToken: vi.fn().mockResolvedValue(mockUser),
  logout: vi.fn().mockResolvedValue(undefined),
  forgotPassword: vi.fn().mockResolvedValue(undefined),
  resetPassword: vi.fn().mockResolvedValue(undefined),
  changePassword: vi.fn().mockResolvedValue(undefined),
  updateProfile: vi.fn().mockResolvedValue(mockUser),
  clearCache: vi.fn(),
  clearCacheAndRefresh: vi.fn().mockResolvedValue(mockUser),
  fetchUserPlan: vi.fn().mockResolvedValue(mockUser.plan),
  processarAssinatura: vi.fn().mockResolvedValue({
    sucesso: true,
    mensagem: 'Assinatura processada com sucesso',
    data: { plan: mockUser.plan }
  }),
  cancelSubscription: vi.fn().mockResolvedValue({
    sucesso: true,
    mensagem: 'Assinatura cancelada com sucesso'
  })
}

// Reset dos mocks
export const resetAuthServiceMocks = () => {
  Object.values(mockAuthService).forEach((mock: any) => {
    if (typeof mock === 'function' && mock.mockClear) {
      mock.mockClear()
    }
  })
}
