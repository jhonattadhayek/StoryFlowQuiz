// App.js - Zapycash Quiz Application
document.addEventListener('DOMContentLoaded', function() {
    // Testar conexão com Supabase (desabilitado temporariamente)
    // testSupabaseConnection()
    
    // Inicializar FAQ
    initializeFAQ()
})

// Controle de telas
function showScreen(screenId) {
    // Esconder todas as telas
    const screens = document.querySelectorAll('.screen')
    screens.forEach(screen => {
        screen.classList.add('hidden')
    })
    
    // Mostrar tela específica
    const targetScreen = document.getElementById(screenId)
    if (targetScreen) {
        targetScreen.classList.remove('hidden')
    }
    
    // Scroll para o topo
    window.scrollTo(0, 0)
    
    // Se for a tela de planos, inicializar funcionalidades específicas
    if (screenId === 'plans-screen' && typeof initializePlansScreen === 'function') {
        initializePlansScreen()
    }
}

// Iniciar quiz
function startQuiz() {
    quizEngine = new QuizEngine()
    showScreen('quiz-screen')
    displayCurrentQuestion()
}

// Exibir pergunta atual
function displayCurrentQuestion() {
    try {
        if (!quizEngine) {
            console.error('QuizEngine não está inicializado')
            return
        }
        
        const question = quizEngine.getCurrentQuestion()
        const progress = quizEngine.getProgress()
        
        if (!question) {
            console.error('Pergunta não encontrada')
            return
        }
        
        // Atualizar elementos da interface (verificar se existem)
        const currentQuestionEl = document.getElementById('current-question')
        if (currentQuestionEl) {
            currentQuestionEl.textContent = progress.current
        }
        
        const progressPercentEl = document.getElementById('progress-percent')
        if (progressPercentEl) {
            progressPercentEl.textContent = progress.percentage
        }
        
        const progressBarEl = document.getElementById('progress-bar')
        if (progressBarEl) {
            progressBarEl.style.width = progress.percentage + '%'
        }
        
        const questionTextEl = document.getElementById('question-text')
        if (questionTextEl) {
            questionTextEl.textContent = question.text
        }
        
        // Verificar se é a pergunta sobre o saldo (q7) para renderizar com gráfico
        if (question.id === 'q7') {
            displaySaldoQuestionWithChart(question)
        } else {
            displayRegularQuestion(question)
        }
        
        // Atualizar botões de navegação
        const prevBtn = document.getElementById('prev-btn')
        if (prevBtn) {
            prevBtn.disabled = quizEngine.currentQuestion === 0
        }
        
        // Verificar se já existe resposta para esta pergunta
        const existingResponse = quizEngine.responses[question.id]
        if (existingResponse) {
            setTimeout(() => {
                // Marcar opção já selecionada
                const buttons = document.querySelectorAll('.option-button')
                buttons.forEach(button => {
                    const buttonText = button.querySelector('span:last-child, .option-text')?.textContent
                    if (buttonText === existingResponse.answer) {
                        selectAnswerButton(button)
                    }
                })
            }, 100) // Pequeno delay para garantir que os elementos foram renderizados
        }
        
    } catch (error) {
        console.error('Erro em displayCurrentQuestion:', error)
    }
}

// Renderizar pergunta regular (sem gráfico)
function displayRegularQuestion(question) {
    const optionsContainer = document.getElementById('answer-options')
    optionsContainer.innerHTML = ''
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button')
        optionElement.className = 'w-full bg-white hover:bg-primary hover:text-white border-2 border-gray-200 hover:border-primary rounded-2xl p-6 text-left transition-all duration-200 option-button shadow-lg hover:shadow-xl'
        optionElement.innerHTML = `
            <div class="flex items-center space-x-4">
                <span class="text-3xl">${option.emoji}</span>
                <span class="font-medium text-lg option-text">${option.value}</span>
                <div class="flex-1 flex justify-end">
                    <span class="text-gray-400 text-2xl">→</span>
                </div>
            </div>
        `
        optionElement.onclick = () => selectAnswer(question.id, option.value, option.weight, optionElement)
        optionsContainer.appendChild(optionElement)
    })
}

