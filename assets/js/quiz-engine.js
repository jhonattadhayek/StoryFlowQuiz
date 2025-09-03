// Quiz Engine - StoryFlow Instagram Stories Quiz
class QuizEngine {
    constructor() {
        this.currentQuestion = 0
        this.responses = {}
        this.sessionId = getSessionId()
        this.totalQuestions = 8
        this.selectedProfile = null
        this.diagnosisResult = null
        
        // Inicializar tracking
        this.initializeTracking()
    }

    // Perguntas do quiz
    questions = [
        {
            id: 'q1',
            text: 'Quando pensa em postar Stories, o que mais te atrapalha?',
            options: [
                { value: 'Não tenho ideias', emoji: '💭', weight: 3 },
                { value: 'Falta tempo para planejar', emoji: '⏰', weight: 2 },
                { value: 'Ninguém interage', emoji: '😔', weight: 2 },
                { value: 'Não consigo vender', emoji: '💰', weight: 3 }
            ]
        },
        {
            id: 'q2',
            text: 'Quantas vezes por semana você consegue postar Stories?',
            options: [
                { value: 'Quase nunca', emoji: '😴', weight: 3 },
                { value: 'De vez em quando', emoji: '🤷‍♀️', weight: 2 },
                { value: 'Todos os dias, mas sem estratégia', emoji: '📱', weight: 1 },
                { value: 'Posto bastante, mas sem retorno', emoji: '😤', weight: 2 }
            ]
        },
        {
            id: 'q3',
            text: 'Se tivesse um passo a passo pronto, quanto tempo você dedicaria para postar?',
            options: [
                { value: 'Menos de 10 minutos', emoji: '⚡', weight: 0 },
                { value: 'De 10 a 30 minutos', emoji: '⏱️', weight: 1 },
                { value: 'Mais de 30 minutos', emoji: '🕐', weight: 2 },
                { value: 'Só se for rápido e prático', emoji: '✅', weight: 0 }
            ]
        },
        {
            id: 'q4',
            text: 'O que você mais gostaria de conquistar com seus Stories?',
            options: [
                { value: 'Mais respostas e interação', emoji: '💬', weight: 1 },
                { value: 'Mais alcance e views', emoji: '👀', weight: 1 },
                { value: 'Autoridade no meu nicho', emoji: '👑', weight: 1 },
                { value: 'Vender de forma consistente', emoji: '💸', weight: 2 }
            ]
        },
        {
            id: 'q5',
            text: 'O que você já tentou para melhorar seus Stories?',
            options: [
                { value: 'Copiar ideias de outros perfis', emoji: '📋', weight: 2 },
                { value: 'Cursos longos que nunca terminei', emoji: '📚', weight: 2 },
                { value: 'Postar qualquer coisa para não sumir', emoji: '🤷‍♂️', weight: 3 },
                { value: 'Nunca tentei nada estruturado', emoji: '😅', weight: 3 }
            ]
        },
        {
            id: 'q6',
            text: 'Qual dessas opções melhor representa você?',
            options: [
                { value: 'Prestador de serviço (médico, dentista, designer, etc.)', emoji: '👨‍⚕️', weight: 1 },
                { value: 'Criador(a) de conteúdo ou expert', emoji: '🎨', weight: 1 },
                { value: 'Negócio local ou loja online', emoji: '🏪', weight: 1 },
                { value: 'Quero começar a aparecer agora', emoji: '🚀', weight: 2 }
            ]
        },
        {
            id: 'q7',
            text: 'Se tivesse um sistema que gerasse Stories prontos todos os dias, o que mudaria para você?',
            options: [
                { value: 'Postaria com muito mais consistência', emoji: '📅', weight: 1 },
                { value: 'Economizaria tempo e evitaria travar', emoji: '⏰', weight: 1 },
                { value: 'Teria mais interação', emoji: '💬', weight: 1 },
                { value: 'Venderia mais', emoji: '💰', weight: 2 }
            ]
        },
        {
            id: 'q8',
            text: 'Você gostaria de ter esse sistema ainda hoje?',
            options: [
                { value: 'Sim, quero começar já!', emoji: '🔥', weight: 0 },
                { value: 'Sim, mas tenho dúvidas', emoji: '🤔', weight: 1 },
                { value: 'Talvez, se for acessível', emoji: '💭', weight: 2 },
                { value: 'Não tenho interesse agora', emoji: '😐', weight: 3 }
            ]
        }
    ]

