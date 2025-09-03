// Configuração dos gráficos comparativos
function initializeCharts() {
    // Gráfico 1: Hoje (antes do StoryFlow)
    const ctxHoje = document.getElementById('chart-hoje');
    if (ctxHoje) {
        new Chart(ctxHoje, {
            type: 'bar',
            data: {
                labels: ['Consistência', 'Alcance', 'Engajamento', 'Autoridade', 'Vendas'],
                datasets: [{
                    label: 'Você',
                    data: [20, 15, 25, 10, 5],
                    backgroundColor: '#EF4444',
                    borderColor: '#DC2626',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }, {
                    label: 'Concorrente',
                    data: [80, 85, 75, 90, 95],
                    backgroundColor: '#6B7280',
                    borderColor: '#4B5563',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#10B981',
                        borderWidth: 2,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Gráfico 2: Futuro (com StoryFlow)
    const ctxFuturo = document.getElementById('chart-futuro');
    if (ctxFuturo) {
        new Chart(ctxFuturo, {
            type: 'bar',
            data: {
                labels: ['Consistência', 'Alcance', 'Engajamento', 'Autoridade', 'Vendas'],
                datasets: [{
                    label: 'Você',
                    data: [98, 95, 92, 96, 94],
                    backgroundColor: '#10B981',
                    borderColor: '#059669',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }, {
                    label: 'Concorrente',
                    data: [80, 85, 75, 90, 95],
                    backgroundColor: '#6B7280',
                    borderColor: '#4B5563',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#10B981',
                        borderWidth: 2,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart',
                    delay: function(context) {
                        return context.dataIndex * 200;
                    }
                }
            }
        });
    }
}

// Exportar para uso global
window.initializeCharts = initializeCharts;