// Renderizar pergunta do saldo com gráfico
function displaySaldoQuestionWithChart(question) {
    const optionsContainer = document.getElementById('answer-options')
    
    // Definir dados simulados para as barras (representando distribuição de respostas)
    const chartData = [
        { label: 'Baixo', percentage: 2, color: 'bg-red-500', option: question.options[0] },
        { label: 'Médio', percentage: 50, color: 'bg-orange-500', option: question.options[1] },
        { label: 'Alto', percentage: 96, color: 'bg-green-500', option: question.options[2] }
    ]
    
    // Calcular alturas proporcionais baseadas no valor máximo
    const maxPercentage = Math.max(...chartData.map(d => d.percentage))
    const maxHeightPx = 140 // altura máxima em pixels
    
    optionsContainer.innerHTML = `
        <div class="space-y-8">
            <!-- Gráfico de Barras -->
            <div class="chart-container bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div class="text-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">
                        Responda com <span class="text-primary font-bold">sinceridade!</span>
                    </h3>
                </div>
                
                <div class="flex justify-between items-end h-44 mb-6 px-2">
                    ${chartData.map((data, index) => {
                        // Calcular altura proporcional (mínimo 15px para visualização)
                        const proportionalHeight = Math.max((data.percentage / maxPercentage) * maxHeightPx, 15)
                        return `
                        <div class="flex-1 flex flex-col items-center mx-2">
                            <div class="text-lg font-bold text-gray-700 mb-3">${data.percentage}%</div>
                            <div class="w-full ${data.color} rounded-t-lg chart-bar shadow-md" 
                                 style="height: 8px;"
                                 data-percentage="${data.percentage}"
                                 data-target-height="${proportionalHeight}px">
                            </div>
                        </div>
                        `
                    }).join('')}
                </div>
                
                <div class="flex justify-between text-base text-gray-600 font-semibold px-2">
                    ${chartData.map(data => `
                        <div class="flex-1 text-center mx-2">${data.label}</div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Opções de Resposta -->
            <div class="space-y-3">
                ${question.options.map((option, index) => `
                    <button class="w-full bg-white hover:bg-primary hover:text-white border-2 border-gray-200 hover:border-primary rounded-xl p-5 text-left transition-all duration-200 option-button shadow-md hover:shadow-lg group"
                            onclick="selectAnswer('${question.id}', '${option.value}', ${option.weight}, this)">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 rounded-full ${chartData[index].color} flex items-center justify-center text-white text-lg font-bold group-hover:bg-white group-hover:text-gray-800">
                                ${option.emoji}
                            </div>
                            <span class="font-medium text-lg option-text">${option.value}</span>
                            <div class="flex-1 flex justify-end">
                                <span class="text-gray-400 text-xl group-hover:text-white">→</span>
                            </div>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `
    
    // Animar as barras após renderizar com delay escalonado
    setTimeout(() => {
        const bars = optionsContainer.querySelectorAll('.chart-bar')
        bars.forEach((bar, index) => {
            setTimeout(() => {
                const targetHeight = bar.getAttribute('data-target-height')
                bar.style.height = targetHeight
            }, index * 200) // 200ms de delay entre cada barra
        })
    }, 300)
}

// Selecionar resposta
function selectAnswer(questionId, answer, weight, buttonElement) {
    try {
        // Desmarcar todas as opções
        const buttons = document.querySelectorAll('.option-button')
        buttons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white', 'border-primary')
            btn.classList.add('bg-white', 'border-gray-200')
            // Resetar cor da seta
            const arrow = btn.querySelector('span:last-child')
            if (arrow && arrow.textContent === '→') {
                arrow.classList.remove('text-white')
                arrow.classList.add('text-gray-400')
            }
        })
        
        // Marcar opção selecionada
        selectAnswerButton(buttonElement)
        
        // Salvar resposta
        if (quizEngine && typeof quizEngine.saveResponse === 'function') {
            quizEngine.saveResponse(questionId, answer, weight)
        }
        
        // Auto-avançar para próxima pergunta após um pequeno delay
        setTimeout(() => {
            console.log('Auto-avançando para próxima pergunta...')
            
            try {
                // Verificar se ainda estamos na mesma pergunta antes de avançar
                if (quizEngine && quizEngine.getCurrentQuestion() && quizEngine.getCurrentQuestion().id === questionId) {
                    if (quizEngine.nextQuestion()) {
                        displayCurrentQuestion()
                    } else {
                        // Quiz completado - mostrar análise
                        showAnalysis()
                    }
                }
            } catch (error) {
                console.error('Erro ao avançar pergunta:', error)
            }
        }, 600) // Reduzindo para 600ms para ser mais responsivo
        
    } catch (error) {
        console.error('Erro em selectAnswer:', error)
    }
}

