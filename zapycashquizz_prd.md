# PRD - Zapycash Quiz Marketing Funnel

## 📋 Resumo Executivo

### Produto
Funil de marketing interativo baseado em quiz para qualificação de leads e conversão para os planos do Zapycash.

### Objetivo
Criar um sistema de qualificação de leads através de quiz sobre saúde financeira, proporcionando diagnóstico personalizado e apresentação da solução Zapycash com conversão direta para planos pagos via checkout.

### Stack Tecnológica
- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Backend**: Supabase
- **Hospedagem**: Vercel/Netlify (sugerido)

---

## 🎯 Objetivos e Métricas

### Objetivos Principais
1. Capturar dados de comportamento financeiro dos usuários
2. Gerar diagnósticos personalizados baseados nas respostas
3. Converter leads qualificados em assinantes dos planos Zapycash
4. Criar experiência engajante e educativa sobre saúde financeira

### KPIs
- Taxa de conclusão do quiz (meta: >70%)
- Taxa de conversão para WhatsApp (meta: >15%)
- Taxa de conversão para planos pagos (meta: >5%)
- Tempo médio de conclusão (meta: 3-5 minutos)

---

## 👤 Personas e Jornada do Usuário

### Persona Principal
**Nome**: João, 25-45 anos
**Perfil**: Pessoa com dificuldades financeiras, busca organização financeira
**Dores**: Dinheiro não sobra, ansiedade financeira, falta de controle de gastos

### Jornada do Usuário
```
Entrada → Quiz (7 etapas) → Análise → Diagnóstico → Vídeos → Perfil → Loading → Conversão
```

---

## 🏗️ Arquitetura e Componentes

### Estrutura de Páginas
1. **Landing Page** (`index.html`)
2. **Quiz Flow** (SPA com JavaScript)
3. **Results & Conversion** (continuação do SPA)

### Componentes Principais

#### 1. Quiz Engine
- Gerenciamento de estado das respostas
- Sistema de pontuação para diagnóstico
- Barra de progresso dinâmica
- Transições entre perguntas

#### 2. Scoring System
- Algoritmo de pontuação baseado em pesos das respostas
- Classificação em perfis financeiros
- Geração de diagnósticos personalizados

#### 3. Conversion Flow
- Apresentação de vídeos (embedded)
- Seleção de perfil de uso
- Exibição de planos e preços
- Integração com checkout

---

## 🗂️ Estrutura de Dados - Supabase

### Tabela: `quiz_responses`
```sql
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  question_1 TEXT,
  question_2 TEXT,
  question_3 TEXT,
  question_4 TEXT,
  question_5 TEXT,
  question_6 TEXT,
  question_7 TEXT,
  profile_type TEXT, -- 'personal' ou 'business'
  diagnosis_type TEXT, -- resultado do algoritmo
  completed_at TIMESTAMP DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  conversion_plan TEXT, -- plano escolhido (se houver)
  ip_address INET,
  user_agent TEXT
);
```

### Tabela: `quiz_analytics`
```sql
CREATE TABLE quiz_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  event_type TEXT, -- 'start', 'question_answered', 'video_watched', 'conversion'
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 Especificações de UI/UX

### Design System
- **Colors**: 
  - Primary: `#10B981` (green-500)
  - Secondary: `#3B82F6` (blue-500)
  - Accent: `#F59E0B` (amber-500)
  - Danger: `#EF4444` (red-500)
- **Typography**: Inter/System fonts
- **Spacing**: Scale 4px base (4, 8, 16, 24, 32, 48, 64px)

### Responsividade
- Mobile First (320px+)
- Tablet (768px+)
- Desktop (1024px+)

### Componentes de Interface

#### Tela Inicial
```html
<!-- Hero Section -->
- Headline: H1, bold, center-aligned
- Subheadline: Text-lg, text-gray-600
- CTA Button: Large, primary color, with emoji
- Background: Gradient ou cor sólida
```

#### Quiz Interface
```html
<!-- Question Card -->
- Progress Bar: Visual indicator (1/7)
- Question Text: H2, clear typography
- Multiple Choice Options: Cards com hover effects
- Navigation: Next/Previous buttons
```

#### Results Section
```html
<!-- Diagnosis Card -->
- Emoji + Title: Visual identity do resultado
- Description: Personalized text
- CTA: Video preview buttons
```

---

## ⚙️ Funcionalidades Técnicas

### Core Features (MVP)

#### 1. Quiz Engine
```javascript
class QuizEngine {
  constructor() {
    this.currentQuestion = 0;
    this.responses = {};
    this.sessionId = this.generateSessionId();
  }
  
  nextQuestion() { /* lógica */ }
  saveResponse(questionId, answer) { /* lógica */ }
  calculateDiagnosis() { /* algoritmo de pontuação */ }
  submitToSupabase() { /* envio de dados */ }
}
```

