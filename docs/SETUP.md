# Configuração do Projeto Vitalis

## 🚀 Configuração Inicial

### 1. Backend

1. **Instalar dependências:**
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na pasta `backend` com:
```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=vitalis_db

# JWT
JWT_SECRET=sua_chave_secreta_jwt

# Porta do servidor
PORT=3000

# Ambiente
NODE_ENV=development
```

3. **Configurar banco de dados:**
- Crie um banco MySQL chamado `vitalis_db`
- Execute as migrações (se houver)

4. **Iniciar o backend:**
```bash
npm run dev
```

### 2. Frontend

1. **Instalar dependências:**
```bash
cd Vitalis-menu
npm install
```

2. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na pasta `Vitalis-menu` com:
```env
# URL da API do backend
VITE_API_URL=http://localhost:3000/api

# Outras configurações
VITE_APP_NAME=Vitalis
VITE_APP_VERSION=1.0.0
```

3. **Iniciar o frontend:**
```bash
npm run dev
```

## 📋 Endpoints Implementados

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/registro` - Registro
- `GET /api/auth/verificar` - Verificar token

### Consultas
- `GET /api/consultations` - Listar consultas
- `POST /api/consultations` - Criar consulta
- `GET /api/consultations/:id` - Buscar consulta
- `PUT /api/consultations/:id/cancel` - Cancelar consulta
- `POST /api/consultations/:id/rate` - Avaliar consulta

### Médicos
- `GET /api/doctors` - Listar médicos
- `GET /api/doctors/:id` - Buscar médico
- `GET /api/doctors/:id/slots` - Horários disponíveis

### Especialidades
- `GET /api/specialties` - Listar especialidades

### Farmácia
- `GET /api/pharmacy/products` - Listar produtos
- `GET /api/pharmacy/products/:id` - Buscar produto
- `GET /api/pharmacy/categories` - Categorias
- `GET /api/pharmacy/cart` - Carrinho
- `POST /api/pharmacy/cart/add` - Adicionar ao carrinho

## 🔧 Estrutura do Banco

### Tabelas principais:
- `usuarios` - Usuários (pacientes, médicos, farmácias)
- `consultas` - Consultas médicas
- `produtos` - Produtos da farmácia
- `pedidos` - Pedidos da farmácia
- `carrinho` - Carrinho de compras
- `avaliacoes` - Avaliações de produtos/consultas

## 🐛 Troubleshooting

### Erro de CORS
Se houver erro de CORS, verifique se o backend está configurado corretamente:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  credentials: true
}));
```

### Erro de conexão com banco
Verifique se:
1. MySQL está rodando
2. Credenciais estão corretas
3. Banco `vitalis_db` existe

### Erro de autenticação
Verifique se:
1. JWT_SECRET está configurado
2. Token está sendo enviado corretamente
3. Middleware de auth está funcionando

## 📞 Suporte

Para problemas:
1. Verifique os logs do backend
2. Verifique o console do navegador
3. Teste os endpoints no Postman
4. Verifique se todas as dependências estão instaladas 