// Marcar botão como selecionado
function selectAnswerButton(buttonElement) {
    buttonElement.classList.remove('bg-white', 'border-gray-200')
    buttonElement.classList.add('bg-primary', 'text-white', 'border-primary')
    
    // Mudar cor da seta para branco quando selecionado
    const arrow = buttonElement.querySelector('span:last-child')
    if (arrow && arrow.textContent === '→') {
        arrow.classList.remove('text-gray-400')
        arrow.classList.add('text-white')
    }
}

// Próxima pergunta
function nextQuestion() {
    if (quizEngine.nextQuestion()) {
        displayCurrentQuestion()
    } else {
        // Quiz completado - mostrar análise
        showAnalysis()
    }
}

// Pergunta anterior
function previousQuestion() {
    if (quizEngine.previousQuestion()) {
        displayCurrentQuestion()
    }
}

// Mostrar tela de análise
function showAnalysis() {
    showScreen('analysis-screen')
    
    // Animar progresso
    animateProgress('analysis-progress', 'analysis-percent', 3000, () => {
        // Calcular diagnóstico
        const diagnosis = quizEngine.calculateDiagnosis()
        setTimeout(() => showDiagnosis(diagnosis), 500)
    })
}

// Animar barra de progresso
function animateProgress(progressBarId, percentId, duration, callback) {
    const progressBar = document.getElementById(progressBarId)
    const percentElement = document.getElementById(percentId)
    const startTime = Date.now()
    
    function updateProgress() {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / duration) * 100, 100)
        
        progressBar.style.width = progress + '%'
        percentElement.textContent = Math.round(progress)
        
        if (progress < 100) {
            requestAnimationFrame(updateProgress)
        } else if (callback) {
            callback()
        }
    }
    
    requestAnimationFrame(updateProgress)
}

// Mostrar diagnóstico
function showDiagnosis(diagnosis) {
    showScreen('diagnosis-screen')
    
    // Atualizar elementos do diagnóstico
    document.getElementById('diagnosis-emoji').textContent = diagnosis.emoji
    document.getElementById('diagnosis-title').textContent = diagnosis.title
    document.getElementById('diagnosis-description').textContent = diagnosis.description
    
    // Track evento
    trackEvent(quizEngine.sessionId, 'diagnosis_shown', {
        diagnosis_type: diagnosis.type,
        total_score: diagnosis.totalScore
    })
}

// Mostrar vídeos
function showVideos() {
    showScreen('videos-screen')
    trackEvent(quizEngine.sessionId, 'videos_shown')
}

// Simular visualização de vídeo
function watchVideo(videoType) {
    trackEvent(quizEngine.sessionId, 'video_watched', { video: videoType })
    
    // Aqui você pode adicionar lógica para reproduzir vídeos reais
    alert(`Reproduzindo vídeo: ${videoType}`)
}

// Mostrar seleção de perfil
function showProfileSelection() {
    showScreen('profile-screen')
    trackEvent(quizEngine.sessionId, 'profile_selection_shown')
}

// Selecionar perfil
function selectProfile(profile) {
    quizEngine.selectProfile(profile)
    showLoading()
}

// Mostrar loading
function showLoading() {
    showScreen('loading-screen')
    
    // Animar progresso
    animateProgress('loading-progress', 'loading-percent', 2500, () => {
        setTimeout(() => showPlans(), 500)
    })
}

// Mostrar planos
function showPlans() {
    showScreen('plans-screen')
    renderPlans()
    trackEvent(quizEngine.sessionId, 'plans_shown', { profile: quizEngine.selectedProfile })
}