#### 2. Scoring Algorithm
```javascript
const scoringRules = {
  'anxious': { q1: ['Sim, com certeza'], q3: ['Ansiedade'] },
  'disorganized': { q2: ['Todas essas'], q6: ['Não controlo'] },
  'struggling': { q4: ['Sim, várias vezes'], q5: ['Não'] }
};
```

#### 3. Video Integration
- Embedded videos (YouTube/Vimeo)
- Tracking de visualização
- Auto-play considerations (mobile)

#### 4. WhatsApp Integration
```javascript
function openWhatsApp(message) {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/5511999999999?text=${encodedMessage}`);
}
```

### Advanced Features (Fase 2)
- A/B testing de headlines
- Heat mapping com Hotjar
- Pixel do Facebook/Google Analytics
- Lead scoring avançado

---

## 💰 Sistema de Preços e Conversão

### Planos Disponíveis
```javascript
const plans = {
  personal: {
    monthly: { price: 19.90, currency: 'BRL' },
    annual: { price: 67.00, currency: 'BRL', discount: '72%' }
  },
  business: {
    monthly: { price: 29.90, currency: 'BRL' },
    annual: { price: 97.00, currency: 'BRL', discount: '73%' }
  }
};
```

### Conversion Flow
1. **Diagnosis Display** → Watch Videos CTA
2. **Video Completion** → Profile Selection
3. **Profile Selection** → Loading Animation
4. **Loading Complete** → Plans Display
5. **Plan Selection** → Checkout Redirect

### Checkout Button Templates
```javascript
const checkoutButtons = {
  personal_monthly: {
    text: "Assinar Plano Pessoal Mensal - R$ 19,90",
    url: "https://checkout.example.com/personal-monthly"
  },
  personal_annual: {
    text: "Assinar Plano Pessoal Anual - R$ 67,00",
    url: "https://checkout.example.com/personal-annual"
  },
  business_monthly: {
    text: "Assinar Plano Profissional Mensal - R$ 29,90",
    url: "https://checkout.example.com/business-monthly"
  },
  business_annual: {
    text: "Assinar Plano Profissional Anual - R$ 97,00",
    url: "https://checkout.example.com/business-annual"
  }
};
```

---

## 🧪 Algoritmo de Diagnóstico

### Lógica de Pontuação
```javascript
function calculateDiagnosis(responses) {
  let score = {
    anxiety: 0,
    disorganization: 0,
    financial_stress: 0
  };
  
  // Pergunta 1: Situação afeta sono
  if (responses.q1 === 'Sim, com certeza') score.anxiety += 3;
  if (responses.q1 === 'Um pouco') score.anxiety += 1;
  
  // Pergunta 2: Maior dificuldade
  if (responses.q2 === 'Todas essas') score.disorganization += 3;
  
  // ... lógica para todas as perguntas
  
  return getDiagnosisType(score);
}

function getDiagnosisType(score) {
  if (score.anxiety >= 6) return 'anxious_spender';
  if (score.disorganization >= 5) return 'disorganized';
  if (score.financial_stress >= 4) return 'struggling';
  return 'getting_started';
}
```

### Tipos de Diagnóstico
```javascript
const diagnosisTypes = {
  'anxious_spender': {
    title: '😰 Ansiedade Financeira!',
    description: 'Você sente muito stress com dinheiro e isso afeta seu bem-estar.',
    emoji: '😰'
  },
  'disorganized': {
    title: '😵‍💫 Falta de Clareza!',
    description: 'Você até tenta se organizar, mas os pequenos gastos descontrolados no fim do mês acabam gerando frustração.',
    emoji: '😵‍💫'
  },
  'struggling': {
    title: '😔 Dificuldades Constantes!',
    description: 'Você passa por apertos frequentes e já precisou deixar de fazer coisas importantes.',
    emoji: '😔'
  },
  'getting_started': {
    title: '🌱 Começando a Organizar!',
    description: 'Você já tem algum controle, mas pode melhorar muito com as ferramentas certas.',
    emoji: '🌱'
  }
};
```

---

## 📱 Especificações Mobile

### Considerações Mobile-First
- Touch targets mínimo 44px
- Swipe gestures para navegação
- Loading states apropriados
- Viewport meta tag configurado
- PWA considerations (service worker)

### Performance
- Lazy loading de imagens
- Minificação de assets
- CDN para TailwindCSS
- Otimização de imagens (WebP)

---

## 🔗 Integrações Externas

### Supabase Setup
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// Função para salvar respostas
async function saveQuizResponse(data) {
  const { data: result, error } = await supabase
    .from('quiz_responses')
    .insert([data])
  
  if (error) console.error('Error:', error)
  return result
}
```

