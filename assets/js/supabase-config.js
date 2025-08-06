// Configuração do Supabase
const SUPABASE_URL = 'https://tyoyliefcbxaqskvlcud.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3lsaWVmY2J4YXFza3ZsY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODA0MDEsImV4cCI6MjA3MDA1NjQwMX0.aZWvrbKrqHa36ucl0jxYGgaAO4KwnK4Oj5cOMBYSypI'

// Inicialização do cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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

// Função para registrar eventos de analytics (desabilitada temporariamente)
async function trackEvent(sessionId, eventType, eventData = {}) {
    // Temporariamente desabilitado para evitar erros no console
    console.log('Track event (disabled):', eventType, eventData);
    return Promise.resolve(true);
}

// Função para marcar conversão (desabilitada temporariamente)
async function markConversion(sessionId, plan) {
    // Temporariamente desabilitado para evitar erros no console
    console.log('Mark conversion (disabled):', plan);
    return Promise.resolve(true);
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

// Função para gerar session ID único
function generateSessionId() {
    return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Função para obter ou criar session ID
function getSessionId() {
    let sessionId = localStorage.getItem('zapycash_session_id')
    if (!sessionId) {
        sessionId = generateSessionId()
        localStorage.setItem('zapycash_session_id', sessionId)
    }
    return sessionId
}

// Teste de conexão com Supabase
async function testSupabaseConnection() {
    console.log('Testando conexão com Supabase...')
    
    const testSessionId = 'test_' + Date.now()
    
    try {
        const { data, error } = await supabase
            .from('quiz_responses')
            .insert([{
                session_id: testSessionId,
                question_1: 'Teste de conexão',
                diagnosis_type: 'test'
            }])
        
        if (error) {
            console.error('❌ Erro na inserção:', error)
            return false
        }
        
        console.log('✅ Supabase conectado com sucesso!')
        return true
        
    } catch (err) {
        console.error('❌ Erro inesperado:', err)
        return false
    }
}