// Renderizar planos
function renderPlans() {
    const plansContainer = document.getElementById('plans-container')
    const plans = quizEngine.getPlansForProfile()
    
    plansContainer.innerHTML = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${plans.title}</h2>
        </div>
        
        <!-- Planos -->
        <div class="grid gap-6">
            <!-- Plano Anual (Destaque) -->
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white relative">
                <div class="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                    Mais Popular
                </div>
                
                <div class="mb-4">
                    <div class="text-sm opacity-90">Plano Anual</div>
                    <div class="text-3xl font-bold">R$ ${plans.annual.price.toFixed(2)}</div>
                    <div class="text-sm opacity-90">apenas R$ ${plans.annual.monthlyEquivalent.toFixed(2)}/mês</div>
                </div>
                
                <div class="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                    <div class="text-center">
                        <div class="text-sm opacity-90">Você economiza</div>
                        <div class="text-xl font-bold">${plans.annual.discount} OFF</div>
                    </div>
                </div>
                
                <button 
                    onclick="handlePlanSelection('annual')"
                    class="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 mb-4"
                >
                    Quero economizar ${plans.annual.discount}! 🎉
                </button>
                
                <div class="text-center">
                    <div class="text-sm opacity-90">✅ 1 ano de acesso completo</div>
                    <div class="text-sm opacity-90">✅ Gerente de contas incluso</div>
                    <div class="text-sm opacity-90">✅ Suporte prioritário</div>
                </div>
            </div>
            
            <!-- Plano Mensal -->
            <div class="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <div class="mb-4">
                    <div class="text-sm text-gray-600">Plano Mensal</div>
                    <div class="text-3xl font-bold text-gray-800">R$ ${plans.monthly.price.toFixed(2)}</div>
                    <div class="text-sm text-gray-600">por mês</div>
                </div>
                
                <button 
                    onclick="handlePlanSelection('monthly')"
                    class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 mb-4"
                >
                    Começar agora
                </button>
                
                <div class="text-center text-sm text-gray-600">
                    <div>✅ Acesso completo</div>
                    <div>✅ Suporte padrão</div>
                    <div>✅ Cancele quando quiser</div>
                </div>
            </div>
        </div>
        
        <!-- Features Inclusos -->
        <div class="bg-gray-50 rounded-2xl p-6 mt-6">
            <h3 class="text-xl font-bold text-center mb-4">🎁 Todos os planos incluem:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-center space-x-2">
                    <span class="text-green-500">✅</span>
                    <span>Assistente no WhatsApp</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-green-500">✅</span>
                    <span>Controle de entradas e saídas</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-green-500">✅</span>
                    <span>Relatórios mensais</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-green-500">✅</span>
                    <span>Suporte humanizado</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-green-500">✅</span>
                    <span>Painel com gráficos e metas</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-green-500">✅</span>
                    <span>Acesso prático e seguro</span>
                </div>
            </div>
        </div>
    `
}

// Lidar com seleção de plano
function handlePlanSelection(planType) {
    const plans = quizEngine.getPlansForProfile()
    const selectedPlan = plans[planType]
    
    // Track conversão
    quizEngine.trackConversion(planType)
    
    // Redirecionar para checkout
    if (selectedPlan.checkoutUrl) {
        window.open(selectedPlan.checkoutUrl, '_blank')
    } else {
        // Fallback para WhatsApp se não houver checkout configurado
        openWhatsApp()
    }
}

// Abrir WhatsApp
function openWhatsApp() {
    if (quizEngine) {
        quizEngine.openWhatsApp()
    } else {
        // Fallback se não houver quiz engine
        const message = 'Olá! Vim através do quiz financeiro e gostaria de saber mais sobre o Zapycash!'
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/5511999999999?text=${encodedMessage}`, '_blank')
    }
}

// Inicializar FAQ
function initializeFAQ() {
    // A função toggleFAQ já está definida no HTML
}

// Toggle FAQ
function toggleFAQ(questionElement) {
    const faqItem = questionElement.parentElement
    const answer = faqItem.querySelector('.faq-answer')
    const icon = questionElement.querySelector('span')
    
    // Toggle resposta
    answer.classList.toggle('hidden')
    
    // Toggle ícone
    icon.textContent = answer.classList.contains('hidden') ? '+' : '−'
    
    // Track evento
    if (quizEngine) {
        trackEvent(quizEngine.sessionId, 'faq_toggled', {
            question: questionElement.textContent.replace(icon.textContent, '').trim(),
            action: answer.classList.contains('hidden') ? 'closed' : 'opened'
        })
    }
}

// Funções de utilidade
function formatCurrency(value, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
    }).format(value)
}

// Função para scroll suave
function smoothScrollTo(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    })
}

// Detectar saída da página (para analytics)
window.addEventListener('beforeunload', function() {
    if (quizEngine) {
        trackEvent(quizEngine.sessionId, 'page_exit', {
            current_screen: getCurrentScreen(),
            completed: quizEngine.isComplete()
        })
    }
})

