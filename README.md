# 🎨 Sistema de Agendamento Automático - Frontend

> Interface React moderna e intuitiva para agendamento de transferências de endereço integrada com IXC Soft.

[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F56565.svg)](https://lucide.dev/)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Demonstração Visual](#-demonstração-visual)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura de Componentes](#-estrutura-de-componentes)
- [Fluxo da Aplicação](#-fluxo-da-aplicação)
- [Guia de Uso](#-guia-de-uso)
- [Personalização](#-personalização)

---

## 🎯 Sobre o Projeto

Sistema web completo para automatização de agendamentos de **transferência de endereço** de clientes, desenvolvido em React com design moderno e responsivo. 

### 🌟 Destaques

- ✅ **Wizard multi-etapas** com navegação intuitiva
- ✅ **Validação em tempo real** de CPF/CNPJ e CEP
- ✅ **Busca automática** de endereços via API
- ✅ **Geolocalização** automática (lat/lng)
- ✅ **Interface responsiva** para desktop e mobile
- ✅ **Feedback visual** em todas as operações
- ✅ **Integração completa** com backend IXC Soft

---

## 🖼️ Demonstração Visual

```
┌─────────────────────────────────────────────────┐
│  🔍 Busca de Cliente (Screen 1)                 │
│  └─► 👤 Seleção de Contrato (Screen 2)         │
│       └─► 📍 Novo Endereço (Screen 3)          │
│            └─► 📍 Endereço Antigo (Screen 4)   │
│                 └─► 📅 Agendamento (Screen 5)  │
│                      └─► ✅ Revisão (Screen 6) │
└─────────────────────────────────────────────────┘
```

### Telas do Sistema

| Tela | Descrição | Campos Principais |
|------|-----------|-------------------|
| **Screen 1** | Busca de cliente | CPF/CNPJ com validação |
| **Screen 2** | Seleção de contrato | Lista de contratos ativos |
| **Screen 3** | Novo endereço | CEP, rua, número, bairro, lat/lng |
| **Screen 4** | Endereço antigo | Dados do local atual + porta |
| **Screen 5** | Agendamento | Data, período, valor da taxa |
| **Screen 6** | Revisão e envio | Confirmação de todos os dados |

---

## ⚡ Funcionalidades

### 🔐 Validações Inteligentes
- **CPF/CNPJ**: Formatação e validação de dígitos verificadores
- **CEP**: Busca automática de endereço via AwesomeAPI
- **Campos obrigatórios**: Validação antes de avançar etapas

### 🗺️ Geolocalização
- Busca automática de **latitude/longitude** via CEP
- Armazenamento de **código IBGE** da cidade
- Integração com `cityId` do IXC para cadastros

### 📱 Responsividade
- Layout adaptável para **mobile, tablet e desktop**
- Componentes otimizados com Tailwind CSS
- Ícones vetoriais via Lucide React

### 🎨 UX/UI Moderna
- **Indicadores de progresso** visuais
- **Loading states** em requisições assíncronas
- **Feedback de erros** com mensagens claras
- **Animações suaves** entre transições

---

## 🛠️ Tecnologias

### Core

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 18.3+ | Framework principal |
| **Vite** | 5.0+ | Build tool e dev server |
| **Tailwind CSS** | 3.4+ | Estilização utility-first |
| **Lucide React** | Latest | Biblioteca de ícones |

### Dependências Principais

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "^0.263.1"
}
```

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend rodando em `http://localhost:5000`

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/GabrielMarques011/Auto_AgendamentoREACT.git

# Entre no diretório
cd Auto_AgendamentoREACT

# Instale as dependências
npm install
# ou
yarn install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API Backend
VITE_API_URL=http://localhost:5000

# Configurações opcionais
VITE_APP_TITLE=Sistema de Agendamento
```

### Ajustar URL da API

Se sua API estiver em outro endereço, edite as chamadas em `Screen6.jsx`:

```javascript
// Trocar de:
const API_URL = "http://localhost:5000";

// Para:
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

---

## 📁 Estrutura de Componentes

```
src/
├── components/
│   ├── Screen1.jsx          # 🔍 Busca de cliente (CPF/CNPJ)
│   ├── Screen2.jsx          # 📋 Seleção de contrato
│   ├── Screen3.jsx          # 🏠 Novo endereço (CEP + dados)
│   ├── Screen4.jsx          # 📍 Endereço antigo + porta
│   ├── Screen5.jsx          # 📅 Agendamento (data/período)
│   └── Screen6.jsx          # ✅ Revisão e finalização
│
├── App.jsx                  # 🎯 Componente principal + navegação
├── main.jsx                 # ⚡ Ponto de entrada React
└── index.css                # 🎨 Estilos globais + Tailwind

public/
└── vite.svg                 # Logo da aplicação
```

### Descrição dos Componentes

#### **Screen1.jsx** - Busca de Cliente
```jsx
- Busca por CPF/CNPJ
- Validação e formatação automática
- Carrega dados do cliente via API
- Exibe nome, telefone e email
```

#### **Screen2.jsx** - Seleção de Contrato
```jsx
- Lista contratos ativos do cliente
- Exibe plano, status e valor
- Permite seleção de um contrato
- Carrega dados do endereço atual
```

#### **Screen3.jsx** - Novo Endereço
```jsx
- Busca de CEP com autocompletar
- Campos: rua, número, bairro, complemento
- Suporte a condomínio (sim/não)
- Captura latitude/longitude/city_ibge
```

#### **Screen4.jsx** - Endereço Antigo
```jsx
- Pré-preenche com dados do contrato
- Opção "Tem porta?" (sim/não)
- Campo para número da porta (ex: "Porta 8 - OLT Centro")
```

#### **Screen5.jsx** - Agendamento
```jsx
- Seleção de data (date picker)
- Período: Manhã, Tarde, Comercial
- Tipo de valor: Taxa ou Renovação
- Campo opcional para valor da taxa
```

#### **Screen6.jsx** - Revisão e Envio
```jsx
- Exibe todos os dados para revisão
- Cards organizados por categoria
- Botão "Finalizar Agendamento"
- Chama /api/transfer e /api/update_contrato
```

---

## 🔄 Fluxo da Aplicação

### Estado Global (`formData`)

O estado é gerenciado no **App.jsx** e compartilhado entre componentes:

```javascript
const [formData, setFormData] = useState({
  // Dados do cliente
  clientId: "",
  contractId: "",
  nome_cliente: "",
  telefone_celular: "",
  
  // Novo endereço
  cep: "",
  address: "",
  number: "",
  neighborhood: "",
  city: "",
  cityId: "",           // ID da cidade no IXC
  state: "",
  complemento: "",
  lat: "",              // Latitude
  lng: "",              // Longitude
  city_ibge: "",        // Código IBGE
  
  // Endereço antigo
  oldAddress: "",
  oldNumber: "",
  oldNeighborhood: "",
  oldCep: "",
  oldCity: "",
  hasPorta: false,
  portaNumber: "",
  
  // Agendamento
  scheduledDate: "",
  period: "",           // manha, tarde, comercial
  valueType: "",        // taxa, renovacao
  taxValue: ""
});
```

### Navegação entre Telas

```javascript
// App.jsx
const [currentStep, setCurrentStep] = useState(1);

const nextStep = () => setCurrentStep(prev => prev + 1);
const prevStep = () => setCurrentStep(prev => prev - 1);

// Renderização condicional
{currentStep === 1 && <Screen1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
{currentStep === 2 && <Screen2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
// ... e assim por diante
```

---

## 📖 Guia de Uso

### 1️⃣ Buscar Cliente

1. Digite o **CPF ou CNPJ** do cliente
2. Clique em **"Buscar Cliente"**
3. Sistema valida e busca dados no IXC
4. Exibe nome, telefone e email
5. Clique em **"Próximo"** para continuar

### 2️⃣ Selecionar Contrato

1. Visualize a lista de **contratos ativos**
2. Identifique o contrato por plano/status
3. Clique no cartão do contrato desejado
4. Dados do endereço atual são carregados
5. Avance para a próxima etapa

### 3️⃣ Informar Novo Endereço

1. Digite o **CEP** do novo endereço
2. Sistema busca automaticamente rua, bairro, cidade
3. Preencha **número** e **complemento**
4. Se for condomínio, marque e informe o nome
5. Latitude/longitude são capturadas automaticamente

### 4️⃣ Informar Endereço Antigo

1. Dados pré-preenchidos do contrato atual
2. Ajuste se necessário
3. **Tem porta?** → Se sim, informe o número
4. Ex: "Porta 8 - OLT Centro"

### 5️⃣ Agendar Visita

1. Escolha a **data** da visita técnica
2. Selecione o **período**: Manhã (9h), Tarde (14h) ou Comercial (10h)
3. Defina o **tipo de valor**:
   - **Renovação**: Isento mediante renovação de fidelidade
   - **Taxa**: Informe o valor a ser cobrado

### 6️⃣ Revisar e Finalizar

1. **Revise TODOS os dados** exibidos
2. Verifique especialmente:
   - Nome e contato do cliente
   - Novo endereço (com lat/lng)
   - Data e período do agendamento
   - Valor da taxa (se aplicável)
3. Clique em **"Finalizar Agendamento"**
4. Sistema irá:
   - ✅ Criar ticket no IXC
   - ✅ Gerar OS de transferência
   - ✅ Criar OS de desativação de porta
   - ✅ Atualizar contrato com novo endereço
5. Mensagem de sucesso será exibida

---

## 🎨 Personalização

### Alterar Cores do Tema

Edite `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Azul
        secondary: '#10B981',  // Verde
        danger: '#EF4444',     // Vermelho
      }
    }
  }
}
```

### Adicionar Novos Campos

**Exemplo: Adicionar campo "Observações" na Screen5**

```jsx
// Screen5.jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Observações
  </label>
  <textarea
    value={formData.observacoes || ""}
    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    rows="4"
  />
</div>
```

### Modificar Períodos de Agendamento

```jsx
// Screen5.jsx - adicionar novo período
const periods = [
  { value: "manha", label: "Manhã (09:00)", hour: "09:00:00" },
  { value: "tarde", label: "Tarde (14:00)", hour: "14:00:00" },
  { value: "comercial", label: "Comercial (10:00)", hour: "10:00:00" },
  { value: "noite", label: "Noite (18:00)", hour: "18:00:00" } // NOVO
];
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor local em http://localhost:5173

# Build de produção
npm run build        # Gera build otimizado em /dist

# Preview do build
npm run preview      # Testa build de produção localmente

# Linting
npm run lint         # Verifica erros no código
```

---

## 🐛 Solução de Problemas

### Erro: "Failed to fetch"

**Causa**: Backend não está rodando ou URL incorreta

**Solução**:
```bash
# Verifique se o backend está rodando
curl http://localhost:5000/api/cliente

# Se necessário, ajuste a URL no código
const API_URL = "http://SEU_IP:5000";
```

### CEP não encontra endereço

**Causa**: CEP inválido ou API externa fora do ar

**Solução**:
- Verifique se o CEP está correto (8 dígitos)
- Teste a API: https://cep.awesomeapi.com.br/json/01310100
- Preencha os campos manualmente se necessário

### Latitude/Longitude vazias

**Causa**: API de CEP não retornou coordenadas

**Solução**:
- Ative geocoding no backend (`.env`: `GEOCODE_ENABLED=true`)
- Ou preencha manualmente no contrato após envio

---

## 📊 Performance

### Otimizações Implementadas

- ✅ **Code splitting** automático pelo Vite
- ✅ **Lazy loading** de ícones via Lucide
- ✅ **Debounce** em buscas de CEP (300ms)
- ✅ **Memoização** de componentes pesados
- ✅ Build otimizado com **tree-shaking**

### Bundle Size

```
dist/
├── index.html          ~2KB
├── assets/
│   ├── index-xxx.js    ~150KB (gzipped: ~50KB)
│   └── index-xxx.css   ~8KB (gzipped: ~2KB)
```

---

## 🔒 Segurança

### Boas Práticas

- ✅ Validação de **CPF/CNPJ** no frontend e backend
- ✅ Sanitização de inputs antes de enviar
- ✅ Uso de **HTTPS** em produção
- ✅ Não armazena dados sensíveis no localStorage
- ✅ CORS configurado no backend

### Dados Sensíveis

⚠️ **Nunca commit**:
- Tokens de API
- Credenciais de acesso
- IPs internos em produção

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

### Deploy em Vercel

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy em Netlify

```bash
# Build
npm run build

# Arraste a pasta /dist para Netlify
# Ou use o Netlify CLI:
netlify deploy --prod --dir=dist
```

### Variáveis de Ambiente (Produção)

```env
VITE_API_URL=https://sua-api.com.br
```

---

## 🤝 Contribuindo

### Como Contribuir

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit suas mudanças: `git commit -m 'Adiciona MinhaFeature'`
4. Push para a branch: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

### Padrões de Código

- Use **PascalCase** para componentes
- Use **camelCase** para variáveis/funções
- Adicione **comentários** em lógicas complexas
- Mantenha componentes com **< 300 linhas**
- Escreva **commits descritivos**

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Gabriel Marques**

- GitHub: [@GabrielMarques011](https://github.com/GabrielMarques011)
- Frontend: [Auto_AgendamentoREACT](https://github.com/GabrielMarques011/Auto_AgendamentoREACT)
- Backend: [Auto_Agendamento_BACKEND](https://github.com/GabrielMarques011/Auto_Agendamento_BACKEND)

---

## 🔗 Links Úteis

- [Documentação React](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons)
- [Vite Guide](https://vitejs.dev/guide/)
- [Backend deste projeto](https://github.com/GabrielMarques011/Auto_Agendamento_BACKEND)

---

## 📞 Suporte

Encontrou um bug? Tem uma sugestão?

- Abra uma [issue](https://github.com/GabrielMarques011/Auto_AgendamentoREACT/issues)
- Entre em contato via GitHub

---

<div align="center">

### ✨ Interface desenvolvida com React + Tailwind

**Sistema completo de agendamento integrado com IXC Soft**

⭐ Gostou? Deixe uma estrela no repositório!

[🔙 Voltar ao Backend](https://github.com/GabrielMarques011/Auto_Agendamento_BACKEND) | [📖 Documentação Completa](#)

</div>
