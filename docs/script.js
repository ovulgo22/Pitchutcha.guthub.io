/*
==================================================================================================
PROJETO: Pitchutcha - Uma Odisséia pela Computação (v2.0)
ARQUIVO: script.js (Versão Final com Paleta de Comandos)
DESCRIÇÃO: Script principal atualizado para incluir a lógica da Paleta de Comandos,
           atalhos de teclado e gerenciamento de foco.
==================================================================================================
*/

'use strict';

/**
 * MÓDULO: LÓGICA DO PRELOADER (v1.0 - Sem alterações)
 */
const preloaderModule = (() => {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return { init: () => {} }; // Defesa contra ausência do elemento

    const loaderBar = preloader.querySelector('.loader-bar');
    const statusElement = preloader.querySelector('#loading-status');
    
    const statusMessages = ['Inicializando sistema...', 'Compilando quarks...', 'Carregando módulos quânticos...', 'Renderizando a realidade...', 'Bem-vindo(a) ao Pitchutcha.'];

    const updateStatus = (index) => {
        if (index < statusMessages.length && statusElement && loaderBar) {
            statusElement.textContent = statusMessages[index];
            const progress = (index + 1) / statusMessages.length;
            loaderBar.style.transform = `scaleX(${progress})`;
            setTimeout(() => updateStatus(index + 1), 400);
        }
    };

    const init = () => {
        updateStatus(0);
        window.addEventListener('load', () => {
            if (loaderBar) loaderBar.style.transform = `scaleX(1)`;
            setTimeout(() => {
                preloader.classList.add('preloader--loaded');
            }, 600);
        });
    };
    
    return { init };
})();


/**
 * MÓDULO: ANIMAÇÕES DE ENTRADA (HERO SECTION) (v1.0 - Sem alterações)
 */
const heroAnimationModule = (() => {
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    if (!heroTitle || !heroSubtitle) return { init: () => {} };

    const setupTitle = () => {
        const text = heroTitle.textContent.trim();
        heroTitle.innerHTML = '';
        text.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char === ' ' ? '\u00A0' : char;
            const wrapperSpan = document.createElement('span');
            wrapperSpan.className = 'char-wrapper';
            wrapperSpan.appendChild(charSpan);
            heroTitle.appendChild(wrapperSpan);
        });
    };

    const animateTitle = () => {
        const chars = document.querySelectorAll('.hero__title .char');
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                char.style.transform = 'translateY(0)';
            }, index * 40);
        });
    };

    const animateSubtitle = () => {
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 1s ease';
            heroSubtitle.style.opacity = '1';
        }, 1200);
    };

    const init = () => {
        setupTitle();
        setTimeout(() => {
            animateTitle();
            animateSubtitle();
        }, 2500);
    };

    return { init };
})();


/**
 * MÓDULO: ANIMAÇÕES DE ROLAGEM (SCROLL-BASED) (v1.0 - Sem alterações)
 */
const scrollAnimationModule = (() => {
    const elementsToAnimate = document.querySelectorAll('.section-title, .sub-section-title, .prose > *, .quote, figure, .interactive-list > li');
    if (elementsToAnimate.length === 0) return { init: () => {} };
    
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const init = () => {
        elementsToAnimate.forEach(el => observer.observe(el));
    };

    return { init };
})();


/**
 * MÓDULO: UI GERAL E SCROLL (v1.0 - Sem alterações)
 */
const uiScrollModule = (() => {
    const header = document.querySelector('.site-header');
    const progressBar = document.querySelector('#reading-progress-bar');
    if (!header) return { init: () => {} };
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            header.classList.add('site-header--hidden');
        } else {
            header.classList.remove('site-header--hidden');
        }
        lastScrollY = currentScrollY;
        
        if(progressBar) {
            const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (currentScrollY / scrollableHeight) * 100;
            progressBar.style.width = `${scrollProgress}%`;
        }
    };

    const init = () => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    return { init };
})();


/**
 * MÓDULO: TROCA DE TEMA (LIGHT/DARK) (v1.0 - Sem alterações)
 */
const themeSwitcherModule = (() => {
    const themeToggleButton = document.querySelector('#theme-toggle');
    if (!themeToggleButton) return { init: () => {} };
    const htmlElement = document.documentElement;

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('pitchutcha-theme', theme);
    };

    const toggleTheme = () => {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };
    
    const init = () => {
        const savedTheme = localStorage.getItem('pitchutcha-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
        themeToggleButton.addEventListener('click', toggleTheme);
    };

    return { init };
})();


/**
 * NOVO MÓDULO: PALETA DE COMANDOS (v2.0)
 * Gerencia a abertura, fechamento e atalhos da paleta de comandos.
 */
const commandPaletteModule = (() => {
    const openButton = document.querySelector('#open-command-palette-button');
    const overlay = document.querySelector('#command-palette-overlay');
    const input = document.querySelector('#command-palette-input');
    const closeButton = document.querySelector('#command-palette-close');

    if (!openButton || !overlay || !input || !closeButton) {
        return { init: () => {} }; // Não faz nada se os elementos não existirem
    }
    
    const openPalette = () => {
        overlay.classList.add('is-active');
        // Acessibilidade: Foca no input para digitação imediata.
        setTimeout(() => input.focus(), 150);
    };

    const closePalette = () => {
        overlay.classList.remove('is-active');
    };

    const handleKeyboardShortcuts = (event) => {
        // Atalho para abrir: Ctrl+K ou Cmd+K
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault(); // Impede o navegador de usar o atalho para sua própria busca.
            openPalette();
        }
        // Atalho para fechar: Escape
        if (event.key === 'Escape' && overlay.classList.contains('is-active')) {
            closePalette();
        }
    };

    const init = () => {
        openButton.addEventListener('click', openPalette);
        closeButton.addEventListener('click', closePalette);
        
        // Fecha ao clicar fora do modal (no overlay)
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closePalette();
            }
        });

        // Adiciona o listener para atalhos de teclado
        document.addEventListener('keydown', handleKeyboardShortcuts);
    };

    return { init };
})();



/**
 * PONTO DE ENTRADA PRINCIPAL DA APLICAÇÃO (VERSÃO FINAL 2.0)
 * Inicializa todos os módulos do projeto.
 */
document.addEventListener('DOMContentLoaded', () => {
    preloaderModule.init();
    heroAnimationModule.init();
    scrollAnimationModule.init();
    uiScrollModule.init();
    themeSwitcherModule.init();
    
    // Inicializa o novo módulo da v2.0
    commandPaletteModule.init();

    console.log("Pitchutcha Project v2.0 Initialized Successfully.");
});