// Obter tela atual
function getCurrentScreen() {
    const screens = document.querySelectorAll('.screen')
    for (let screen of screens) {
        if (!screen.classList.contains('hidden')) {
            return screen.id
        }
    }
    return 'unknown'
}

// Error handling global
window.addEventListener('error', function(e) {
    console.error('Erro na aplicação:', e.error)
    if (quizEngine) {
        trackEvent(quizEngine.sessionId, 'error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
        })
    }
})

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Descomentado quando houver service worker
        // navigator.serviceWorker.register('/sw.js')
    })
}

// ================================
// CHECKOUT PAGE FUNCTIONALITIES
// ================================

// Depoimentos para o carrossel
const testimonials = [
    {
        name: "Luana Menezes",
        icon: "👩‍💻",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Essa ferramenta mudou a minha vida! Obrigado por existirem. 💚",
        color: "bg-green-200"
    },
    {
        name: "Mário Gois",
        icon: "🎬",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Sou videomaker e organizei a minha empresa e a minha vida pessoal com o Zapycash. Nunca mais quero saber de planilhas no Excel. Muito top e muito intuitivo.",
        color: "bg-blue-200"
    },
    {
        name: "Ana Carolina",
        icon: "👩‍⚕️",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Como médica, minha agenda é corrida e não tinha tempo pra planilhas. Com o Zapycash consigo controlar tudo pelo WhatsApp em segundos. Revolucionário!",
        color: "bg-purple-200"
    },
    {
        name: "Rafael Santos",
        icon: "👨‍💼",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Empresário há 10 anos e nunca vi algo tão prático. Separei as contas pessoais das empresariais e finalmente tenho controle real dos gastos. Recomendo!",
        color: "bg-orange-200"
    },
    {
        name: "Mariana Costa",
        icon: "👩‍🎓",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Estudante universitária vivendo com pouco dinheiro. O Zapycash me ajudou a economizar R$300 no primeiro mês! Agora consigo guardar dinheiro todo mês.",
        color: "bg-pink-200"
    },
    {
        name: "Carlos Eduardo",
        icon: "👨‍🔧",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Mecânico autônomo, sempre tive dificuldade com controle financeiro. Agora registro toda entrada e saída na hora. Meu negócio cresceu 40% em 6 meses!",
        color: "bg-yellow-200"
    },
    {
        name: "Júlia Fernandes",
        icon: "👩‍🍳",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Dona de casa e empreendedora. Vendo doces caseiros e sempre misturava as contas. Com o Zapycash separei tudo e descobri que estava lucrando muito mais!",
        color: "bg-red-200"
    },
    {
        name: "Pedro Almeida",
        icon: "👨‍💻",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        text: "Desenvolvedor freelancer, trabalho para vários clientes. O controle separado por projeto me deu uma visão clara de quais trabalhos são mais rentáveis.",
        color: "bg-indigo-200"
    }
]

// Estado do carrossel
let currentTestimonialIndex = 0
let testimonialInterval = null

// Inicializar carrossel quando a tela de planos for mostrada
function initializeTestimonialsCarousel() {
    const carousel = document.getElementById('testimonials-carousel')
    const dots = document.getElementById('testimonial-dots')
    
    if (!carousel || !dots) {
        console.log('Elementos do carrossel não encontrados no DOM')
        return
    }

    // Criar HTML dos depoimentos
    carousel.innerHTML = testimonials.map((testimonial, index) => `
        <div class="w-full flex-shrink-0 px-4">
            <div class="bg-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto">
                <div class="flex flex-col md:flex-row items-center gap-4">
                    <div class="w-16 h-16 ${testimonial.color} rounded-full flex items-center justify-center">
                        <span class="text-2xl">${testimonial.icon}</span>
                    </div>
                    <div class="text-center md:text-left flex-1">
                        <div class="text-yellow-500 text-xl mb-2">${testimonial.rating}</div>
                        <p class="text-gray-700 italic mb-2">"${testimonial.text}"</p>
                        <div class="font-semibold text-gray-800">— ${testimonial.name}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('')

    // Criar dots de navegação
    dots.innerHTML = testimonials.map((_, index) => `
        <button 
            onclick="goToTestimonial(${index})"
            class="w-3 h-3 rounded-full transition-colors duration-200 ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}"
            data-dot="${index}"
        ></button>
    `).join('')

    // Iniciar rotação automática
    startTestimonialAutoplay()
}

// Navegação do carrossel
function nextTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length
    updateCarouselPosition()
    resetAutoplay()
}

function previousTestimonial() {
    currentTestimonialIndex = currentTestimonialIndex === 0 ? testimonials.length - 1 : currentTestimonialIndex - 1
    updateCarouselPosition()
    resetAutoplay()
}

function goToTestimonial(index) {
    currentTestimonialIndex = index
    updateCarouselPosition()
    resetAutoplay()
}

// Atualizar posição do carrossel
function updateCarouselPosition() {
    const carousel = document.getElementById('testimonials-carousel')
    const dots = document.querySelectorAll('[data-dot]')
    
    if (carousel) {
        carousel.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`
    }

    // Atualizar dots
    dots.forEach((dot, index) => {
        if (index === currentTestimonialIndex) {
            dot.classList.remove('bg-gray-300')
            dot.classList.add('bg-green-500')
        } else {
            dot.classList.remove('bg-green-500')
            dot.classList.add('bg-gray-300')
        }
    })
}

