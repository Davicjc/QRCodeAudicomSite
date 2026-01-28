/* ========================================
   AUDICOM TELECOM - LINKTREE PAGE
   JavaScript Independente
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // FIBER CANVAS - MALHA DE REDE ANIMADA
    // Baseado no site principal
    // ========================================
    
    const canvas = document.getElementById('fiber-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;
    let lastTime = 0;
    
    // Cores da paleta
    const COLORS = {
        azulConexao: '#00249C',
        azulEstrutura: '#081535',
        cinzaOperacional: '#8F99A8',
        brancoTecnico: '#F4F6F9'
    };
    
    // Configurações
    const isMobile = window.innerWidth <= 768;
    const SETTINGS = {
        particleCount: isMobile ? 35 : 60,
        connectionDistance: isMobile ? 120 : 150,
        particleSpeed: 0.3,
        flowSpeed: 0.002,
        glowIntensity: 0.8
    };
    
    // Classe Partícula
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * SETTINGS.particleSpeed;
            this.speedY = (Math.random() - 0.5) * SETTINGS.particleSpeed;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
        }
        
        update(time) {
            // Movimento
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            
            // Pulsing opacity
            this.pulsePhase += this.pulseSpeed;
            this.currentOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.2;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 246, 249, ${this.currentOpacity})`;
            ctx.fill();
            
            // Glow effect for larger particles
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 36, 156, ${this.currentOpacity * 0.3})`;
                ctx.fill();
            }
        }
    }
    
    // Redimensionar Canvas
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }
    
    // Inicializar partículas
    function initParticles() {
        particles = [];
        for (let i = 0; i < SETTINGS.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Desenhar conexões entre partículas (malha de rede)
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < SETTINGS.connectionDistance) {
                    const opacity = (1 - distance / SETTINGS.connectionDistance) * 0.3;
                    
                    // Criar gradiente para efeito de fibra
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    
                    gradient.addColorStop(0, `rgba(0, 36, 156, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(143, 153, 168, ${opacity * 0.5})`);
                    gradient.addColorStop(1, `rgba(0, 36, 156, ${opacity})`);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Desenhar fluxo de dados nas conexões
    function drawDataFlow(time) {
        const flowProgress = (time * SETTINGS.flowSpeed) % 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < SETTINGS.connectionDistance * 0.7) {
                    // Calcular posição ao longo da linha
                    const progress = (flowProgress + (i + j) * 0.1) % 1;
                    const flowX = particles[i].x + (particles[j].x - particles[i].x) * progress;
                    const flowY = particles[i].y + (particles[j].y - particles[i].y) * progress;
                    
                    // Desenhar pacote de dados
                    const packetOpacity = (1 - distance / SETTINGS.connectionDistance) * 0.8;
                    const packetSize = 1.5;
                    
                    ctx.beginPath();
                    ctx.arc(flowX, flowY, packetSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 36, 156, ${packetOpacity})`;
                    ctx.fill();
                    
                    // Glow do pacote
                    ctx.beginPath();
                    ctx.arc(flowX, flowY, packetSize * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 36, 156, ${packetOpacity * 0.2})`;
                    ctx.fill();
                }
            }
        }
    }
    
    // Loop de animação principal
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Limpar canvas com efeito de fade
        ctx.fillStyle = 'rgba(8, 21, 53, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Atualizar partículas
        particles.forEach(particle => {
            particle.update(timestamp);
        });
        
        // Desenhar conexões (malha)
        drawConnections();
        
        // Desenhar fluxo de dados
        drawDataFlow(timestamp);
        
        // Desenhar partículas por cima
        particles.forEach(particle => {
            particle.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Event Listeners
    function setupEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 200);
        });
        
        // Pausar quando não visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                requestAnimationFrame(animate);
            }
        });
    }
    
    // ========================================
    // EFEITOS NOS CARDS (apenas touch-friendly)
    // ========================================
    
    function setupCardEffects() {
        // Nenhum efeito de mouse - otimizado para mobile
    }

    // ========================================
    // GOOGLE ANALYTICS - RASTREAMENTO DE EVENTOS
    // ========================================
    
    function setupAnalyticsTracking() {
        // Mapeamento de tipos de link para nomes amigáveis
        const linkTypeNames = {
            'site': 'Site Principal',
            'whatsapp': 'WhatsApp Vendas',
            'support': 'Suporte Técnico',
            'speed': 'Teste de Velocidade'
        };

        const socialNames = {
            'facebook': 'Facebook',
            'instagram': 'Instagram'
        };

        // Rastrear cliques nos link cards principais
        const linkCards = document.querySelectorAll('.link-card');
        linkCards.forEach(card => {
            card.addEventListener('click', function(e) {
                const linkType = this.getAttribute('data-type');
                const linkTitle = this.querySelector('.link-title')?.textContent || linkTypeNames[linkType] || linkType;
                const linkUrl = this.getAttribute('href');
                
                // Enviar evento para Google Analytics 4
                if (typeof gtag === 'function') {
                    gtag('event', 'link_click', {
                        'event_category': 'Linktree',
                        'event_label': linkTitle,
                        'link_type': linkType,
                        'link_url': linkUrl,
                        'link_text': linkTitle
                    });
                    
                    // Evento específico por tipo para melhor segmentação
                    gtag('event', 'click_' + linkType, {
                        'event_category': 'Botoes_Principais',
                        'event_label': linkTitle,
                        'value': 1
                    });
                }
                
                console.log('📊 Analytics: Clique em', linkTitle, '(' + linkType + ')');
            });
        });

        // Rastrear cliques nas redes sociais
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const socialType = this.getAttribute('data-social');
                const socialName = socialNames[socialType] || socialType;
                const socialUrl = this.getAttribute('href');
                
                // Enviar evento para Google Analytics 4
                if (typeof gtag === 'function') {
                    gtag('event', 'social_click', {
                        'event_category': 'Redes_Sociais',
                        'event_label': socialName,
                        'social_network': socialType,
                        'social_url': socialUrl
                    });
                    
                    // Evento específico por rede social
                    gtag('event', 'click_social_' + socialType, {
                        'event_category': 'Social',
                        'event_label': socialName,
                        'value': 1
                    });
                }
                
                console.log('📊 Analytics: Clique em', socialName);
            });
        });

        // Rastrear tempo de engajamento na página
        let engagementTime = 0;
        const engagementInterval = setInterval(() => {
            engagementTime += 10;
            
            // Enviar marco de engajamento a cada 30 segundos
            if (engagementTime % 30 === 0 && typeof gtag === 'function') {
                gtag('event', 'engagement_time', {
                    'event_category': 'Engajamento',
                    'event_label': engagementTime + ' segundos',
                    'value': engagementTime
                });
            }
        }, 10000); // A cada 10 segundos

        // Limpar intervalo quando sair da página
        window.addEventListener('beforeunload', () => {
            clearInterval(engagementInterval);
            
            // Enviar tempo total antes de sair
            if (typeof gtag === 'function' && engagementTime > 0) {
                gtag('event', 'session_end', {
                    'event_category': 'Engajamento',
                    'event_label': 'Tempo total na página',
                    'value': engagementTime
                });
            }
        });

        console.log('📊 Google Analytics - Rastreamento configurado');
    }
    
    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    function init() {
        // Verificar preferência de movimento reduzido
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion && canvas) {
            resizeCanvas();
            setupEventListeners();
            
            // Limpar canvas inicialmente
            ctx.fillStyle = COLORS.azulEstrutura;
            ctx.fillRect(0, 0, width, height);
            
            // Iniciar animação
            requestAnimationFrame(animate);
        }
        
        setupCardEffects();
        
        // Configurar rastreamento do Google Analytics
        setupAnalyticsTracking();
        
        // Log de inicialização
        console.log('🚀 Audicom Telecom Linktree - Inicializado');
    }
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
