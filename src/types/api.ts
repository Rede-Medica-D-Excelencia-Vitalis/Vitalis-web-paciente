// Tipos de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthdate: string;
  profileImage?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
    period: 'month' | 'year';
    nextBilling?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Paciente extends User {
  // Campos da tabela 'pacientes'
  usuario_id: string;
  genero?: string;
  tipo_sanguineo?: string;
  alergias?: string;
  doencas_cronicas?: string;
  medicamentos_uso_continuo?: string;
  
  // Campos adicionais para compatibilidade com o backend
  nome?: string;
  telefone?: string;
  data_nascimento?: string;
}

// Tipos de autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  birthdate: string;
  genero: string;
  address: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  planId?: string;
}

// Tipos de consulta
export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    crm: string;
    avatar?: string;
  };
  specialty: string;
  date: string;
  time: string;
  type: 'presencial' | 'teleconsulta';
  status: 'agendada' | 'confirmada' | 'em_andamento' | 'concluída' | 'cancelada';
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationRequest {
  doctorId: string;
  specialty: string;
  date: string;
  time: string;
  type: 'presencial' | 'teleconsulta';
  symptoms?: string;
}

// Tipos de médico
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  avatar?: string;
  rating: number;
  availableSlots: string[];
  bio?: string;
  education?: string[];
  experience?: string;
}

// Tipos de farmácia
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  farmacia_nome?: string; // Campo retornado pelo backend
  pharmacy: {
    id: string;
    name: string;
    rating: number;
  };
  stock: number;
  requiresPrescription: boolean;
  rating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  pharmacy: {
    name: string;
    rating: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pendente' | 'confirmado' | 'em_preparo' | 'enviado' | 'entregue' | 'cancelado';
  paymentMethod: 'credit' | 'pix';
  paymentStatus: 'pendente' | 'pago' | 'falhou';
  shippingAddress: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos de triagem
export interface TriagemQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple_choice' | 'yes_no';
  options?: string[];
  required: boolean;
}

export interface TriagemResult {
  riskLevel: 'baixo' | 'medio' | 'alto';
  riskPercentage: number;
  recommendations: string[];
  shouldSeekMedicalAttention: boolean;
  urgencyLevel: 'baixa' | 'media' | 'alta';
}

// Tipos de prescrição
export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  doctor: {
    name: string;
    specialty: string;
    crm: string;
  };
  medications: PrescriptionMedication[];
  instructions: string;
  validUntil: string;
  status: 'ativa' | 'expirada' | 'cancelada';
  createdAt: string;
}

export interface PrescriptionMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Tipos de resultados de exames
export interface ExamResult {
  id: string;
  patientId: string;
  examType: string;
  examDate: string;
  resultDate: string;
  status: 'pendente' | 'concluido' | 'cancelado';
  fileUrl?: string;
  observations?: string;
  doctorId?: string;
  doctor?: {
    name: string;
    specialty: string;
  };
  createdAt: string;
}

// Tipos de planos
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

// Tipos de pagamento
export interface PaymentMethod {
  id: string;
  type: 'credit' | 'pix' | 'debit';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'credit' | 'pix';
  status: 'pendente' | 'pago' | 'falhou' | 'reembolsado';
  transactionId?: string;
  createdAt: string;
} 