// Autoplay do carrossel
function startTestimonialAutoplay() {
    testimonialInterval = setInterval(nextTestimonial, 5000) // Muda a cada 5 segundos
}

function resetAutoplay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval)
        startTestimonialAutoplay()
    }
}

// Timer de urgência
let countdownInterval = null

function startCountdownTimer() {
    const timerElement = document.getElementById('countdown-timer')
    if (!timerElement) {
        console.log('Elemento do timer não encontrado no DOM')
        return
    }

    // Começar em 9:46 (em segundos)
    let totalSeconds = (9 * 60) + 46

    function updateTimer() {
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        timerElement.textContent = formattedTime

        // Mudar cor quando restam menos de 2 minutos
        if (totalSeconds <= 120) {
            timerElement.classList.add('text-red-300')
            timerElement.parentElement.classList.add('animate-pulse')
        }

        totalSeconds--

        // Quando chegar a zero, reiniciar em 9:46
        if (totalSeconds < 0) {
            totalSeconds = (9 * 60) + 46
            timerElement.classList.remove('text-red-300')
            timerElement.parentElement.classList.remove('animate-pulse')
        }
    }

    // Iniciar timer
    updateTimer()
    countdownInterval = setInterval(updateTimer, 1000)
}

// Funções de assinatura dos planos
function subscribePlan(planType, billingType) {
    // Dados dos planos
    const plans = {
        personal: {
            monthly: { price: 'R$29,90', link: 'https://checkout.perfectpay.com.br/pay/PPU38CPOGC8?' },
            yearly: { price: 'R$97,00', link: 'https://checkout.perfectpay.com.br/pay/PPU38CPON1T?' }
        },
        business: {
            monthly: { price: 'R$37,90', link: 'https://checkout.perfectpay.com.br/pay/PPU38CPOGC8?' },
            yearly: { price: 'R$147,00', link: 'https://checkout.perfectpay.com.br/pay/PPU38CPON1T?' }
        }
    }

    const selectedPlan = plans[planType][billingType]
    
    if (selectedPlan) {
        // Salvar evento de conversão
        if (typeof trackEvent === 'function' && quizEngine) {
            trackEvent(quizEngine.sessionId, 'plan_subscription_click', {
                plan_type: planType,
                billing_type: billingType,
                price: selectedPlan.price
            })
        }

        // Redirecionar para WhatsApp
        window.open(selectedPlan.link, '_blank')
    }
}

// Funcionalidades específicas para a tela de planos
function initializePlansScreen() {
    // Limpar timers anteriores se existirem
    if (testimonialInterval) {
        clearInterval(testimonialInterval)
        testimonialInterval = null
    }
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
    
    // Delay para garantir que o DOM foi renderizado
    setTimeout(() => {
        try {
            initializeTestimonialsCarousel()
            startCountdownTimer()
        } catch (error) {
            console.error('Erro ao inicializar funcionalidades da tela de planos:', error)
        }
    }, 200) // Aumentei o delay para 200ms para garantir que tudo seja renderizado
}

// Limpar timers quando sair da página
window.addEventListener('beforeunload', () => {
    if (testimonialInterval) clearInterval(testimonialInterval)
    if (countdownInterval) clearInterval(countdownInterval)
})