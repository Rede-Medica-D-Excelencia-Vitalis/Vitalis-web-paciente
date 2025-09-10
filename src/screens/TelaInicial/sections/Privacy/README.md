# Política de Privacidade - Estrutura Modular

## 📁 Estrutura de Arquivos

```
Privacy/
├── README.md                    # Esta documentação
├── Privacy.tsx                  # Componente principal (orquestrador)
├── PrivacyIntroducao.tsx        # Seção 1: Introdução
├── PrivacyColeta.tsx           # Seção 2: Coleta de Dados
├── PrivacyUso.tsx              # Seção 3: Uso dos Dados
├── PrivacyCompartilhamento.tsx # Seção 4: Compartilhamento (a criar)
├── PrivacySeguranca.tsx        # Seção 5: Segurança (a criar)
├── PrivacyDireitos.tsx         # Seção 6: Seus Direitos (a criar)
├── PrivacyCookies.tsx          # Seção 7: Cookies (a criar)
├── PrivacyMenores.tsx          # Seção 8: Menores de Idade (a criar)
├── PrivacyAlteracoes.tsx       # Seção 9: Alterações (a criar)
└── PrivacyContato.tsx          # Seção 10: Contato (a criar)
```

## 🎯 Vantagens da Estrutura Modular

### ✅ **Manutenibilidade**
- Cada seção é um componente independente
- Edições isoladas sem afetar outras partes
- Fácil localização de conteúdo específico

### ✅ **Reutilização**
- Componentes podem ser usados em outras telas
- Possibilidade de criar versões resumidas
- Exportação de seções específicas

### ✅ **Organização**
- Código mais limpo e organizado
- Responsabilidades bem definidas
- Fácil navegação no projeto

### ✅ **Testabilidade**
- Testes unitários por seção
- Isolamento de bugs
- Validação independente

## 🔧 Como Usar

### 1. **Editar uma Seção Existente**
```typescript
// Edite diretamente o arquivo da seção desejada
// Exemplo: PrivacyColeta.tsx
```

### 2. **Adicionar Nova Seção**
```typescript
// 1. Crie o componente da nova seção
// 2. Importe no Privacy.tsx
// 3. Adicione ao array sections
// 4. Inclua o componente no JSX
```

### 3. **Reordenar Seções**
```typescript
// Modifique o array sections no Privacy.tsx
const sections = [
  { id: "introducao", title: "Introdução" },
  { id: "nova-secao", title: "Nova Seção" }, // Adicione aqui
  { id: "coleta", title: "Coleta de Dados" },
  // ...
];
```

## 📝 Padrões de Desenvolvimento

### **Estrutura de um Componente de Seção**
```typescript
import React from "react";

const PrivacyNovaSecao: React.FC = () => {
  return (
    <div id="nova-secao" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">X. Título da Seção</h2>
      <div className="space-y-8">
        {/* Conteúdo da seção */}
      </div>
    </div>
  );
};

export default PrivacyNovaSecao;
```

### **Classes CSS Padrão**
- `bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20` - Container principal
- `text-3xl font-bold text-white mb-6` - Títulos principais
- `text-2xl font-bold text-white mb-6` - Subtítulos
- `text-blue-100 leading-relaxed` - Texto do corpo
- `bg-[cor]-600/20 border border-[cor]-400/30 rounded-lg p-6` - Cards coloridos

### **Cores Disponíveis**
- `blue` - Informações principais
- `green` - Processos e procedimentos
- `purple` - Dados sensíveis
- `yellow` - Avisos e limitações
- `red` - Alertas importantes
- `indigo` - Pesquisas e desenvolvimento

## 🚀 Próximos Passos

### **Seções a Implementar:**
1. **PrivacyCompartilhamento.tsx** - Detalhes sobre compartilhamento de dados
2. **PrivacySeguranca.tsx** - Medidas de segurança implementadas
3. **PrivacyDireitos.tsx** - Direitos do usuário conforme LGPD
4. **PrivacyCookies.tsx** - Política de cookies e tecnologias similares
5. **PrivacyMenores.tsx** - Proteção de dados de menores de idade
6. **PrivacyAlteracoes.tsx** - Processo de alteração da política
7. **PrivacyContato.tsx** - Informações de contato e DPO

### **Melhorias Futuras:**
- [ ] Adicionar animações de entrada
- [ ] Implementar busca por texto
- [ ] Criar versão para impressão
- [ ] Adicionar tradução para outros idiomas
- [ ] Implementar versionamento da política

## 📋 Checklist para Novas Seções

- [ ] Criar componente com estrutura padrão
- [ ] Adicionar ID único para navegação
- [ ] Importar no componente principal
- [ ] Adicionar ao array sections
- [ ] Incluir no JSX
- [ ] Testar navegação por âncoras
- [ ] Verificar responsividade
- [ ] Validar acessibilidade

## 🔍 Exemplo de Implementação

```typescript
// 1. Criar PrivacyCompartilhamento.tsx
import React from "react";

const PrivacyCompartilhamento: React.FC = () => {
  return (
    <div id="compartilhamento" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">4. Compartilhamento</h2>
      <div className="space-y-8">
        {/* Conteúdo detalhado aqui */}
      </div>
    </div>
  );
};

export default PrivacyCompartilhamento;

// 2. Atualizar Privacy.tsx
import PrivacyCompartilhamento from "./PrivacyCompartilhamento";

// 3. Adicionar ao JSX
<PrivacyCompartilhamento />
```

## 📞 Suporte

Para dúvidas sobre a estrutura ou implementação, consulte:
- Documentação da LGPD
- Padrões de design da Vitalis
- Componentes existentes como referência 