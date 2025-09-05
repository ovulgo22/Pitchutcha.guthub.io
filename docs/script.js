/*
====================================================================================
PROJETO: Pitchutcha (Versão Final)
ARQUIVO: script.js
DESCRIÇÃO: Script final para controlar toda a interatividade da interface
           estilo GitHub Docs.
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
            menuToggle.classList.toggle('is-active');
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
                applyTheme('light');
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
        const mainContent = document.querySelector('.content-and-toc-wrapper');
        const tocLinks = document.querySelectorAll('.toc-link');
        const headingElements = Array.from(tocLinks)
            .map(link => {
                const id = link.getAttribute('href');
                try {
                    return document.querySelector(id);
                } catch (e) {
                    return null;
                }
            })
            .filter(Boolean);

        if (headingElements.length === 0 || !mainContent) return;

        const observerOptions = {
            root: mainContent,
            rootMargin: '0px 0px -85% 0px',
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
                    
                    tocLinks.forEach(link => link.classList.remove('is-active'));
                    if (activeLink) {
                        activeLink.classList.add('is-active');
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        headingElements.forEach(header => observer.observe(header));
    })();

    console.log("Pitchutcha (Final Version) Initialized.");
});
