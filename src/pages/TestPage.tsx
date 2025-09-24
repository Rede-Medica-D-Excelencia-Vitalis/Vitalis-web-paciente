import React from 'react'
import { DesktopInterface } from '../components/DesktopInterface'

// Página de teste para o Cypress
export const TestPage: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <DesktopInterface />
    </div>
  )
}
