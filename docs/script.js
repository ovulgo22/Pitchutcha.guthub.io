/*
====================================================================================
PROJETO: Pitchutcha - A Enciclopédia Definitiva da Computação
VERSÃO: 1.0
ARQUIVO: script.js (Lógica de Interatividade)
AUTORIA: Equipe de Especialistas (IA, UX, UI, Devs, SEO, QA, A11y, Creative)
DESCRIÇÃO: Script principal que gerencia toda a interatividade do site.
           Isso inclui o gerenciamento de tema, navegação móvel, TOC dinâmico,
           e outras melhorias de experiência do usuário. O código é escrito
           com foco em performance, acessibilidade e manutenibilidade.
====================================================================================
*/

// Envolve todo o código em uma IIFE (Immediately Invoked Function Expression)
// para evitar poluir o escopo global.
(function() {
    'use strict';

    // Espera o DOM estar completamente carregado antes de executar o script
    document.addEventListener('DOMContentLoaded', () => {

        /*------------------------------------------------------------------
          1. SELEÇÃO DE ELEMENTOS (CACHE)
          Armazenamos os elementos do DOM em variáveis para evitar
          consultas repetidas, melhorando a performance.
        ------------------------------------------------------------------*/
        
        const themeToggleButton = document.getElementById('theme-toggle');
        const menuToggleButton = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const body = document.body;


        /*------------------------------------------------------------------
          2. GERENCIAMENTO DE TEMA (CLARO/ESCURO)
        ------------------------------------------------------------------*/
        
        const themeManager = {
            // Chave para salvar a preferência no localStorage
            storageKey: 'pitchutcha_theme',

            // Função para obter o tema preferido do sistema operacional
            getSystemPreference: function() {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            },

            // Função para obter o tema atual (do localStorage ou do sistema)
            getTheme: function() {
                return localStorage.getItem(this.storageKey) || this.getSystemPreference();
            },
            
            // Função para aplicar um tema ao body
            applyTheme: function(theme) {
                body.setAttribute('data-theme', theme);
                localStorage.setItem(this.storageKey, theme);
            },

            // Função para alternar o tema
            toggleTheme: function() {
                const currentTheme = this.getTheme();
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
            },

            // Função de inicialização
            init: function() {
                this.applyTheme(this.getTheme());

                if (themeToggleButton) {
                    themeToggleButton.addEventListener('click', () => this.toggleTheme());
                }

                // Ouve por mudanças na preferência de tema do sistema operacional
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                    // Só altera se o usuário não tiver uma preferência salva
                    if (!localStorage.getItem(this.storageKey)) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        };

        // Inicializa o gerenciador de tema
        themeManager.init();


        /*------------------------------------------------------------------
          3. NAVEGAÇÃO MÓVEL (SIDEBAR TOGGLE)
        ------------------------------------------------------------------*/
        
        const mobileNavManager = {
            isOpen: false,

            // Função para alternar a visibilidade da sidebar
            toggleSidebar: function() {
                this.isOpen = !this.isOpen;
                
                if (sidebar) {
                    sidebar.classList.toggle('is-open', this.isOpen);
                }

                if (menuToggleButton) {
                    menuToggleButton.classList.toggle('is-active', this.isOpen);
                    menuToggleButton.setAttribute('aria-expanded', this.isOpen);
                }

                // Adiciona uma classe ao body para evitar scroll quando o menu estiver aberto
                body.classList.toggle('no-scroll', this.isOpen);
            },

            // Função para fechar a sidebar (ex: ao clicar fora)
            closeSidebar: function() {
                if (this.isOpen) {
                    this.toggleSidebar();
                }
            },

            // Função de inicialização
            init: function() {
                if (menuToggleButton && sidebar) {
                    menuToggleButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Evita que o clique feche o menu imediatamente
                        this.toggleSidebar();
                    });

                    // Fecha a sidebar se o usuário clicar em um link dentro dela
                    sidebar.addEventListener('click', (e) => {
                        if (e.target.tagName === 'A') {
                            this.closeSidebar();
                        }
                    });

                    // Fecha a sidebar se o usuário clicar fora dela (no conteúdo principal)
                    mainContent.addEventListener('click', () => this.closeSidebar());

                    // Fecha a sidebar se a tecla 'Escape' for pressionada
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            this.closeSidebar();
                        }
                    });
                }
            }
        };

        // Inicializa o gerenciador de navegação móvel
        mobileNavManager.init();


        // ... (A lógica para o TOC dinâmico e outras funcionalidades virá na próxima parte)

    }); // Fim do 'DOMContentLoaded'

})(); // Fim da IIFE

