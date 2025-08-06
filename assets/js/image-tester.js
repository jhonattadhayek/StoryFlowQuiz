// Image Tester - Para teste rápido com URLs temporárias
// Execute no console do navegador para testar imagens antes do download

function testImagesWithTempUrls() {
    console.log('🎨 Testando imagens com URLs temporárias...')
    
    // URLs temporárias para teste (APENAS PARA TESTE!)
    const tempImages = {
        financialAdvisor: 'https://cdn.iconscout.com/3d/premium/thumb/businessman-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--business-man-person-people-pack-illustrations-4089757.png',
        success: 'https://cdn.iconscout.com/3d/premium/thumb/businessman-success-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--business-man-celebration-winner-pack-illustrations-4426983.png'
    }
    
    // Aplicar imagem na tela inicial
    const heroImage = document.querySelector('img[alt="Consultor Financeiro Zapycash"]')
    if (heroImage) {
        heroImage.src = tempImages.financialAdvisor
        heroImage.style.display = 'block'
        console.log('✅ Imagem da tela inicial aplicada')
    }
    
    // Aplicar imagem na tela de conversão  
    const successImage = document.querySelector('img[alt="Personagem de Sucesso Financeiro"]')
    if (successImage) {
        successImage.src = tempImages.success
        successImage.style.display = 'block'
        console.log('✅ Imagem da tela de conversão aplicada')
    }
    
    console.log('🎉 Teste concluído! Navegue pelo quiz para ver as imagens.')
    console.log('⚠️ Lembre-se: Para produção, baixe e hospede as imagens localmente!')
}

function resetImages() {
    console.log('🔄 Removendo imagens temporárias...')
    
    // Resetar para os caminhos locais
    const heroImage = document.querySelector('img[alt="Consultor Financeiro Zapycash"]')
    if (heroImage) {
        heroImage.src = 'assets/images/img-boneca01.png'
    }
    
    const successImage = document.querySelector('img[alt="Personagem de Sucesso Financeiro"]')
    if (successImage) {
        successImage.src = 'assets/images/img-boneca02.png'
    }
    
    console.log('✅ Imagens resetadas para caminhos locais')
}

// Testar automaticamente se as imagens locais existem
function checkLocalImages() {
    console.log('🔍 Verificando imagens locais...')
    
    const images = [
        'assets/images/img-boneca01.png',
        'assets/images/img-boneca02.png'
    ]
    
    images.forEach(async (imagePath) => {
        try {
            const response = await fetch(imagePath)
            if (response.ok) {
                console.log(`✅ ${imagePath} - Encontrada`)
            } else {
                console.log(`❌ ${imagePath} - Não encontrada (${response.status})`)
            }
        } catch (error) {
            console.log(`❌ ${imagePath} - Erro ao verificar`)
        }
    })
}

// Executar verificação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para o DOM carregar completamente
    setTimeout(checkLocalImages, 1000)
})

// Instruções de uso
console.log(`
🎨 IMAGE TESTER - Zapycash Quiz

Para testar com imagens temporárias:
> testImagesWithTempUrls()

Para resetar para imagens locais:
> resetImages()

Para verificar se imagens locais existem:
> checkLocalImages()

⚠️ IMPORTANTE: URLs temporárias são apenas para teste!
Para produção, baixe as imagens conforme /assets/images/README.md
`)

// Exportar funções para uso global
window.testImagesWithTempUrls = testImagesWithTempUrls
window.resetImages = resetImages  
window.checkLocalImages = checkLocalImages