# 🗄️ Guia de Setup - Supabase para Zapycash Quiz

## 📋 Informações do Projeto

**URL do Projeto**: `https://tyoyliefcbxaqskvlcud.supabase.co`  
**Project ID**: `tyoyliefcbxaqskvlcud`  
**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3lsaWVmY2J4YXFza3ZsY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODA0MDEsImV4cCI6MjA3MDA1NjQwMX0.aZWvrbKrqHa36ucl0jxYGgaAO4KwnK4Oj5cOMBYSypI`

---

## 🏗️ Criação das Tabelas

### 1. Acesse o SQL Editor no Supabase

1. Vá para o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto `tyoyliefcbxaqskvlcud`
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New Query"**

### 2. Execute o SQL para Criar as Tabelas

Copie e cole o código SQL abaixo no editor e execute:

```sql
-- Habilitação da extensão UUID (se não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela principal para armazenar as respostas do quiz
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL UNIQUE,
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
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela para analytics detalhado
CREATE TABLE quiz_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'start', 'question_answered', 'video_watched', 'conversion'
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- Foreign key para quiz_responses
  FOREIGN KEY (session_id) REFERENCES quiz_responses(session_id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_quiz_responses_session_id ON quiz_responses(session_id);
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at);
CREATE INDEX idx_quiz_responses_diagnosis_type ON quiz_responses(diagnosis_type);
CREATE INDEX idx_quiz_responses_converted ON quiz_responses(converted);

CREATE INDEX idx_quiz_analytics_session_id ON quiz_analytics(session_id);
CREATE INDEX idx_quiz_analytics_event_type ON quiz_analytics(event_type);
CREATE INDEX idx_quiz_analytics_timestamp ON quiz_analytics(timestamp);

-- Políticas RLS (Row Level Security) - permite acesso público para inserção
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_analytics ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (necessário para o quiz funcionar)
CREATE POLICY "Allow public insert" ON quiz_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert analytics" ON quiz_analytics FOR INSERT WITH CHECK (true);

-- Política para permitir leitura pública (opcional, para relatórios)
CREATE POLICY "Allow public read" ON quiz_responses FOR SELECT USING (true);
CREATE POLICY "Allow public read analytics" ON quiz_analytics FOR SELECT USING (true);
```

### 3. Verificação das Tabelas

Após executar o SQL, verifique se as tabelas foram criadas:

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quiz_responses', 'quiz_analytics');

-- Verificar estrutura da tabela quiz_responses
\d quiz_responses;

-- Verificar estrutura da tabela quiz_analytics
\d quiz_analytics;
```

---

## 💻 Configuração no Projeto

### 1. Instalação do Cliente Supabase

Se você estiver usando um bundler (Vite, Webpack, etc.), instale o cliente:

```bash
npm install @supabase/supabase-js
```

**OU** use via CDN no HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 2. Configuração do Cliente JavaScript

Crie um arquivo `config/supabase.js`:

```javascript
// config/supabase.js
const SUPABASE_URL = 'https://tyoyliefcbxaqskvlcud.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3lsaWVmY2J4YXFza3ZsY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODA0MDEsImV4cCI6MjA3MDA1NjQwMX0.aZWvrbKrqHa36ucl0jxYGgaAO4KwnK4Oj5cOMBYSypI'

// Inicialização do cliente Supabase
const supabase = window.supabase ? 
  window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) :
  supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Exportar para uso global
window.supabaseClient = supabase
```

### 3. Uso no HTML (Via CDN)

Se você preferir usar via CDN, adicione no `<head>` do seu HTML:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zapycash Quiz</title>
    
    <!-- Supabase CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <!-- Sua configuração -->
    <script>
        const SUPABASE_URL = 'https://tyoyliefcbxaqskvlcud.supabase.co'
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3lsaWVmY2J4YXFza3ZsY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODA0MDEsImV4cCI6MjA3MDA1NjQwMX0.aZWvrbKrqHa36ucl0jxYGgaAO4KwnK4Oj5cOMBYSypI'
        
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    </script>
</head>
<body>
    <!-- Seu conteúdo aqui -->
</body>
</html>
```

---

## 🚀 Funções JavaScript para Integração

### 1. Salvar Respostas do Quiz

```javascript
// Função para salvar as respostas do quiz
async function saveQuizResponse(sessionId, responses, profileType = null, diagnosisType = null) {
    try {
        const data = {
            session_id: sessionId,
            question_1: responses.q1 || null,
            question_2: responses.q2 || null,
            question_3: responses.q3 || null,
            question_4: responses.q4 || null,
            question_5: responses.q5 || null,
            question_6: responses.q6 || null,
            question_7: responses.q7 || null,
            profile_type: profileType,
            diagnosis_type: diagnosisType,
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent
        }
        
        const { data: result, error } = await supabase
            .from('quiz_responses')
            .insert([data])
        
        if (error) {
            console.error('Erro ao salvar respostas:', error)
            return { success: false, error }
        }
        
        console.log('Respostas salvas com sucesso:', result)
        return { success: true, data: result }
        
    } catch (err) {
        console.error('Erro inesperado:', err)
        return { success: false, error: err }
    }
}

// Função auxiliar para pegar IP do cliente
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        return data.ip
    } catch (error) {
        return null
    }
}
```

### 2. Registrar Eventos de Analytics

```javascript
// Função para registrar eventos de analytics
async function trackEvent(sessionId, eventType, eventData = {}) {
    try {
        const data = {
            session_id: sessionId,
            event_type: eventType,
            event_data: eventData
        }
        
        const { error } = await supabase
            .from('quiz_analytics')
            .insert([data])
        
        if (error) {
            console.error('Erro ao registrar evento:', error)
            return false
        }
        
        console.log(`Evento registrado: ${eventType}`)
        return true
        
    } catch (err) {
        console.error('Erro ao registrar evento:', err)
        return false
    }
}