// FIM DA PARTE 1 do script.js
/*
====================================================================================
  CONTINUAÇÃO DA PARTE 1
====================================================================================
*/

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        
        // ... (Código da Parte 1: Seleção de Elementos, ThemeManager, MobileNavManager) ...
        const themeToggleButton = document.getElementById('theme-toggle');
        const menuToggleButton = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const body = document.body;

        const themeManager = { /* ... Lógica da Parte 1 ... */ 
            storageKey: 'pitchutcha_theme',
            getSystemPreference: function() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; },
            getTheme: function() { return localStorage.getItem(this.storageKey) || this.getSystemPreference(); },
            applyTheme: function(theme) { body.setAttribute('data-theme', theme); localStorage.setItem(this.storageKey, theme); },
            toggleTheme: function() { const currentTheme = this.getTheme(); const newTheme = currentTheme === 'light' ? 'dark' : 'light'; this.applyTheme(newTheme); },
            init: function() { this.applyTheme(this.getTheme()); if (themeToggleButton) { themeToggleButton.addEventListener('click', () => this.toggleTheme()); } window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { if (!localStorage.getItem(this.storageKey)) { this.applyTheme(e.matches ? 'dark' : 'light'); } }); }
        };
        themeManager.init();

        const mobileNavManager = { /* ... Lógica da Parte 1 ... */
            isOpen: false,
            toggleSidebar: function() { this.isOpen = !this.isOpen; if (sidebar) { sidebar.classList.toggle('is-open', this.isOpen); } if (menuToggleButton) { menuToggleButton.classList.toggle('is-active', this.isOpen); menuToggleButton.setAttribute('aria-expanded', this.isOpen); } body.classList.toggle('no-scroll', this.isOpen); },
            closeSidebar: function() { if (this.isOpen) { this.toggleSidebar(); } },
            init: function() { if (menuToggleButton && sidebar) { menuToggleButton.addEventListener('click', (e) => { e.stopPropagation(); this.toggleSidebar(); }); sidebar.addEventListener('click', (e) => { if (e.target.tagName === 'A') { this.closeSidebar(); } }); mainContent.addEventListener('click', () => this.closeSidebar()); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { this.closeSidebar(); } }); } }
        };
        mobileNavManager.init();

        /*------------------------------------------------------------------
          4. ÍNDICE DA PÁGINA DINÂMICO (TOC SCROLLSPY)
          Usa a IntersectionObserver API para destacar a seção visível
          na barra lateral direita, uma forma muito mais performática
          do que usar eventos de scroll.
        ------------------------------------------------------------------*/

        const tocManager = {
            headings: [],
            tocLinks: [],
            observer: null,

            init: function() {
                const tocSidebar = document.getElementById('toc-sidebar');
                if (!tocSidebar) return; // Não faz nada se o TOC não existir na página

                this.headings = Array.from(mainContent.querySelectorAll('h2[id], h3[id]'));
                this.tocLinks = Array.from(tocSidebar.querySelectorAll('.toc-link'));
                
                if (this.headings.length === 0 || this.tocLinks.length === 0) return;

                const observerOptions = {
                    rootMargin: '0px 0px -80% 0px', // Ativa quando o título está no topo da tela
                    threshold: 1.0
                };
                
                this.observer = new IntersectionObserver(this.handleIntersection.bind(this), observerOptions);
                this.headings.forEach(heading => this.observer.observe(heading));
            },

            handleIntersection: function(entries) {
                entries.forEach(entry => {
                    const id = entry.target.getAttribute('id');
                    const tocLink = this.tocLinks.find(link => link.getAttribute('href') === `#${id}`);
                    
                    if (tocLink) {
                        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
                            // Remove a classe de todos os outros antes de adicionar
                            this.tocLinks.forEach(link => link.classList.remove('is-active'));
                            tocLink.classList.add('is-active');
                        }
                    }
                });
            }
        };

        tocManager.init();

        
        /*------------------------------------------------------------------
          5. MELHORIAS DE UX NA SIDEBAR
          Evita que a sidebar "salte" ao abrir/fechar um <details>.
        ------------------------------------------------------------------*/

        const sidebarUX = {
            init: function() {
                if (!sidebar) return;

                const detailsElements = sidebar.querySelectorAll('details');
                detailsElements.forEach(details => {
                    const summary = details.querySelector('summary');
                    if (summary) {
                        summary.addEventListener('click', (e) => {
                            // Previne o comportamento padrão para controlar a abertura/fechamento
                            e.preventDefault();
                            
                            const wasOpen = details.open;
                            const summaryRect = summary.getBoundingClientRect();
                            
                            // Abre ou fecha o details manualmente
                            if (wasOpen) {
                                details.removeAttribute('open');
                            } else {
                                details.setAttribute('open', '');
                            }
                            
                            // Após o toggle, ajusta o scroll para manter o summary no lugar
                            const summaryRectAfter = summary.getBoundingClientRect();
                            sidebar.scrollTop += summaryRectAfter.top - summaryRect.top;
                        });
                    }
                });
            }
        };

        sidebarUX.init();


        /*------------------------------------------------------------------
          6. BOTÃO "VOLTAR AO TOPO"
          Aparece quando o usuário rola a página para baixo e
          permite um retorno rápido ao topo.
        ------------------------------------------------------------------*/

        const backToTopManager = {
            button: null,

            createButton: function() {
                this.button = document.createElement('button');
                this.button.id = 'back-to-top';
                this.button.className = 'back-to-top-button';
                this.button.setAttribute('aria-label', 'Voltar ao topo');
                this.button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 4l-1.41 1.41L12 6.83l1.41-1.42L12 4zm0 14l-1.41 1.41L12 20.83l1.41-1.42L12 18zM7.41 13.41L6 12l6-6 6 6-1.41 1.41L12 8.83 7.41 13.41z"/></svg>`.replace('d="M12 4l-1.41 1.41L12 6.83l1.41-1.42L12 4zm0 14l-1.41 1.41L12 20.83l1.41-1.42L12 18zM7.41 13.41L6 12l6-6 6 6-1.41 1.41L12 8.83 7.41 13.41z"', 'd="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"');
                body.appendChild(this.button);
            },

            handleScroll: function() {
                const scrollY = mainContent.scrollTop; // Usamos o scroll do main content
                if (scrollY > window.innerHeight / 2) {
                    this.button.classList.add('is-visible');
                } else {
                    this.button.classList.remove('is-visible');
                }
            },

            scrollToTop: function() {
                mainContent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            },

            init: function() {
                this.createButton();
                mainContent.addEventListener('scroll', this.handleScroll.bind(this));
                this.button.addEventListener('click', this.scrollToTop.bind(this));

                // Adicionar estilos para o botão dinamicamente
                const styles = `
                    .back-to-top-button {
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        width: 50px;
                        height: 50px;
                        background-color: var(--color-primary);
                        color: var(--color-primary-text);
                        border: none;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        box-shadow: var(--shadow-lg);
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity var(--transition-base), transform var(--transition-base);
                        z-index: 1000;
                    }
                    .back-to-top-button.is-visible {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    .back-to-top-button:hover {
                        background-color: var(--color-primary-hover);
                    }
                `;
                const styleSheet = document.createElement("style");
                styleSheet.innerText = styles;
                document.head.appendChild(styleSheet);
            }
        };

        backToTopManager.init();

    }); // Fim do 'DOMContentLoaded'

})(); // Fim da IIFE

/* ==================================================================================== */
/* |                      FIM DO PROJETO PITCHUTCHA - VERSÃO 1.0                      | */
/* ==================================================================================== */
