/*
  Projeto: Pitchutcha (Versão 1.0)
  Arquivo: script.js
  Desenvolvido por: Uma equipe multidisciplinar de especialistas
  Data: 06 de Setembro de 2025
  Descrição: O cérebro da aplicação. Controla a renderização do globo 3D com Three.js,
  orquestra as animações com GSAP e gerencia toda a interatividade do usuário.

  --------------------------------------------------
  ÍNDICE DO SCRIPT
  --------------------------------------------------
  1.0 - Importações de Módulos (Three.js)
  2.0 - Configuração Inicial e Estado da Aplicação
  3.0 - Módulo Principal de Inicialização
  4.0 - Módulo de Gerenciamento do Preloader
  5.0 - Módulo de Setup do Globo 3D (Three.js)
    5.1 - Cena, Câmera e Renderizador
    5.2 - Iluminação da Cena
    5.3 - Criação do Planeta Terra
    5.4 - Criação da Camada de Nuvens
    5.5 - Criação do Fundo de Estrelas
    5.6 - Controles de Interação (OrbitControls)
    5.7 - Loop de Animação
  6.0 - Módulo de Animações de Rolagem (GSAP)
    6.1 - Revelação dos Capítulos
    6.2 - Sincronização da Linha do Tempo
    6.3 - Animação do Globo Conectada à Rolagem
  7.0 - Módulo de Handlers de UI
    7.1 - Navegação pela Linha do Tempo
    7.2 - Atualização do Ano no Rodapé
    7.3 - Responsividade (Resize Handler)
  --------------------------------------------------
*/

// =================================================================
// 1.0 - IMPORTAÇÕES DE MÓDULOS (THREE.JS)
// =================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// =================================================================
// 2.0 - CONFIGURAÇÃO INICIAL E ESTADO DA APLICAÇÃO
// =================================================================
const AppState = {
    globeContainer: document.getElementById('globe-container'),
    timelineNav: document.getElementById('timeline-nav'),
    chapters: document.querySelectorAll('.narrative-chapter'),
    three: {
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        earth: null,
        clouds: null,
        stars: null,
        sunLight: null
    },
    animation: {
        isDragging: false
    }
};

// =================================================================
// 3.0 - MÓDULO PRINCIPAL DE INICIALIZAÇÃO
// =================================================================
function init() {
    handlePreloader();
    setupGlobe();
    setupScrollAnimations();
    setupUIHandlers();
}

document.addEventListener('DOMContentLoaded', init);

// =================================================================
// 4.0 - MÓDULO DE GERENCIAMENTO DO PRELOADER
// =================================================================
function handlePreloader() {
    const preloader = document.getElementById('preloader');
    const loadingStatusText = document.getElementById('loading-status-text');

    // Usamos window.onload para garantir que todas as texturas e assets foram carregados
    window.onload = () => {
        loadingStatusText.textContent = 'Universo pronto.';
        setTimeout(() => {
            document.body.classList.add('loaded');
            // Remove o preloader do DOM após a transição para liberar memória
            preloader.addEventListener('transitionend', () => preloader.remove());
        }, 1000);
    };
}


// =================================================================
// 5.0 - MÓDULO DE SETUP DO GLOBO 3D (THREE.JS)
// =================================================================
function setupGlobe() {
    const threeState = AppState.three;

    // 5.1 - Cena, Câmera e Renderizador
    threeState.scene = new THREE.Scene();
    threeState.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    threeState.camera.position.z = 2.5;

    threeState.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    threeState.renderer.setSize(window.innerWidth, window.innerHeight);
    threeState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    AppState.globeContainer.appendChild(threeState.renderer.domElement);

    // 5.2 - Iluminação da Cena
    // Luz ambiente para iluminar o lado escuro da Terra
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    threeState.scene.add(ambientLight);
    // Luz direcional para simular o Sol
    threeState.sunLight = new THREE.DirectionalLight(0xffffff, 3);
    threeState.sunLight.position.set(5, 3, 5);
    threeState.scene.add(threeState.sunLight);

    // 5.3 - Criação do Planeta Terra
    const textureLoader = new THREE.TextureLoader();
    
    // === ATENÇÃO: SUBSTITUA ESTES CAMINHOS PELOS SEUS ARQUIVOS DE TEXTURA ===
    const earthDayMap = textureLoader.load('https://raw.githubusercontent.com/master-fa/Pitchutcha/main/8k_earth_daymap.jpg'); // Mapa de dia (cor)
    const earthNormalMap = textureLoader.load('https://raw.githubusercontent.com/master-fa/Pitchutcha/main/8k_earth_normal_map.jpg'); // Mapa de normais (relevo)
    const earthSpecularMap = textureLoader.load('https://raw.githubusercontent.com/master-fa/Pitchutcha/main/8k_earth_specular_map.jpg'); // Mapa especular (brilho da água)
    // ========================================================================
    
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthDayMap,
        normalMap: earthNormalMap,
        metalnessMap: earthSpecularMap, // Usando como mapa de metalicidade para brilho
        metalness: 0.6,
        roughness: 0.7
    });
    threeState.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    threeState.scene.add(threeState.earth);

    // 5.4 - Criação da Camada de Nuvens
    const cloudMap = textureLoader.load('https://raw.githubusercontent.com/master-fa/Pitchutcha/main/8k_earth_clouds.jpg');
    const cloudGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    threeState.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    threeState.scene.add(threeState.clouds);

    // 5.5 - Criação do Fundo de Estrelas
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.005 });
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 2000;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    threeState.stars = new THREE.Points(starGeometry, starMaterial);
    threeState.scene.add(threeState.stars);

    // 5.6 - Controles de Interação (OrbitControls)
    threeState.controls = new OrbitControls(threeState.camera, threeState.renderer.domElement);
    threeState.controls.enableDamping = true;
    threeState.controls.enablePan = false;
    threeState.controls.enableZoom = false; // O zoom será controlado pela rolagem
    threeState.controls.minDistance = 2.5;
    threeState.controls.maxDistance = 5;

    // Detectar quando o usuário está arrastando o globo
    threeState.controls.addEventListener('start', () => AppState.animation.isDragging = true);
    threeState.controls.addEventListener('end', () => AppState.animation.isDragging = false);

    // 5.7 - Loop de Animação
    animate();
}

