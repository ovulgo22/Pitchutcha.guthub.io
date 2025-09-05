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
/*
==================================================================================================
PROJETO: Pitchutcha - Uma Odisséia pela Computação
ARQUIVO: script.js (Parte 2 de várias)
DESCRIÇÃO: Adiciona funcionalidades avançadas como smooth scrolling, parallax, 
           troca de tema e um cursor customizado.
==================================================================================================

CREATIVE DEVELOPMENT & UX ENGINEERING:
- O script agora é mais modular, com funções de inicialização (`init`) para cada recurso.
  Isso melhora a organização e a manutenibilidade.
- Efeito Parallax: Um efeito de parallax sutil é adicionado sem bibliotecas pesadas, usando
  `requestAnimationFrame` para garantir uma animação suave e performática que não sobrecarrega
  o navegador.
- Persistência de Estado: A funcionalidade de troca de tema usa `localStorage` para lembrar
  a escolha do usuário entre as sessões, uma característica de UX fundamental.
- Microinterações: O cursor customizado que reage ao conteúdo da página (links, botões)
  é um exemplo de microinteração que eleva enormemente a percepção de qualidade do site.
==================================================================================================
*/

'use strict';

// A função `init` atua como o ponto de entrada principal para todos os nossos scripts.
function init() {
    // Funções da Parte 1 (agora encapsuladas)
    initPreloader();
    initScrollAnimations();
    initHeaderScroll();
    initFooterYear();

    // Novas Funções da Parte 2
    initSmoothScroll();
    initHeroParallax();
    initThemeToggle();
    initCustomCursor();
}

// -----------------------------------------------------------------------------------------------
// 1. FUNÇÕES DE INICIALIZAÇÃO E LÓGICA BASE
// -----------------------------------------------------------------------------------------------

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // O window.onload garante que TUDO foi carregado.
    window.onload = () => {
        preloader.classList.add('preloader--loaded');
        // Inicia a animação do Hero DEPOIS que o preloader sumiu
        setTimeout(initHeroAnimation, 500);
    };
}

function initHeroAnimation() {
    const heroTitleChars = document.querySelectorAll('.hero__title .char');
    const heroSubtitle = document.querySelector('.hero__subtitle');

    if (heroTitleChars.length > 0) {
        heroTitleChars.forEach((char, index) => {
            char.style.transition = `transform 0.8s var(--easing-cubic) ${index * 0.05}s`;
            char.style.transform = 'translateY(0)';
        });
    }

    if (heroSubtitle) {
        heroSubtitle.style.transition = 'opacity 1s var(--easing-cubic) 0.8s';
        heroSubtitle.style.opacity = 1;
    }
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .sub-section-title, .prose > *, .quote, figure, .interactive-list > li, .chapter-marker');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-inview');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }
}

function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 150) {
            header.classList.add('site-header--hidden');
        } else {
            header.classList.remove('site-header--hidden');
        }
        lastScrollY = window.scrollY;
    }, { passive: true }); // Otimização para performance de scroll
}

function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// -----------------------------------------------------------------------------------------------
// 2. SMOOTH SCROLLING (LOCOMOTIVE SCROLL)
// -----------------------------------------------------------------------------------------------

function initSmoothScroll() {
    /*
    NOTA DE IMPLEMENTAÇÃO: Para usar o Locomotive Scroll, você precisaria:
    1. Adicionar os arquivos CSS e JS da biblioteca no seu HTML.
       <head>: <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.css">
       <body> (final): <script src="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js"></script>

    2. Descomentar o código abaixo.
       O seletor '[data-scroll-container]' já está no seu index.html.
       Esta biblioteca irá automaticamente habilitar a rolagem suave e os efeitos de parallax
       baseados nos atributos `data-scroll` que adicionamos no HTML.
    */

    /*
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.08, // Controla a "suavidade". Valores menores = mais suave.
    });

    // É importante atualizar o IntersectionObserver quando o Locomotive Scroll está ativo.
    scroll.on('scroll', () => {
        // Lógica de atualização se necessário para outros plugins
    });
    */
   console.info("Locomotive Scroll não inicializado. Descomente o código em initSmoothScroll() para ativar.");
}

// -----------------------------------------------------------------------------------------------
// 3. EFEITO PARALLAX DO HERO (SEM BIBLIOTECA)
// -----------------------------------------------------------------------------------------------

function initHeroParallax() {
    const heroBackground = document.querySelector('.hero__background');
    if (!heroBackground) return;

    const onScroll = () => {
        const scrollY = window.scrollY;
        // O `0.3` controla a velocidade do parallax.
        // `translate3d` é mais performático que `translateY`.
        heroBackground.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
    };

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(onScroll);
    }, { passive: true });
}

// -----------------------------------------------------------------------------------------------
// 4. ALTERNADOR DE TEMA (LIGHT/DARK MODE)
// -----------------------------------------------------------------------------------------------
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const docElement = document.documentElement; // O elemento <html>

    if (!themeToggleButton) return;

    // Verifica a preferência salva ou a preferência do sistema
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    docElement.setAttribute('data-theme', currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let newTheme = docElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        docElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}


// -----------------------------------------------------------------------------------------------
// 5. CURSOR PERSONALIZADO
// -----------------------------------------------------------------------------------------------
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const interactiveElements = document.querySelectorAll('a, button');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const speed = 0.1; // Velocidade de "interpolação" do cursor

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Interpolação linear (lerp) para suavizar o movimento
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.transform = `translate3d(${cursorX - cursor.offsetWidth / 2}px, ${cursorY - cursor.offsetHeight / 2}px, 0)`;
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}


// -----------------------------------------------------------------------------------------------
// PONTO DE ENTRADA PRINCIPAL
// -----------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', init);
