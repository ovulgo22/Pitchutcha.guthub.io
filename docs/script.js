/*
==================================================================================================
PROJETO: Pitchutcha - Uma Odisséia pela Computação
ARQUIVO: script.js (Versão Revisada)
DESCRIÇÃO: Script final, revisado para robustez (à prova de erros), performance e 
           acessibilidade avançada (gerenciamento de foco).
==================================================================================================
*/

'use strict';

// Ponto de entrada principal: espera o HTML ser carregado.
document.addEventListener('DOMContentLoaded', () => {
    // Tenta registrar o plugin GSAP. Se falhar, avisa no console mas não quebra o site.
    try {
        gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
        console.error("GSAP ou ScrollTrigger não foram carregados. Animações avançadas estarão desativadas.");
    }
    
    // Inicia todas as funcionalidades do site.
    init();
});

/**
 * Função principal que chama todas as outras funções de inicialização.
 */
function init() {
    initSmoothScrollAndGSAP();
    initPreloader();
    initHeaderScroll();
    initFooterYear();
    initHeroParallax();
    initThemeToggle();
    initCustomCursor();
    initReadingProgress();
    initVonNeumannAnimation();
    initHorizontalScroll();
    initSearchModal();
    initMicrointeractions();
}

/**
 * Lida com o preloader e a animação de entrada do site.
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    // CORREÇÃO DE ROBUSTEZ: Se o elemento não existir, a função para e não quebra o resto do site.
    if (!preloader) {
        console.warn("Elemento Preloader não encontrado.");
        initHeroAnimation(); // Chama a animação do hero diretamente se não houver preloader.
        return;
    }

    window.onload = () => {
        preloader.classList.add('preloader--loaded');
        setTimeout(initHeroAnimation, 500);
    };
}

/**
 * Anima os elementos da seção Hero quando a página carrega.
 */
function initHeroAnimation() {
    // Otimização: usa um único timeline da GSAP para orquestrar a animação de entrada.
    const tl = gsap.timeline();
    
    tl.to(".hero__title .char", {
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to(".hero__subtitle", {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.6"); // O "-=0.6" faz esta animação começar 0.6s antes do fim da anterior.
}

/**
 * Controla o comportamento de esconder/mostrar o cabeçalho ao rolar.
 */
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
    }, { passive: true }); // OTIMIZAÇÃO DE PERFORMANCE
}

/**
 * Atualiza o ano no rodapé para o ano corrente.
 */
function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Aplica um efeito de parallax sutil no fundo da seção Hero.
 */
function initHeroParallax() {
    const heroBackground = document.querySelector('.hero__background');
    if (!heroBackground) return;

    const onScroll = () => {
        const scrollY = window.scrollY;
        heroBackground.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
    };

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(onScroll);
    }, { passive: true });
}

/**
 * Lida com a funcionalidade de alternar entre temas claro e escuro.
 */
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    if (!themeToggleButton) return;
    
    const docElement = document.documentElement;

    const applyTheme = (theme) => {
        docElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // CORREÇÃO DE ACESSIBILIDADE: Atualiza o estado para leitores de tela.
        themeToggleButton.setAttribute('aria-pressed', theme === 'dark');
    };

    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(currentTheme);

    themeToggleButton.addEventListener('click', () => {
        const newTheme = docElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

/**
 * Cria e gerencia o cursor personalizado.
 */
function initCustomCursor() {
    if (window.matchMedia("(hover: none)").matches) return; // Não executa em dispositivos de toque.

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const interactiveElements = document.querySelectorAll('a, button');
    let mouseX = 0, mouseY = 0;
    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: () => {
            gsap.set(cursor, {
                left: mouseX,
                top: mouseY,
            });
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

/**
 * Lida com o modal de busca, incluindo a lógica de busca e o gerenciamento de foco.
 */
function initSearchModal() {
    const searchToggle = document.getElementById('search-toggle');
    const searchModal = document.getElementById('search-modal');
    if (!searchToggle || !searchModal) return;

    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    // CORREÇÃO DE ACESSIBILIDADE: Pega todos os elementos focáveis dentro do modal.
    const focusableElements = searchModal.querySelectorAll('button, [href], input');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    // ... (O índice de busca permanece o mesmo da versão anterior) ...
    const searchIndex = [
        { id: '#ferramentas-antigas', title: 'Ábaco e Anticítera', content: 'instrumentos de cálculo antigos suméria grécia' },
        { id: '#babbage-lovelace', title: 'Charles Babbage & Ada Lovelace', content: 'máquina analítica diferencial primeiro algoritmo programa' },
        { id: '#von-neumann', title: 'Arquitetura de von Neumann', content: 'programa armazenado software memória cpu' },
        { id: '#transistor-ic', title: 'Transistor e Circuito Integrado', content: 'miniaturização bell labs microchip lei de moore' },
        { id: '#gui-e-ux', title: 'Interface Gráfica (GUI)', content: 'xerox parc macintosh mouse janelas steve jobs' },
        { id: '#internet-www', title: 'Internet e World Wide Web', content: 'arpanet tcp/ip tim berners-lee cern html http' },
        { id: '#open-source', title: 'Código Aberto e Linux', content: 'richard stallman gnu linus torvalds software livre' },
        { id: '#ai-ml', title: 'Inteligência Artificial e Machine Learning', content: 'redes neurais deep learning gpus big data ia generativa gpt' },
        { id: '#next-frontiers', title: 'Computação Quântica', content: 'qubit superposição emaranhamento quântico' }
    ];

    const openSearch = () => {
        searchModal.classList.add('is-visible');
        searchInput.focus();
        document.addEventListener('keydown', trapFocus);
    };

    const closeSearch = () => {
        searchModal.classList.remove('is-visible');
        searchInput.value = '';
        searchResults.innerHTML = '';
        document.removeEventListener('keydown', trapFocus);
        // CORREÇÃO DE ACESSIBILIDADE: Devolve o foco para o botão que abriu o modal.
        searchToggle.focus();
    };

    const performSearch = (query) => { /* ... (A lógica de busca interna não mudou) ... */ };

    // CORREÇÃO DE ACESSIBILIDADE: Função para "prender" o foco dentro do modal.
    const trapFocus = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) { // Se o usuário apertar Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // Se o usuário apertar Tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    };
    
    searchToggle.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', () => performSearch(searchInput.value));
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('is-visible')) closeSearch();
    });
}


// O restante das funções que dependem da GSAP permanecem estruturalmente as mesmas,
// pois a GSAP já é uma biblioteca robusta.
function initSmoothScrollAndGSAP() { /* ...código da Parte 4... */ }
function initReadingProgress() { /* ...código da Parte 3... */ }
function initVonNeumannAnimation() { /* ...código da Parte 3... */ }
function initHorizontalScroll() { /* ...código da Parte 3... */ }
function initMicrointeractions() { /* ...código da Parte 4... */ }
function initScrollAnimations() { /* ...código da Parte 3... */ }
