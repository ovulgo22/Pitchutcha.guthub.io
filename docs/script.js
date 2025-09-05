/*
====================================================================================
PROJETO: Pitchutcha (v3.0 - Reestruturação GitHub Docs)
ARQUIVO: script.js
DESCRIÇÃO: Script final para controlar toda a interatividade da nova interface,
           incluindo menu móvel, troca de tema e "scroll spy" do TOC.
====================================================================================
*/

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /**
     * MÓDULO: NAVEGAÇÃO MÓVEL
     * Controla a abertura e fechamento da sidebar em telas pequenas.
     */
    const mobileNavModule = (() => {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');

        if (!menuToggle || !sidebar) return;

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            sidebar.classList.toggle('is-open');
        });
    })();


    /**
     * MÓDULO: TROCA DE TEMA (LIGHT/DARK)
     * Gerencia a alternância de temas e salva a preferência do usuário.
     */
    const themeSwitcherModule = (() => {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        if (!themeToggle) return;

        const applyTheme = (theme) => {
            body.dataset.theme = theme;
            localStorage.setItem('pitchutcha-theme', theme);
        };

        const initTheme = () => {
            const savedTheme = localStorage.getItem('pitchutcha-theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme) {
                applyTheme(savedTheme);
            } else if (systemPrefersDark) {
                applyTheme('dark');
            } else {
                applyTheme('light'); // Padrão
            }
        };

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.dataset.theme || 'light';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });

        initTheme();
    })();


    /**
     * MÓDULO: TOC INTERATIVO (SCROLL SPY)
     * Destaca o link no TOC correspondente à seção visível na tela.
     */
    const tocScrollSpyModule = (() => {
        const mainContent = document.querySelector('.main-content');
        const tocLinks = document.querySelectorAll('.toc-link');
        
        // Mapeia os links do TOC para os elementos de cabeçalho que eles representam.
        // O `href` do link deve ser o `id` do cabeçalho (ex: <a href="#titulo"> e <h2 id="titulo">)
        const headingElements = Array.from(tocLinks).map(link => {
            const id = link.getAttribute('href');
            return document.querySelector(id);
        }).filter(Boolean); // Filtra links que não encontraram um cabeçalho

        if (headingElements.length === 0 || tocLinks.length === 0) return;

        const observerOptions = {
            root: mainContent, // Observa o scroll dentro do contêiner de conteúdo
            rootMargin: '0px 0px -80% 0px', // Ativa quando o título está no topo da área visível
            threshold: 1.0
        };

        let activeLink = null;

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
                    
                    if (link && link !== activeLink) {
                        // Remove a classe ativa de todos os links
                        tocLinks.forEach(l => l.classList.remove('is-active'));
                        // Adiciona a classe ativa ao link atual
                        link.classList.add('is-active');
                        activeLink = link;
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        headingElements.forEach(header => observer.observe(header));
    })();

    console.log("Pitchutcha v3.0 (GitHub Docs Style) Initialized.");
});
