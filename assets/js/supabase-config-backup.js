// BACKUP DO ARQUIVO ORIGINAL - SUPABASE DESABILITADO PARA RESOLVER PROBLEMAS DE CONSOLE

// Função para salvar evento de tracking (desabilitada temporariamente)
window.trackEvent = function(sessionId, eventType, eventData = {}) {
    // Temporariamente desabilitado para evitar erros no console
    console.log('Track event (disabled):', eventType, eventData);
    return Promise.resolve(null);
}

// Função para marcar conversão (desabilitada temporariamente) 
window.markConversion = function(sessionId, planType) {
    // Temporariamente desabilitado para evitar erros no console
    console.log('Mark conversion (disabled):', planType);
    return Promise.resolve(null);
}

// Função para salvar resposta do quiz (desabilitada temporariamente)
window.saveQuizResponse = function(sessionId, responses, profile, diagnosisType) {
    // Temporariamente desabilitado para evitar erros no console
    console.log('Save quiz response (disabled):', { sessionId, responses, profile, diagnosisType });
    return Promise.resolve(null);
}

// Função para gerar ID de sessão
window.getSessionId = function() {
    let sessionId = localStorage.getItem('zapycash_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('zapycash_session_id', sessionId);
    }
    return sessionId;
}

// Função para gerar novo ID de sessão
window.generateSessionId = function() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

console.log('✅ Supabase config carregado (versão sem erros)');