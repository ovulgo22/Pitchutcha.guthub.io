/*
==================================================================================================
PROJETO: Pitchutcha - Uma Odisséia pela Computação
ARQUIVO: script.js (Parte 1 de várias)
DESCRIÇÃO: Script principal para interatividade, animações e lógica do site.
           Esta parte foca no preloader, animações de entrada e o sistema de 
           revelação de conteúdo na rolagem (scroll).
==================================================================================================

FRONT-END DEVELOPMENT & CREATIVE TECHNOLOGY:
- Usamos o modo estrito ('use strict') para escrever um código mais limpo e seguro.
- O código é organizado em módulos funcionais (IIFE - Immediately Invoked Function Expressions)
  para encapsular a lógica e evitar poluição do escopo global.
- O uso do Intersection Observer API é uma abordagem moderna e performática para animações 
  baseadas em scroll, muito mais eficiente do que event listeners de 'scroll'.
- A orquestração das animações de entrada é feita com delays de `setTimeout`, uma técnica
  simples mas eficaz para criar sequências de animação (staggering).

==================================================================================================
*/

// MODO ESTRITO: Garante um código mais robusto e menos propenso a erros silenciosos.
'use strict';

/**
 * MÓDULO: LÓGICA DO PRELOADER
 * Gerencia a tela de carregamento inicial.
 */
const preloaderModule = (() => {
    // Seleciona os elementos do DOM necessários para o preloader.
    const preloader = document.querySelector('.preloader');
    const loaderBar = document.querySelector('.loader-bar');
    const statusElement = document.querySelector('#loading-status');

    // Array de mensagens para simular o processo de carregamento.
    const statusMessages = [
        'Inicializando sistema...',
        'Compilando quarks...',
        'Carregando módulos quânticos...',
        'Renderizando a realidade...',
        'Bem-vindo(a) ao Pitchutcha.'
    ];

    // Função para atualizar a mensagem de status e a barra de progresso.
    const updateStatus = (index) => {
        if (index < statusMessages.length) {
            statusElement.textContent = statusMessages[index];
            const progress = (index + 1) / statusMessages.length;
            loaderBar.style.transform = `scaleX(${progress})`;
            
            // Chama a próxima atualização após um pequeno intervalo.
            setTimeout(() => updateStatus(index + 1), 400);
        }
    };

    // Função principal para iniciar e finalizar o preloader.
    const init = () => {
        // Inicia a sequência de mensagens de status.
        updateStatus(0);

        // O evento 'load' espera que todos os recursos (imagens, etc.) sejam carregados.
        window.addEventListener('load', () => {
            // Garante que a barra de progresso chegue a 100% antes de desaparecer.
            loaderBar.style.transform = `scaleX(1)`;

            // Após um tempo, adiciona a classe que faz o preloader desaparecer.
            setTimeout(() => {
                preloader.classList.add('preloader--loaded');
            }, 600);
        });
    };
    
    // Retorna a função de inicialização para ser chamada externamente.
    return {
        init
    };
})();


/**
 * MÓDULO: ANIMAÇÕES DE ENTRADA (HERO SECTION)
 * Orquestra as animações iniciais da página.
 */
const heroAnimationModule = (() => {
    // Seleciona os elementos do DOM para a animação.
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');

    // Função para preparar o título, envolvendo cada caractere em spans.
    const setupTitle = () => {
        // .trim() remove espaços em branco no início e fim.
        const text = heroTitle.textContent.trim();
        // Limpa o conteúdo original do h1.
        heroTitle.innerHTML = '';

        // Divide o texto em caracteres e cria a estrutura de spans necessária para a animação.
        text.split('').forEach(char => {
            // Cria um span para o caractere.
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char === ' ' ? '\u00A0' : char; // Usa um non-breaking space para espaços.

            // Cria um wrapper para o span do caractere, que irá mascará-lo.
            const wrapperSpan = document.createElement('span');
            wrapperSpan.className = 'char-wrapper';
            wrapperSpan.appendChild(charSpan);

            // Adiciona o wrapper ao título.
            heroTitle.appendChild(wrapperSpan);
        });
    };

    // Função para animar os caracteres do título um por um.
    const animateTitle = () => {
        const chars = document.querySelectorAll('.hero__title .char');
        chars.forEach((char, index) => {
            // Adiciona a transição e remove a transformação com um delay crescente (stagger).
            setTimeout(() => {
                char.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                char.style.transform = 'translateY(0)';
            }, index * 40); // Delay de 40ms entre cada letra.
        });
    };

    // Função para animar o subtítulo (fade in).
    const animateSubtitle = () => {
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 1s ease';
            heroSubtitle.style.opacity = '1';
        }, 1200); // Começa a animação do subtítulo após a animação do título principal.
    };

    // Função de inicialização do módulo.
    const init = () => {
        setupTitle();
        // Dispara as animações após o preloader começar a desaparecer.
        setTimeout(() => {
            animateTitle();
            animateSubtitle();
        }, 2500); // Delay para sincronizar com o preloader.
    };

    return {
        init
    };
})();


/**
 * MÓDULO: ANIMAÇÕES DE ROLAGEM (SCROLL-BASED)
 * Usa o Intersection Observer para revelar elementos quando entram na tela.
 */
