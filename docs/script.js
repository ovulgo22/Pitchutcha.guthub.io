/*
==================================================================================================
PROJETO: Pitchutcha - Uma Odisséia pela Computação
ARQUIVO: script.js (Parte 1 de várias)
DESCRIÇÃO: Script principal para interatividade e animações. Esta parte lida com o preloader,
           animação de entrada da seção hero e a lógica de revelação de conteúdo na rolagem.
==================================================================================================

FRONT-END DEVELOPMENT & CREATIVE TECHNOLOGY:
- O código está encapsulado em um listener `DOMContentLoaded` para garantir que o DOM esteja 
  totalmente carregado antes de qualquer manipulação, prevenindo erros.
- A API `IntersectionObserver` é usada para as animações de rolagem. É a abordagem moderna e 
  performática, evitando o "jank" (travamentos) que pode ocorrer com event listeners de scroll.
- As animações são orquestradas via JavaScript (adicionando/removendo classes, definindo delays), 
  mas a animação em si é executada pelo CSS (via `transform` e `opacity`), que é mais performático 
  pois pode ser acelerado pela GPU.

UX ENGINEERING:
- A lógica do preloader espera o evento `window.onload`, que inclui imagens e outros recursos, 
  garantindo que o usuário veja a página completa e renderizada, sem "pulos" de layout.
- A animação do título em cascata (`stagger`) e o fade-in dos outros elementos do hero guiam
  o olhar do usuário e criam uma sensação de qualidade e refinamento desde o início.
==================================================================================================
*/

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------------------------
    // 1. LÓGICA DO PRELOADER
    // -------------------------------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const loaderBar = document.querySelector('.loader-bar');
    const preloaderStatus = document.getElementById('preloader-status');

    // Simula um progresso de carregamento para uma melhor UX
    if (loaderBar) {
        loaderBar.style.transform = 'scaleX(1)';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            preloaderStatus.textContent = `Descriptografando os arquivos... ${Math.floor(progress)}%`;
            if (progress === 100) clearInterval(interval);
        }, 100);
    }
    
    // Usa window.onload para garantir que TUDO (imagens, etc.) foi carregado.
    window.onload = () => {
        if (preloader) {
            // Garante que a barra de progresso chegue a 100%
            if (loaderBar) loaderBar.style.transform = 'scaleX(1)';
            if (preloaderStatus) preloaderStatus.textContent = `Realidade renderizada. Bem-vindo.`;

            // Adiciona a classe que dispara a animação de fade-out do CSS
            setTimeout(() => {
                preloader.classList.add('preloader--loaded');
            }, 500); // Um pequeno delay para o usuário ler a mensagem final
        }
        
        // Inicia a animação do Hero DEPOIS que o preloader sumiu
        setTimeout(initHeroAnimation, 800);
    };


    // -------------------------------------------------------------------------------------------
    // 2. ANIMAÇÃO DE ENTRADA DA SEÇÃO HERO
    // -------------------------------------------------------------------------------------------
    function initHeroAnimation() {
        const heroTitleChars = document.querySelectorAll('.hero__title .char');
        const heroSubtitle = document.querySelector('.hero__subtitle');
        const heroScrollDown = document.querySelector('.hero__scroll-down');

        if (heroTitleChars.length > 0) {
            heroTitleChars.forEach((char, index) => {
                // Adiciona a transição e um delay em cascata para cada letra
                char.style.transition = `transform 0.8s var(--easing-cubic) ${index * 0.05}s`;
                // Remove a transformação, fazendo a letra "subir" para a posição original
                char.style.transform = 'translateY(0)';
            });
        }

        if (heroSubtitle) {
            heroSubtitle.style.transition = 'opacity 1s var(--easing-cubic) 0.8s';
            heroSubtitle.style.opacity = 1;
        }

        // A animação do scroll-down é via keyframes no CSS, mas podemos controlar seu início se necessário.
    }


    // -------------------------------------------------------------------------------------------
    // 3. ANIMAÇÕES DE REVELAÇÃO NA ROLAGEM (INTERSECTION OBSERVER)
    // -------------------------------------------------------------------------------------------
    const animatedElements = document.querySelectorAll('.section-title, .sub-section-title, .prose > *, .quote, figure, .interactive-list > li, .chapter-marker');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null, // Observa em relação ao viewport
            rootMargin: '0px',
            threshold: 0.1 // Dispara quando 10% do elemento está visível
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona a classe que executa a animação no CSS
                    entry.target.classList.add('is-inview');
                    
                    // Otimização: para de observar o elemento depois que ele foi animado
                    observer.unobserve(entry.target);
                }
            });
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

        animatedElements.forEach(el => {
            scrollObserver.observe(el);
        });
    }

    // -------------------------------------------------------------------------------------------
    // 4. UTILITÁRIOS DE UX
    // -------------------------------------------------------------------------------------------
    
    // 4.1. Ocultar/Mostrar Header na Rolagem
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    if(header) {
        window.addEventListener('scroll', () => {
            if (lastScrollY < window.scrollY && window.scrollY > 150) {
                // Rolando para baixo
                header.classList.add('site-header--hidden');
            } else {
                // Rolando para cima
                header.classList.remove('site-header--hidden');
            }
            lastScrollY = window.scrollY;
        });
    }

    // 4.2. Atualizar Ano no Rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