### Analytics Tracking
```javascript
// Google Analytics 4
gtag('event', 'quiz_started', {
  'event_category': 'engagement',
  'event_label': 'financial_health_quiz'
});

// Facebook Pixel
fbq('track', 'Lead', {
  content_name: 'Financial Health Quiz',
  content_category: 'Quiz'
});
```

---

## 🎬 Especificações de Vídeo

### Vídeo 1: Sistema Zapycash Demo (30-60s)
- **Conteúdo**: Demonstração do funcionamento do sistema Zapycash
- **CTA**: "Quero organizar minhas finanças assim"
- **Formato**: MP4, responsivo

### Vídeo 2: Dashboard Demo (30-60s)
- **Conteúdo**: Demonstração do painel com gráficos
- **CTA**: "Quero ver meus relatórios assim"
- **Formato**: MP4, responsivo

### Implementação
```html
<video 
  class="w-full rounded-lg shadow-lg" 
  controls 
  poster="video-thumbnail.jpg"
  preload="metadata">
  <source src="zapycash-whatsapp-demo.mp4" type="video/mp4">
  <p>Seu navegador não suporta vídeo HTML5.</p>
</video>
```

---

## ✅ Checklist de Implementação

### Fase 1: MVP Core (Semana 1-2)
- [ ] Estrutura HTML básica
- [ ] Configuração TailwindCSS
- [ ] Quiz engine JavaScript
- [ ] Sistema de pontuação
- [ ] Integração Supabase básica
- [ ] Telas principais (1-9)
- [ ] Responsividade mobile

### Fase 2: Conversão (Semana 3)
- [ ] Vídeos integrados
- [ ] WhatsApp integration
- [ ] Sistema de planos
- [ ] FAQ interativo
- [ ] Analytics setup
- [ ] Performance optimization

### Fase 3: Refinamento (Semana 4)
- [ ] A/B testing setup
- [ ] Advanced analytics
- [ ] Error handling
- [ ] Loading states
- [ ] User feedback collection
- [ ] SEO optimization

---

## 🚀 Deploy e Infraestrutura

### Ambiente de Desenvolvimento
```bash
# Estrutura de pastas
zapycash-quiz/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── videos/
├── config/
│   └── supabase.js
└── README.md
```

### Deploy
- **Hosting**: Vercel/Netlify
- **Domain**: Subdomínio ou domínio próprio
- **SSL**: Automático via hosting
- **CDN**: Cloudflare (opcional)

### Variáveis de Ambiente
```javascript
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY,
  whatsappNumber: process.env.VITE_WHATSAPP_NUMBER,
  analyticsId: process.env.VITE_GA_ID
};
```

---

## 📊 Métricas e Analytics

### Eventos para Tracking
```javascript
const trackingEvents = {
  'quiz_started': 'Usuário iniciou o quiz',
  'question_answered': 'Resposta enviada (por pergunta)',
  'quiz_completed': 'Quiz completado',
  'video_watched': 'Vídeo assistido',
  'profile_selected': 'Perfil selecionado',
  'plan_clicked': 'Clique em plano',
  'checkout_redirected': 'Redirecionamento para checkout',
  'faq_expanded': 'FAQ expandido'
};
```

### Dashboard Supabase
- Query builder para análise de respostas
- Relatórios de conversão
- Métricas de abandono por etapa

---

## 🔒 Considerações de Segurança e Privacidade

### LGPD Compliance
- Não coleta dados pessoais identificáveis
- Apenas behavioral data
- Session-based tracking
- Clear data retention policy

### Segurança Técnica
- Rate limiting no Supabase
- Input sanitization
- HTTPS obrigatório
- Environment variables para configs sensíveis

---

## 🎯 Critérios de Sucesso

### Métricas de Produto
- **Completion Rate**: >70%
- **Time to Complete**: 3-5 minutos
- **Conversion to Checkout**: >15%
- **Mobile Usage**: >60%

### Métricas de Negócio
- **Cost Per Lead**: <R$5
- **Lead to Customer**: >5%
- **Customer Acquisition Cost**: <R$100
- **Return on Ad Spend**: >300%

---

## 📅 Cronograma de Entrega

### Sprint 1 (Semana 1-2): MVP Core
- Setup inicial e configurações
- Desenvolvimento das telas 1-5
- Integração básica Supabase
- Testes de funcionalidade

### Sprint 2 (Semana 3): Conversão
- Telas 6-10
- Sistema de vídeos
- Integração WhatsApp
- Testes de conversão

### Sprint 3 (Semana 4): Refinamento
- Polimento de UX
- Performance optimization
- Analytics avançado
- Deploy production

---

Este PRD serve como guia completo para desenvolvimento do funil de quiz Zapycash, cobrindo todos os aspectos técnicos, de negócio e de experiência do usuário necessários para uma implementação bem-sucedida.