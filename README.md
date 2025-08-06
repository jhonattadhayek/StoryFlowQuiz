# 🎯 Zapycash Quiz - Funil de Marketing Financeiro

Um quiz interativo para qualificação de leads e conversão em assinantes dos planos Zapycash.

## 📋 Sobre o Projeto

Este é um funil de marketing baseado em quiz sobre saúde financeira que:
- ✅ Qualifica leads através de 7 perguntas estratégicas
- ✅ Gera diagnósticos personalizados usando algoritmo de pontuação
- ✅ Apresenta planos personalizados baseados no perfil do usuário
- ✅ Integra com Supabase para analytics e armazenamento de dados
- ✅ Converte através de WhatsApp e checkout direto

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Backend**: Supabase (Database + Analytics)
- **Hospedagem**: Vercel/Netlify compatível
- **Design**: Mobile-First, Responsivo

## 📁 Estrutura do Projeto

```
quiz-zapycash/
├── index.html                 # Página principal (SPA)
├── assets/
│   ├── js/
│   │   ├── supabase-config.js # Configuração do Supabase
│   │   ├── quiz-engine.js     # Engine do quiz e algoritmos
│   │   └── app.js            # Interface e controle de telas
│   ├── css/                  # CSS customizado (se necessário)
│   ├── images/               # Imagens e personagens 3D
│   │   ├── financial-advisor-character.png  # Tela inicial
│   │   ├── success-character.png           # Tela de conversão
│   │   ├── README.md         # Guia completo de imagens
│   │   └── image-urls.txt    # URLs para teste rápido
│   └── videos/               # Vídeos demonstrativos
└── README.md
```

## ⚙️ Configuração

### 1. Supabase
As tabelas já foram criadas no Supabase:
- **URL**: `https://tyoyliefcbxaqskvlcud.supabase.co`
- **Tabelas**: `quiz_responses`, `quiz_analytics`

### 2. Execução Local
Simplesmente abra o `index.html` em um navegador ou sirva via servidor local:

```bash
# Usando Python
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server

# Usando PHP
php -S localhost:8000
```

### 3. ✅ Imagens de Personagens 3D INSTALADAS!
O projeto já inclui 2 personagens 3D estrategicamente posicionados:

**📸 img-boneca01.png** (Tela inicial - 1.2MB):
- Personagem amigável na landing page
- Animação bounce para chamar atenção  
- Aumenta confiança e conexão emocional

**📸 img-boneca02.png** (Tela de conversão - 805KB):
- Personagem na tela de planos
- Reforça o resultado positivo
- Aumenta taxa de conversão

**Status:** ✅ PRONTO PARA USO!

### 4. Deploy
O projeto é compatível com:
- **Vercel**: Faça deploy do diretório completo
- **Netlify**: Arraste a pasta para o Netlify  
- **GitHub Pages**: Push para repositório e ative Pages

## 🎮 Como Funciona

### Fluxo do Usuário
```
Landing → Quiz (7 perguntas) → Análise → Diagnóstico → Vídeos → Perfil → Loading → Planos → Conversão
```

### Sistema de Diagnóstico
O quiz usa um algoritmo de pontuação que classifica usuários em:

- **😰 Ansiedade Financeira**: Usuários com alto stress financeiro
- **😵‍💫 Falta de Clareza**: Usuários desorganizados financeiramente  
- **😔 Dificuldades Constantes**: Usuários com problemas financeiros recorrentes
- **🌱 Começando a Organizar**: Usuários com controle básico

### Planos Oferecidos
- **🧍 Pessoal**: R$ 19,90/mês ou R$ 67,00/ano (72% OFF)
- **🧑‍💼 Profissional**: R$ 29,90/mês ou R$ 97,00/ano (73% OFF)

## 📊 Analytics e Métricas

### Eventos Trackados
- `quiz_started` - Início do quiz
- `question_answered` - Cada resposta do quiz
- `diagnosis_shown` - Exibição do diagnóstico
- `video_watched` - Visualização de vídeos
- `profile_selected` - Seleção de perfil
- `plan_clicked` - Clique em planos
- `checkout_redirected` - Redirecionamento para checkout
- `whatsapp_clicked` - Clique no WhatsApp

### Consultas Úteis no Supabase

```sql
-- Taxa de conclusão
SELECT 
  COUNT(DISTINCT session_id) as total_started,
  COUNT(*) FILTER (WHERE question_7 IS NOT NULL) as completed,
  ROUND((COUNT(*) FILTER (WHERE question_7 IS NOT NULL) * 100.0 / COUNT(DISTINCT session_id)), 2) as completion_rate
FROM quiz_responses;

-- Conversão por diagnóstico
SELECT 
  diagnosis_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE converted = true) as converted,
  ROUND((COUNT(*) FILTER (WHERE converted = true) * 100.0 / COUNT(*)), 2) as conversion_rate
FROM quiz_responses 
WHERE diagnosis_type IS NOT NULL
GROUP BY diagnosis_type;
```

## 🎨 Personalização

### Cores (Tailwind)
- **Primary**: `#10B981` (green-500)
- **Secondary**: `#3B82F6` (blue-500) 
- **Accent**: `#F59E0B` (amber-500)
- **Danger**: `#EF4444` (red-500)

### WhatsApp
Altere o número no arquivo `quiz-engine.js`:
```javascript
const whatsappUrl = `https://wa.me/SEU_NUMERO?text=${encodedMessage}`
```

### Checkout URLs
Configure no `quiz-engine.js` na seção `plans`:
```javascript
checkoutUrl: 'https://sua-plataforma-de-checkout.com/plano'
```

## 📱 Mobile-First

- ✅ Touch targets mínimo 44px
- ✅ Responsivo em todos os dispositivos
- ✅ Otimizado para performance mobile
- ✅ Progressive Web App ready

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Dados não-pessoais coletados
- ✅ Session-based tracking
- ✅ HTTPS obrigatório em produção

## 🎯 KPIs e Objetivos

### Métricas de Produto
- **Taxa de conclusão**: Meta >70%
- **Tempo de conclusão**: 3-5 minutos
- **Conversão para checkout**: Meta >15%
- **Uso mobile**: Meta >60%

### Métricas de Negócio
- **Custo por Lead**: Meta <R$5
- **Lead para Cliente**: Meta >5%
- **CAC**: Meta <R$100
- **ROAS**: Meta >300%

## 🚨 Troubleshooting

### Problemas Comuns

1. **Quiz não carrega**
   - Verificar console do navegador
   - Testar conexão com Supabase
   - Verificar se todos os arquivos JS estão carregando

2. **Dados não salvam**
   - Verificar RLS policies no Supabase
   - Confirmar URLs e chaves de API
   - Verificar console para erros

3. **Layout quebrado**
   - Confirmar CDN do TailwindCSS
   - Verificar se todas as classes estão corretas
   - Testar em diferentes dispositivos

### Debug
Abra o console e execute:
```javascript
testSupabaseConnection() // Testa conexão com Supabase
quizEngine.responses     // Ver respostas atuais
localStorage.getItem('zapycash_session_id') // Ver session ID
```

## 📞 Suporte

Para dúvidas sobre implementação ou bugs:
1. Verificar este README
2. Consultar console do navegador
3. Testar funções de debug
4. Verificar Supabase Dashboard para logs

## 🎉 Pronto para Uso!

O projeto está completamente funcional e pronto para:
- ✅ Capturar leads
- ✅ Gerar diagnósticos
- ✅ Converter em vendas
- ✅ Coletar analytics

Basta configurar as URLs de checkout e o número do WhatsApp para começar a usar!