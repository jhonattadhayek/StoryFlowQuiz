// Configurações centralizadas do projeto
const CONFIG = {
    // Configurações do Supabase
    supabase: {
        url: 'https://tyoyliefcbxaqskvlcud.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3lsaWVmY2J4YXFza3ZsY3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODA0MDEsImV4cCI6MjA3MDA1NjQwMX0.aZWvrbKrqHa36ucl0jxYGgaAO4KwnK4Oj5cOMBYSypI'
    },

    // Configurações do WhatsApp
    whatsapp: {
        number: '5511999999999', // ALTERAR para o número real
        defaultMessage: 'Olá! Vim através do quiz financeiro e gostaria de saber mais sobre o Zapycash!'
    },

    // URLs de Checkout (CONFIGURAR com URLs reais)
    checkout: {
        personal: {
            monthly: 'https://checkout.zapycash.com/personal-monthly',
            annual: 'https://checkout.zapycash.com/personal-annual'
        },
        business: {
            monthly: 'https://checkout.zapycash.com/business-monthly', 
            annual: 'https://checkout.zapycash.com/business-annual'
        }
    },

    // Configurações de Analytics
    analytics: {
        enabled: true,
        debug: false // Definir como false em produção
    },

    // Configurações de UI
    ui: {
        animationDuration: 300,
        progressAnimationDuration: 2500,
        loadingDuration: 3000
    },

    // Textos personalizáveis
    texts: {
        brandName: 'Zapycash',
        supportEmail: 'suporte@zapycash.com',
        landingHeadline: 'Descubra por que seu dinheiro nunca sobra no fim do mês!',
        landingSubheadline: 'Responda 7 perguntas rápidas e receba um plano simples para economizar + de R$400 em 30 dias — direto no seu WhatsApp.'
    },

    // Configurações dos planos
    pricing: {
        currency: 'BRL',
        personal: {
            monthly: 19.90,
            annual: 67.00,
            annualDiscount: '72%'
        },
        business: {
            monthly: 29.90,
            annual: 97.00,
            annualDiscount: '73%'
        }
    }
}

// Tornar CONFIG disponível globalmente
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG
}

// Para Node.js (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG
}