const scrollAnimationModule = (() => {
    // Seleciona todos os elementos que devem ser animados na rolagem.
    const elementsToAnimate = document.querySelectorAll('.section-title, .sub-section-title, .prose > *, .quote, figure, .interactive-list > li');

    // Configurações para o Intersection Observer.
    const observerOptions = {
        root: null, // Observa em relação ao viewport.
        rootMargin: '0px',
        threshold: 0.1 // O elemento é considerado visível quando 10% dele está na tela.
    };

    // A função que será chamada sempre que um elemento observado mudar de visibilidade.
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento está intersectando (visível)...
            if (entry.isIntersecting) {
                // Adiciona a classe que dispara a animação CSS.
                entry.target.classList.add('is-inview');
                // Para de observar o elemento para não animá-lo novamente.
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Cria a instância do observador.
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Função de inicialização que começa a observar todos os elementos selecionados.
    const init = () => {
        elementsToAnimate.forEach(el => observer.observe(el));
    };

    return {
        init
    };
})();


/**
 * PONTO DE ENTRADA PRINCIPAL DA APLICAÇÃO
 * Chama os inicializadores de todos os módulos quando o DOM está pronto.
 */
document.addEventListener('DOMContentLoaded', () => {
    preloaderModule.init();
    heroAnimationModule.init();
    scrollAnimationModule.init();
});
/*
==================================================================================================
ARQUIVO: script.js (Parte 2 de várias)
DESCRIÇÃO: Adiciona micro-interações como o header dinâmico, cursor personalizado e
           a lógica para a troca de tema (light/dark).
==================================================================================================

UI/UX ENGINEERING & FRONT-END DEVELOPMENT:
- A funcionalidade de "auto-hiding header" é uma técnica comum para melhorar a experiência de
  leitura em dispositivos com telas menores, dando mais espaço para o conteúdo. A lógica
  compara a posição de rolagem atual com a anterior para determinar a direção.
- O cursor personalizado é uma decisão de "creative development". Ele adiciona uma camada de 
  sofisticação. A lógica verifica se o dispositivo suporta 'hover' para desativá-lo em
  telas de toque, o que é crucial para a usabilidade.
- A persistência do tema no `localStorage` é uma funcionalidade de UX fundamental. Ela
  respeita a escolha do usuário entre as sessões, criando uma experiência mais consistente.
  O código também verifica a preferência de sistema do usuário (`prefers-color-scheme`)
  como um estado inicial padrão.
==================================================================================================
*/

/**
 * MÓDULO: CONTROLE DO HEADER
 * Esconde o header ao rolar para baixo e mostra ao rolar para cima.
 */
const headerModule = (() => {
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY; // Armazena a última posição de rolagem.

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Se a posição atual for maior que a anterior, o usuário está rolando para baixo.
        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            header.classList.add('site-header--hidden');
        } else {
            header.classList.remove('site-header--hidden');
        }

        // Atualiza a última posição de rolagem.
        lastScrollY = currentScrollY;
    };

    const init = () => {
        window.addEventListener('scroll', handleScroll, { passive: true }); // passive: true melhora a performance de rolagem.
    };

    return {
        init
    };
})();


/**
 * MÓDULO: CURSOR PERSONALIZADO
 * Cria um cursor customizado que reage a elementos interativos.
 */
const customCursorModule = (() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';

    // Função para mover o cursor para a posição do mouse.
    const moveCursor = (e) => {
        // Usamos GSAP (GreenSock Animation Platform) para uma animação mais suave, se estivesse no projeto.
        // Como estamos sem dependências, usamos uma transição CSS.
        // A atualização da posição é feita diretamente com transform para melhor performance.
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const init = () => {
        // VERIFICAÇÃO CRUCIAL: Só ativa o cursor se o dispositivo não for de toque.
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            document.body.appendChild(cursor);
            window.addEventListener('mousemove', moveCursor);

            // Adiciona a classe 'hover' quando o mouse está sobre links ou botões.
            const interactiveElements = document.querySelectorAll('a, button, .interactive-list li');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
            });
        }
    };

    return {
        init
    };
})();


/**
 * MÓDULO: TROCA DE TEMA (LIGHT/DARK)
 * Gerencia a alternância entre os temas e salva a preferência do usuário.
 */
const themeSwitcherModule = (() => {
    const themeToggleButton = document.querySelector('#theme-toggle');
    const htmlElement = document.documentElement; // Seleciona o elemento <html>

    // Função para aplicar o tema com base no valor ('light' ou 'dark').
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        // Salva a preferência no armazenamento local do navegador.
        localStorage.setItem('pitchutcha-theme', theme);
    };

    // Função para alternar o tema atual.
    const toggleTheme = () => {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };
    
    // Função de inicialização que define o tema inicial.
    const init = () => {
        // 1. Verifica se há um tema salvo no localStorage.
        const savedTheme = localStorage.getItem('pitchutcha-theme');
        
        // 2. Se não houver, verifica a preferência de sistema do usuário.
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light'); // Padrão é o tema claro.
        }

        // Adiciona o event listener ao botão de troca de tema.
        themeToggleButton.addEventListener('click', toggleTheme);
    };

    return {
        init
    };
})();


/**
 * PONTO DE ENTRADA PRINCIPAL DA APLICAÇÃO (ATUALIZADO)
 * Adiciona a inicialização dos novos módulos.
 */
document.addEventListener('DOMContentLoaded', () => {
    preloaderModule.init();
    heroAnimationModule.init();
    scrollAnimationModule.init();
    
    // Inicializa os novos módulos.
    headerModule.init();
    customCursorModule.init();
    themeSwitcherModule.init();
});
