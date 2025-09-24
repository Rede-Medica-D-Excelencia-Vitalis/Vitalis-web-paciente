import React, { useState } from 'react'

// Componente para simular a interface desktop do Vitalis
export const DesktopInterface: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [performanceScore, setPerformanceScore] = useState(95)

  const mockData = {
    statsCards: [
      { id: '1', title: 'Consultas Hoje', value: '3', icon: 'calendar', color: 'blue' },
      { id: '2', title: 'Próxima Consulta', value: '14:00', icon: 'clock', color: 'green' },
      { id: '3', title: 'Medicamentos', value: '5', icon: 'pills', color: 'orange' },
      { id: '4', title: 'Resultados', value: '2', icon: 'chart', color: 'purple' },
      { id: '5', title: 'Notificações', value: '1', icon: 'bell', color: 'red' }
    ],
    consultations: [
      { id: '1', doctor: 'Dr. Maria Santos', specialty: 'Cardiologia', time: '09:00', status: 'confirmada' },
      { id: '2', doctor: 'Dr. João Silva', specialty: 'Dermatologia', time: '14:00', status: 'pendente' },
      { id: '3', doctor: 'Dr. Ana Costa', specialty: 'Pediatria', time: '16:00', status: 'confirmada' }
    ],
    appointmentForm: {
      fields: [
        { id: 'doctor', label: 'Nome do médico', type: 'text', required: true, visible: true, value: '' },
        { id: 'date', label: 'Data', type: 'date', required: true, visible: true, value: '' },
        { id: 'time', label: 'Horário', type: 'select', required: true, visible: true, value: '' }
      ],
      timeOptions: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    },
    calendar: {
      days: Array.from({ length: 35 }, (_, i) => i + 1)
    },
    videoInterface: {
      controls: [
        { id: 'mute', label: 'Mute', icon: 'microphone', active: false },
        { id: 'camera', label: 'Câmera', icon: 'video', active: true },
        { id: 'end', label: 'Encerrar', icon: 'phone', active: false }
      ]
    }
  }

  const handleNavigation = async (sectionId: string) => {
    setCurrentSection(sectionId)
    setIsLoading(true)
    try {
      // Simular navegação
      await new Promise(resolve => setTimeout(resolve, 100))
      setPerformanceScore(Math.max(90, 100 - Math.random() * 10))
    } catch (err) {
      setError('Erro ao navegar para a seção')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitAppointment = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      if (!formData.doctor || !formData.date || !formData.time) {
        setError('Todos os campos são obrigatórios')
        return
      }

      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPerformanceScore(95)
      setCurrentSection('dashboard')
    } catch (err) {
      setError('Erro ao processar agendamento')
    } finally {
      setIsLoading(false)
    }
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <div data-testid="dashboard-view">
            <h2>Dashboard</h2>
            <div className="stats-grid" data-testid="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {mockData.statsCards.map(card => (
                <div key={card.id} className="stat-card" data-testid={`stat-card-${card.id}`} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
                  <h3>{card.title}</h3>
                  <p>{card.value}</p>
                  <span className={`icon-${card.icon}`}></span>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'consultations':
        return (
          <div data-testid="consultations-view">
            <h2>Consultas</h2>
            <div className="consultations-list" data-testid="consultations-list">
              {mockData.consultations.map(consultation => (
                <div key={consultation.id} data-testid={`consultation-${consultation.id}`} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4>{consultation.doctor}</h4>
                  <p>{consultation.specialty}</p>
                  <p>{consultation.time} - {consultation.status}</p>
                  <button data-testid={`consultation-action-${consultation.id}`} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'appointment':
        return (
          <div data-testid="appointment-view">
            <h2>Agendamento</h2>
            <form className="appointment-form" data-testid="appointment-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockData.appointmentForm.fields.map(field => (
                <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor={field.id}>{field.label}:</label>
                  {field.type === 'select' ? (
                    <select
                      id={field.id}
                      data-testid={`${field.id}-input`}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) => handleFormChange(field.id, e.target.value)}
                      required={field.required}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                      <option value="">Selecione</option>
                      {mockData.appointmentForm.timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      data-testid={`${field.id}-input`}
                      type={field.type}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) => handleFormChange(field.id, e.target.value)}
                      required={field.required}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                data-testid="submit-appointment"
                onClick={handleSubmitAppointment}
                disabled={isLoading || !formData.doctor || !formData.date || !formData.time}
                style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {isLoading ? 'Processando...' : 'Agendar Consulta'}
              </button>
            </form>
          </div>
        )
      
      case 'calendar':
        return (
          <div data-testid="calendar-view">
            <h2>Calendário</h2>
            <div className="calendar" data-testid="calendar">
              <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {mockData.calendar.days.map(day => (
                  <div key={day} className="calendar-day" data-testid={`calendar-day-${day}`} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}>
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'video':
        return (
          <div data-testid="video-view">
            <h2>Videochamada</h2>
            <div className="video-interface" data-testid="video-interface">
              <div className="video-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <video data-testid="video-stream" style={{ width: '100%', height: '300px', backgroundColor: '#000' }} />
                <div className="video-controls" style={{ display: 'flex', gap: '8px' }}>
                  {mockData.videoInterface.controls.map(control => (
                    <button
                      key={control.id}
                      data-testid={`${control.id}-button`}
                      className={control.active ? 'active' : ''}
                      style={{ padding: '8px 16px', backgroundColor: control.active ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      {control.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="desktop-interface" data-testid="desktop-interface" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header className="header" style={{ height: '80px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }} data-testid="header">
        <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>Vitalis</div>
        <nav className="header-nav" style={{ display: 'flex', gap: '16px' }}>
          <button data-testid="header-menu" style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}>Menu</button>
          <button data-testid="header-notificações" style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}>Notificações</button>
          <button data-testid="header-perfil" style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}>Perfil</button>
        </nav>
      </header>
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside 
          className="sidebar" 
          style={{ width: '280px', backgroundColor: '#f8f9fa', borderRight: '1px solid #dee2e6', padding: '16px' }}
          data-testid="sidebar"
        >
          <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              data-testid="nav-item-1"
              className={currentSection === 'dashboard' ? 'active' : ''}
              onClick={() => handleNavigation('dashboard')}
              style={{ padding: '12px 16px', backgroundColor: currentSection === 'dashboard' ? '#007bff' : 'transparent', color: currentSection === 'dashboard' ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'left' }}
            >
              Dashboard
            </button>
            <button
              data-testid="nav-item-2"
              className={currentSection === 'consultations' ? 'active' : ''}
              onClick={() => handleNavigation('consultations')}
              style={{ padding: '12px 16px', backgroundColor: currentSection === 'consultations' ? '#007bff' : 'transparent', color: currentSection === 'consultations' ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'left' }}
            >
              Consultas
            </button>
            <button
              data-testid="nav-item-3"
              className={currentSection === 'appointment' ? 'active' : ''}
              onClick={() => handleNavigation('appointment')}
              style={{ padding: '12px 16px', backgroundColor: currentSection === 'appointment' ? '#007bff' : 'transparent', color: currentSection === 'appointment' ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'left' }}
            >
              Agendamento
            </button>
            <button
              data-testid="nav-item-4"
              className={currentSection === 'calendar' ? 'active' : ''}
              onClick={() => handleNavigation('calendar')}
              style={{ padding: '12px 16px', backgroundColor: currentSection === 'calendar' ? '#007bff' : 'transparent', color: currentSection === 'calendar' ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'left' }}
            >
              Calendário
            </button>
            <button
              data-testid="nav-item-5"
              className={currentSection === 'video' ? 'active' : ''}
              onClick={() => handleNavigation('video')}
              style={{ padding: '12px 16px', backgroundColor: currentSection === 'video' ? '#007bff' : 'transparent', color: currentSection === 'video' ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'left' }}
            >
              Videochamada
            </button>
          </nav>
        </aside>
        
        {/* Conteúdo Principal */}
        <main 
          className="main-content" 
          style={{ flex: 1, padding: '16px', overflow: 'auto' }}
          data-testid="main-content"
        >
          {error && (
            <div data-testid="error-message" style={{ color: 'red', padding: '8px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          
          {renderCurrentSection()}
        </main>
      </div>
      
      {/* Indicador de Performance */}
      <div className="performance-indicator" data-testid="performance-indicator" style={{ position: 'fixed', bottom: '16px', right: '16px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', borderRadius: '4px' }}>
        Score: {performanceScore}%
      </div>
    </div>
  )
}
