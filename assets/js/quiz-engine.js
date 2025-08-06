// Quiz Engine - Zapycash Financial Health Quiz
class QuizEngine {
    constructor() {
        this.currentQuestion = 0
        this.responses = {}
        this.sessionId = getSessionId()
        this.totalQuestions = 7
        this.selectedProfile = null
        this.diagnosisResult = null
        
        // Inicializar tracking
        this.initializeTracking()
    }

    // Perguntas do quiz
    questions = [
        {
            id: 'q1',
            text: 'Como você controla seus gastos hoje?',
            options: [
                { value: 'Não controlo', emoji: '😬', weight: 3 },
                { value: 'Anoto no caderno', emoji: '📝', weight: 1 },
                { value: 'Uso app ou planilha', emoji: '💻', weight: 0 }
            ]
        },
        {
            id: 'q2',
            text: 'Sua situação financeira hoje afeta o seu sono ou tranquilidade?',
            options: [
                { value: 'Sim, com certeza', emoji: '😰', weight: 3 },
                { value: 'Um pouco', emoji: '😓', weight: 1 },
                { value: 'Não', emoji: '🙂', weight: 0 }
            ]
        },
        {
            id: 'q3',
            text: 'Qual sua maior dificuldade com o dinheiro?',
            options: [
                { value: 'Não consigo guardar dinheiro', emoji: '💸', weight: 2 },
                { value: 'Pagar todas as contas', emoji: '📆', weight: 2 },
                { value: 'Vivo atrasando o cartão', emoji: '💳', weight: 2 },
                { value: 'Todas essas', emoji: '👉', weight: 3 }
            ]
        },
        {
            id: 'q4',
            text: 'Quando olha sua conta, o que você sente?',
            options: [
                { value: 'Raiva', emoji: '😡', weight: 2 },
                { value: 'Vergonha', emoji: '🙈', weight: 2 },
                { value: 'Frustração', emoji: '😩', weight: 2 },
                { value: 'Ansiedade', emoji: '😰', weight: 3 }
            ]
        },
        {
            id: 'q5',
            text: 'Já deixou de fazer algo importante por falta de dinheiro?',
            options: [
                { value: 'Sim, várias vezes', emoji: '😢', weight: 3 },
                { value: 'Algumas vezes', emoji: '😕', weight: 1 },
                { value: 'Nunca', emoji: '😊', weight: 0 }
            ]
        },
        {
            id: 'q6',
            text: 'Você tem alguma reserva?',
            options: [
                { value: 'Não', emoji: '😔', weight: 3 },
                { value: 'Muito pouca', emoji: '👉', weight: 2 },
                { value: 'Tenho, mas já estou usando', emoji: '😅', weight: 1 }
            ]
        },
        {
            id: 'q7',
            text: 'Quando o mês termina, como está seu saldo?',
            options: [
                { value: 'Sempre zerado', emoji: '🔴', weight: 3 },
                { value: 'Às vezes sobra', emoji: '🟠', weight: 1 },
                { value: 'Sobra dinheiro todo mês', emoji: '🟢', weight: 0 }
            ]
        }
    ]

    // Tipos de diagnóstico
    diagnosisTypes = {
        'anxious_spender': {
            title: '😰 Ansiedade Financeira!',
            description: 'Você sente muito stress com dinheiro e isso afeta seu bem-estar. É hora de tomar controle para ter mais tranquilidade.',
            emoji: '😰',
            color: 'red'
        },
        'disorganized': {
            title: '😵‍💫 Falta de Clareza!',
            description: 'Você até tenta se organizar, mas os pequenos gastos descontrolados no fim do mês acabam gerando frustração.',
            emoji: '😵‍💫',
            color: 'orange'
        },
        'struggling': {
            title: '😔 Dificuldades Constantes!',
            description: 'Você passa por apertos frequentes e já precisou deixar de fazer coisas importantes. Mas isso pode mudar!',
            emoji: '😔',
            color: 'amber'
        },
        'getting_started': {
            title: '🌱 Começando a Organizar!',
            description: 'Você já tem algum controle, mas pode melhorar muito com as ferramentas certas.',
            emoji: '🌱',
            color: 'green'
        }
    }

    // Planos por perfil
    plans = {
        personal: {
            title: '🧍 Plano Pessoal',
            monthly: { 
                price: 29.90, 
                currency: 'BRL',
                buttonText: 'Assinar Plano Pessoal Mensal - R$ 29,90',
                checkoutUrl: 'https://checkout.perfectpay.com.br/pay/PPU38CPOGC8?'
            },
            annual: { 
                price: 97.00, 
                currency: 'BRL', 
                discount: '72%',
                monthlyEquivalent: 8.08,
                buttonText: 'Assinar Plano Pessoal Anual - R$ 97,00',
                checkoutUrl: 'https://checkout.perfectpay.com.br/pay/PPU38CPON1T?'
            }
        },
        business: {
            title: '🧑‍💼 Plano Pessoal + Profissional',
            monthly: { 
                price: 37.90, 
                currency: 'BRL',
                buttonText: 'Assinar Plano Profissional Mensal - R$ 37,90',
                checkoutUrl: 'https://checkout.perfectpay.com.br/pay/PPU38CPOGC8?'
            },
            annual: { 
                price: 147.00, 
                currency: 'BRL', 
                discount: '73%',
                monthlyEquivalent: 12.25,
                buttonText: 'Assinar Plano Profissional Anual - R$ 147,00',
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
        let anxietyScore = 0
        let disorganizationScore = 0
        let financialStressScore = 0

        // Calcular pontuações
        Object.values(this.responses).forEach(response => {
            totalScore += response.weight
        })

        // Pontuação específica por categoria
        if (this.responses.q2 && this.responses.q2.weight >= 2) anxietyScore += 3
        if (this.responses.q4 && this.responses.q4.answer === 'Ansiedade') anxietyScore += 3

        if (this.responses.q3 && this.responses.q3.weight >= 3) disorganizationScore += 3
        if (this.responses.q1 && this.responses.q1.weight >= 2) disorganizationScore += 3

        if (this.responses.q5 && this.responses.q5.weight >= 2) financialStressScore += 3
        if (this.responses.q6 && this.responses.q6.weight >= 2) financialStressScore += 2
        if (this.responses.q7 && this.responses.q7.weight >= 2) financialStressScore += 2

        // Determinar tipo de diagnóstico
        let diagnosisType = 'getting_started'

        if (anxietyScore >= 6 || (anxietyScore >= 3 && totalScore >= 12)) {
            diagnosisType = 'anxious_spender'
        } else if (disorganizationScore >= 5 || (disorganizationScore >= 3 && totalScore >= 10)) {
            diagnosisType = 'disorganized'
        } else if (financialStressScore >= 6 || totalScore >= 15) {
            diagnosisType = 'struggling'
        }

        this.diagnosisResult = {
            type: diagnosisType,
            totalScore: totalScore,
            anxietyScore: anxietyScore,
            disorganizationScore: disorganizationScore,
            financialStressScore: financialStressScore,
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
        const message = `Olá! Acabei de fazer o quiz financeiro e gostaria de saber mais sobre o Zapycash. Meu diagnóstico foi: ${this.diagnosisResult.title}`
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