    // Tipos de diagnóstico
    diagnosisTypes = {
        'stuck_creator': {
            title: '😵‍💫 Bloqueio Criativo!',
            description: 'Você até tenta postar Stories, mas fica travado sem saber o que dizer ou como criar conteúdo que engaje.',
            emoji: '😵‍💫',
            color: 'orange'
        },
        'inconsistent_poster': {
            title: '📱 Inconsistência nos Posts!',
            description: 'Você posta de vez em quando, mas sem estratégia clara. Isso faz você perder alcance e autoridade no seu nicho.',
            emoji: '📱',
            color: 'amber'
        },
        'low_engagement': {
            title: '😔 Baixo Engajamento!',
            description: 'Você posta regularmente, mas as pessoas não interagem. Falta clareza na comunicação e estratégia persuasiva.',
            emoji: '😔',
            color: 'red'
        },
        'ready_to_grow': {
            title: '🚀 Pronto para Crescer!',
            description: 'Você já tem uma base, mas precisa de um sistema estruturado para destravar seu potencial e aumentar vendas.',
            emoji: '🚀',
            color: 'green'
        }
    }

    // Planos por perfil
    plans = {
        personal: {
            title: '📱 StoryFlow Básico',
            monthly: { 
                price: 37.00, 
                currency: 'BRL',
                buttonText: 'Quero destravar meus Stories agora - R$ 37',
                checkoutUrl: 'https://checkout.perfectpay.com.br/pay/PPU38CPOGC8?'
            },
            annual: { 
                price: 37.00, 
                currency: 'BRL', 
                discount: '0%',
                monthlyEquivalent: 37.00,
                buttonText: 'Quero destravar meus Stories agora - R$ 37',
                checkoutUrl: 'https://checkout.perfectpay.com.br/pay/PPU38CPON1T?'
            }
        },
        business: {
            title: '🚀 StoryFlow Completo',
            monthly: { 
                price: 37.00, 
                currency: 'BRL',
                buttonText: 'Quero destravar meus Stories agora - R$ 37',
                checkoutUrl: 'https://checkout.perfectpay.com.br/pay/PPU38CPOGC8?'
            },
            annual: { 
                price: 37.00, 
                currency: 'BRL', 
                discount: '0%',
                monthlyEquivalent: 37.00,
                buttonText: 'Quero destravar meus Stories agora - R$ 37',
                checkoutUrl: 'https://checkout.perfectpay.com.br/pay/PPU38CPON1T?'
            }
        }
    }

    // Inicializar tracking (desabilitado temporariamente)
    initializeTracking() {
        // trackEvent(this.sessionId, 'quiz_started')
    }

    // Obter pergunta atual
    getCurrentQuestion() {
        return this.questions[this.currentQuestion]
    }

    // Salvar resposta
    saveResponse(questionId, answer, weight) {
        this.responses[questionId] = { answer, weight }
        
        // Track resposta (desabilitado temporariamente)
        // trackEvent(this.sessionId, 'question_answered', {
        //     question: this.currentQuestion + 1,
        //     question_id: questionId,
        //     answer: answer,
        //     weight: weight
        // })
    }