// Exemplos de uso do tracking
function initializeTracking(sessionId) {
    // Início do quiz
    trackEvent(sessionId, 'quiz_started')
    
    // Resposta a uma pergunta
    // trackEvent(sessionId, 'question_answered', { question: 1, answer: 'Sim, com certeza' })
    
    // Vídeo assistido
    // trackEvent(sessionId, 'video_watched', { video: 'dashboard_demo', duration: 45 })
    
    // Perfil selecionado
    // trackEvent(sessionId, 'profile_selected', { profile: 'personal' })
    
    // Clique em plano
    // trackEvent(sessionId, 'plan_clicked', { plan: 'personal_annual', price: 67.00 })
    
    // Redirecionamento para checkout
    // trackEvent(sessionId, 'checkout_redirected', { plan: 'personal_annual', checkout_url: 'https://checkout.example.com' })
}
```

### 3. Atualizar Conversão

```javascript
// Função para marcar quando usuário converte
async function markConversion(sessionId, plan) {
    try {
        const { error } = await supabase
            .from('quiz_responses')
            .update({ 
                converted: true, 
                conversion_plan: plan 
            })
            .eq('session_id', sessionId)
        
        if (error) {
            console.error('Erro ao marcar conversão:', error)
            return false
        }
        
        // Registrar evento de conversão
        await trackEvent(sessionId, 'conversion', { plan })
        
        return true
        
    } catch (err) {
        console.error('Erro ao marcar conversão:', err)
        return false
    }
}
```

### 4. Gerar Session ID Único

```javascript
// Função para gerar um session ID único
function generateSessionId() {
    return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Uso no início do quiz
const sessionId = generateSessionId()
console.log('Session ID:', sessionId)

// Salvar no localStorage para persistir durante a sessão
localStorage.setItem('zapycash_session_id', sessionId)

// Recuperar session ID existente
function getSessionId() {
    let sessionId = localStorage.getItem('zapycash_session_id')
    if (!sessionId) {
        sessionId = generateSessionId()
        localStorage.setItem('zapycash_session_id', sessionId)
    }
    return sessionId
}
```

---

## 📊 Consultas Úteis para Analytics

### 1. Ver todas as respostas

```sql
SELECT * FROM quiz_responses ORDER BY created_at DESC LIMIT 10;
```

### 2. Analytics por diagnóstico

```sql
SELECT 
    diagnosis_type,
    COUNT(*) as total,
    COUNT(CASE WHEN converted = true THEN 1 END) as converted,
    ROUND(
        (COUNT(CASE WHEN converted = true THEN 1 END) * 100.0 / COUNT(*)), 
        2
    ) as conversion_rate
FROM quiz_responses 
WHERE diagnosis_type IS NOT NULL
GROUP BY diagnosis_type;
```

### 3. Respostas mais comuns por pergunta

```sql
SELECT 
    'Pergunta 1' as pergunta,
    question_1 as resposta,
    COUNT(*) as total
FROM quiz_responses 
WHERE question_1 IS NOT NULL
GROUP BY question_1
ORDER BY total DESC;
```

### 4. Eventos mais frequentes

```sql
SELECT 
    event_type,
    COUNT(*) as total,
    COUNT(DISTINCT session_id) as unique_sessions
FROM quiz_analytics 
GROUP BY event_type 
ORDER BY total DESC;
```

### 5. Funil de conversão

```sql
SELECT 
    'Quiz Iniciado' as etapa,
    COUNT(DISTINCT qa.session_id) as total
FROM quiz_analytics qa 
WHERE qa.event_type = 'quiz_started'

UNION ALL

SELECT 
    'Quiz Completado' as etapa,
    COUNT(*) as total
FROM quiz_responses qr 
WHERE qr.question_7 IS NOT NULL

UNION ALL

SELECT 
    'Convertido' as etapa,
    COUNT(*) as total
FROM quiz_responses qr 
WHERE qr.converted = true;
```

---

## 🔒 Segurança e RLS

As políticas RLS (Row Level Security) estão configuradas para permitir:

- ✅ **Inserção pública**: Qualquer usuário pode inserir dados
- ✅ **Leitura pública**: Qualquer usuário pode ler dados (para relatórios)
- ❌ **Atualização/Exclusão**: Apenas usuários autenticados

Se você quiser restringir a leitura dos dados, remova a política de leitura:

```sql
-- Remover acesso de leitura pública
DROP POLICY "Allow public read" ON quiz_responses;
DROP POLICY "Allow public read analytics" ON quiz_analytics;
```

---

## 🧪 Teste de Conexão

Para testar se tudo está funcionando, execute este código no console do navegador:

```javascript
// Teste de conexão
async function testSupabaseConnection() {
    console.log('Testando conexão com Supabase...')
    
    // Teste básico de inserção
    const testSessionId = 'test_' + Date.now()
    
    try {
        // Inserir dados de teste
        const { data, error } = await supabase
            .from('quiz_responses')
            .insert([{
                session_id: testSessionId,
                question_1: 'Teste',
                diagnosis_type: 'test'
            }])
        
        if (error) {
            console.error('❌ Erro na inserção:', error)
            return false
        }
        
        console.log('✅ Inserção bem-sucedida:', data)
        
        // Teste de leitura
        const { data: readData, error: readError } = await supabase
            .from('quiz_responses')
            .select('*')
            .eq('session_id', testSessionId)
        
        if (readError) {
            console.error('❌ Erro na leitura:', readError)
            return false
        }
        
        console.log('✅ Leitura bem-sucedida:', readData)
        console.log('🎉 Supabase configurado corretamente!')
        
        return true
        
    } catch (err) {
        console.error('❌ Erro inesperado:', err)
        return false
    }
}

// Execute o teste
testSupabaseConnection()
```

---

## ✅ Checklist de Setup

- [ ] Executar SQL no Supabase Dashboard
- [ ] Verificar se as tabelas foram criadas
- [ ] Configurar cliente JavaScript
- [ ] Testar conexão com `testSupabaseConnection()`
- [ ] Implementar funções de salvamento no projeto
- [ ] Testar fluxo completo do quiz
- [ ] Verificar dados no dashboard do Supabase

---

Agora seu projeto está pronto para se conectar com o Supabase e armazenar todos os dados do quiz! 🚀