function animate() {
    const threeState = AppState.three;
    requestAnimationFrame(animate);

    // Rotação sutil contínua
    if (!AppState.animation.isDragging) {
        threeState.earth.rotation.y += 0.0005;
        threeState.clouds.rotation.y += 0.0007;
    }
    
    threeState.controls.update();
    threeState.renderer.render(threeState.scene, threeState.camera);
}

// =================================================================
// 6.0 - MÓDULO DE ANIMAÇÕES DE ROLAGEM (GSAP)
// =================================================================
function setupScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // 6.1 - Revelação dos Capítulos
    AppState.chapters.forEach(chapter => {
        gsap.to(chapter, {
            scrollTrigger: {
                trigger: chapter,
                start: 'top 80%',
                onEnter: () => chapter.classList.add('is-visible'),
                onEnterBack: () => chapter.classList.add('is-visible'),
                onLeave: () => chapter.classList.remove('is-visible'),
                onLeaveBack: () => chapter.classList.remove('is-visible')
            }
        });
    });

    // 6.2 - Sincronização da Linha do Tempo
    const timelineItems = document.querySelectorAll('.timeline-item');
    AppState.chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
            trigger: chapter,
            start: 'top center',
            end: 'bottom center',
            onToggle: self => {
                if (self.isActive) {
                    timelineItems.forEach(item => item.classList.remove('active'));
                    timelineItems[index].classList.add('active');
                }
            }
        });
    });

    // 6.3 - Animação do Globo Conectada à Rolagem
    const journey = document.getElementById('narrative-journey');
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: journey,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1 // Suaviza a animação durante a rolagem
        }
    });

    // Foco no Berço da Civilização
    tl.to(AppState.three.earth.rotation, { 
        y: Math.PI / 2, // Gira para a África/Oriente Médio
        x: 0.3
    }, 'chapter-humanity')
    // Foco na Europa para a Revolução Científica
    .to(AppState.three.earth.rotation, { 
        y: 0, 
        x: 0.7
    }, 'chapter-science')
    // Foco global para a era da tecnologia
    .to(AppState.three.earth.rotation, { 
        y: -Math.PI / 1.5, // Gira para as Américas/Pacífico
        x: 0.5 
    }, 'chapter-technology')
    // Visão ampla para o futuro
    .to(AppState.three.camera.position, {
        z: 3.5
    }, 'chapter-future');

    // Mapeando os marcadores da timeline da GSAP aos nossos capítulos
    // O valor 'start' define onde na rolagem a animação deve começar
    ScrollTrigger.create({
        trigger: '#chapter-humanity',
        start: 'top bottom',
        end: 'bottom top',
        animation: tl,
        scrub: true,
        markers: false, // Mude para true para depurar as posições
        onUpdate: self => {
            const progress = self.progress;
            const humanityStart = document.getElementById('chapter-humanity').offsetTop / journey.scrollHeight;
            const scienceStart = document.getElementById('chapter-science').offsetTop / journey.scrollHeight;
            const technologyStart = document.getElementById('chapter-technology').offsetTop / journey.scrollHeight;
            const futureStart = document.getElementById('chapter-future').offsetTop / journey.scrollHeight;
            
            if (progress > futureStart) tl.seek('chapter-future');
            else if (progress > technologyStart) tl.seek('chapter-technology');
            else if (progress > scienceStart) tl.seek('chapter-science');
            else if (progress > humanityStart) tl.seek('chapter-humanity');
        }
    });

    // Animação de fade-out do texto do Hero
    gsap.to('.hero-text-content', {
        opacity: 0,
        scrollTrigger: {
            trigger: '#hero-globe',
            start: 'center center',
            end: 'bottom top',
            scrub: true
        }
    });
}


// =================================================================
// 7.0 - MÓDULO DE HANDLERS DE UI
// =================================================================
function setupUIHandlers() {
    // 7.1 - Navegação pela Linha do Tempo
    const timelineLinks = document.querySelectorAll('.timeline-link');
    timelineLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: targetElement.offsetTop, autoKill: false },
                    ease: "power2.inOut"
                });
            }
        });
    });

    // 7.2 - Atualização do Ano no Rodapé
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 7.3 - Responsividade (Resize Handler)
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const threeState = AppState.three;
    threeState.camera.aspect = window.innerWidth / window.innerHeight;
    threeState.camera.updateProjectionMatrix();
    threeState.renderer.setSize(window.innerWidth, window.innerHeight);
    threeState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