    // Próxima pergunta
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++
            return true
        }
        return false
    }

    // Pergunta anterior
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--
            return true
        }
        return false
    }

    // Calcular diagnóstico
    calculateDiagnosis() {
        let totalScore = 0
        let creativeBlockScore = 0
        let consistencyScore = 0
        let engagementScore = 0

        // Calcular pontuações
        Object.values(this.responses).forEach(response => {
            totalScore += response.weight
        })

        // Pontuação específica por categoria
        if (this.responses.q1 && this.responses.q1.weight >= 3) creativeBlockScore += 3
        if (this.responses.q5 && this.responses.q5.weight >= 3) creativeBlockScore += 3

        if (this.responses.q2 && this.responses.q2.weight >= 2) consistencyScore += 3
        if (this.responses.q3 && this.responses.q3.weight >= 2) consistencyScore += 2

        if (this.responses.q1 && this.responses.q1.answer === 'Ninguém interage') engagementScore += 3
        if (this.responses.q2 && this.responses.q2.answer === 'Posto bastante, mas sem retorno') engagementScore += 3
        if (this.responses.q4 && this.responses.q4.answer === 'Vender de forma consistente') engagementScore += 2

        // Determinar tipo de diagnóstico
        let diagnosisType = 'ready_to_grow'

        if (creativeBlockScore >= 5 || (creativeBlockScore >= 3 && totalScore >= 12)) {
            diagnosisType = 'stuck_creator'
        } else if (consistencyScore >= 4 || (consistencyScore >= 3 && totalScore >= 10)) {
            diagnosisType = 'inconsistent_poster'
        } else if (engagementScore >= 5 || totalScore >= 15) {
            diagnosisType = 'low_engagement'
        }

        this.diagnosisResult = {
            type: diagnosisType,
            totalScore: totalScore,
            creativeBlockScore: creativeBlockScore,
            consistencyScore: consistencyScore,
            engagementScore: engagementScore,
            ...this.diagnosisTypes[diagnosisType]
        }

        // Salvar resultado no Supabase (desabilitado temporariamente)
        // this.saveToSupabase()

        return this.diagnosisResult
    }

    // Salvar dados no Supabase
    async saveToSupabase() {
        try {
            await saveQuizResponse(
                this.sessionId,
                this.responses,
                this.selectedProfile,
                this.diagnosisResult ? this.diagnosisResult.type : null
            )
        } catch (error) {
            console.error('Erro ao salvar no Supabase:', error)
        }
    }

    // Selecionar perfil
    selectProfile(profile) {
        this.selectedProfile = profile
        // trackEvent(this.sessionId, 'profile_selected', { profile })
        
        // Atualizar Supabase com o perfil selecionado (desabilitado temporariamente)
        // this.saveToSupabase()
    }

    // Obter planos para o perfil selecionado
    getPlansForProfile() {
        return this.plans[this.selectedProfile] || this.plans.personal
    }

    // Track conversão
    trackConversion(planType) {
        const plan = this.getPlansForProfile()[planType]
        trackEvent(this.sessionId, 'plan_clicked', {
            profile: this.selectedProfile,
            plan_type: planType,
            price: plan.price,
            checkout_url: plan.checkoutUrl
        })
        
        // Marcar como convertido
        markConversion(this.sessionId, `${this.selectedProfile}_${planType}`)
        
        trackEvent(this.sessionId, 'checkout_redirected', {
            plan: `${this.selectedProfile}_${planType}`,
            checkout_url: plan.checkoutUrl
        })
    }

    // Abrir WhatsApp
    openWhatsApp() {
        const message = `Olá! Acabei de fazer o quiz de Stories e gostaria de saber mais sobre o StoryFlow. Meu diagnóstico foi: ${this.diagnosisResult.title}`
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`
        
        trackEvent(this.sessionId, 'whatsapp_clicked', {
            diagnosis_type: this.diagnosisResult ? this.diagnosisResult.type : null,
            message: message
        })
        
        window.open(whatsappUrl, '_blank')
    }

    // Obter progresso
    getProgress() {
        return {
            current: this.currentQuestion + 1,
            total: this.totalQuestions,
            percentage: Math.round(((this.currentQuestion + 1) / this.totalQuestions) * 100)
        }
    }

    // Verificar se quiz está completo
    isComplete() {
        return Object.keys(this.responses).length === this.totalQuestions
    }

    // Reset quiz
    reset() {
        this.currentQuestion = 0
        this.responses = {}
        this.selectedProfile = null
        this.diagnosisResult = null
        this.sessionId = generateSessionId()
        localStorage.setItem('zapycash_session_id', this.sessionId)
        this.initializeTracking()
    }
}

// Instância global do quiz
let quizEngine = null