d# Integração com Backend - Vitalis

Este documento explica como configurar e usar a integração com o backend da Vitalis.

## 📋 Pré-requisitos

- Node.js 18+ 
- Backend da Vitalis rodando
- Conhecimento básico de React e TypeScript

## 🚀 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL da API do backend
VITE_API_URL=http://localhost:3000/api

# Outras configurações
VITE_APP_NAME=Vitalis
VITE_APP_VERSION=1.0.0
```

### 2. Estrutura da API

O frontend espera que o backend tenha os seguintes endpoints:

#### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de novo usuário
- `GET /auth/me` - Verificar token atual
- `PUT /auth/profile` - Atualizar perfil
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token

#### Consultas
- `GET /consultations` - Listar consultas
- `POST /consultations` - Criar consulta
- `GET /consultations/:id` - Buscar consulta específica
- `PUT /consultations/:id/cancel` - Cancelar consulta
- `POST /consultations/:id/rate` - Avaliar consulta

#### Médicos
- `GET /doctors` - Listar médicos
- `GET /doctors/:id` - Buscar médico específico
- `GET /doctors/:id/slots` - Horários disponíveis

#### Farmácia
- `GET /pharmacy/products` - Listar produtos
- `GET /pharmacy/products/:id` - Buscar produto específico
- `POST /pharmacy/cart/add` - Adicionar ao carrinho
- `GET /pharmacy/cart` - Buscar carrinho
- `POST /pharmacy/orders` - Criar pedido

## 🔧 Como Usar

### 1. Autenticação

```typescript
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

// Login
const { login } = useAuthStore();
const response = await authService.login({ email, password });
login(response.token, response.user);

// Logout
const { logout } = useAuthStore();
await authService.logout();
logout();
```

### 2. Consultas

```typescript
import { consultationService } from '../services/consultationService';

// Buscar consultas
const consultations = await consultationService.getConsultations();

// Criar consulta
const newConsultation = await consultationService.createConsultation({
  doctorId: '123',
  specialty: 'Cardiologia',
  date: '2024-01-15',
  time: '14:00',
  type: 'teleconsulta'
});
```

### 3. Farmácia

```typescript
import { pharmacyService } from '../services/pharmacyService';

// Buscar produtos
const products = await pharmacyService.getProducts('medicamentos');

// Adicionar ao carrinho
await pharmacyService.addToCart('product-id', 2);
```

### 4. Hook useApi

```typescript
import { useApi } from '../hooks/useApi';
import { consultationService } from '../services/consultationService';

const MyComponent = () => {
  const { data, loading, error, execute } = useApi(consultationService.getConsultations);

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Erro: {error}</div>;

  return <div>{/* renderizar dados */}</div>;
};
```

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   └── api.ts                 # Configuração do Axios
├── types/
│   └── api.ts                 # Tipos TypeScript
├── store/
│   └── authStore.ts           # Store de autenticação
├── services/
│   ├── authService.ts         # Serviços de autenticação
│   ├── consultationService.ts # Serviços de consulta
│   └── pharmacyService.ts     # Serviços da farmácia
├── hooks/
│   └── useApi.ts              # Hook para gerenciar APIs
└── components/
    └── ui/
        └── loading.tsx        # Componentes de loading
```

## 🔒 Autenticação

O sistema usa JWT tokens para autenticação:

1. **Login**: O usuário faz login e recebe um token
2. **Interceptors**: O Axios adiciona automaticamente o token em todas as requisições
3. **Expiração**: Se o token expirar, o usuário é redirecionado para o login
4. **Refresh**: O sistema pode renovar tokens automaticamente

## 🛠️ Personalização

### Adicionar Novo Serviço

1. Crie um novo arquivo em `src/services/`
2. Importe a instância `api` de `../lib/api`
3. Defina os tipos em `src/types/api.ts`
4. Use o hook `useApi` nos componentes

### Modificar Endpoints

Edite os arquivos de serviço para ajustar os endpoints conforme necessário.

### Adicionar Novos Tipos

Adicione novos tipos em `src/types/api.ts` seguindo o padrão existente.

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token está sendo enviado corretamente
- Confirme se o token não expirou
- Verifique se o endpoint está correto

### Erro 404 (Not Found)
- Confirme se a URL da API está correta
- Verifique se o endpoint existe no backend
- Confirme se o método HTTP está correto

### Erro de CORS
- Configure o backend para aceitar requisições do frontend
- Verifique se as origens estão configuradas corretamente

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do backend
2. Confirme se todos os endpoints estão funcionando
3. Verifique os logs do console do navegador
4. Teste os endpoints diretamente no Postman/Insomnia 