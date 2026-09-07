import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles/sobre.css';
import equipeImg from '../assets/equipeAuvox.png';
import Equipe from './Equipe.jsx';
import Contato from './Contato.jsx';

gsap.registerPlugin(ScrollTrigger);

function Sobre() {
    const secaoRef = useRef(null);

    /* ── ABERTURA DA SEÇÃO ──
       Tudo aqui usa `scrub`: o progresso da animação fica amarrado à
       posição do scroll, então descendo a seção se abre e subindo ela se
       fecha — como uma gaveta sendo puxada e devolvida. Nenhum "play
       once": o caminho de volta é automático.

       try/catch porque o componente vive dentro do <Suspense> do App: um
       erro solto aqui derrubaria a árvore inteira e faria os outros
       componentes sumirem junto. */
    useEffect(() => {
        const raiz = secaoRef.current;
        if (!raiz) return undefined;

        let ctx;

        try {
            ctx = gsap.context(() => {
                /* 0. A GAVETA — o painel branco inteiro
                   O card se abre a partir do centro: o clip-path começa
                   fechado (uma fresta na altura do meio) e vai abrindo para
                   cima e para baixo até revelar a seção inteira. Descendo o
                   scroll ele abre; subindo, fecha de novo.

                   O `round` acompanha o mesmo raio do quadro (--quadro-raio,
                   definido no home.css), senão os cantos arredondados do
                   card seriam recortados em ângulo reto durante a animação. */
                const raio =
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--quadro-raio')
                        .trim() || '32px';

                gsap.fromTo(
                    raiz,
                    {
                        clipPath: `inset(45% 0% 45% 0% round ${raio})`,
                        scale: 0.97,
                    },
                    {
                        // Ao terminar, o painel não pode manter recorte: sua
                        // borda inferior se une diretamente à onda do Footer.
                        clipPath: 'none',
                        scale: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: raiz,
                            start: 'top 95%',
                            end: 'top 35%',
                            scrub: 0.9,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                /* 1. CABEÇALHO — sobe e aparece */
                const cabecalho = raiz.querySelector('.sobre-topo');

                if (cabecalho) {
                    gsap.fromTo(
                        cabecalho.children,
                        { opacity: 0, y: 34 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: 'power2.out',
                            stagger: 0.12,
                            scrollTrigger: {
                                trigger: cabecalho,
                                start: 'top 92%',
                                end: 'top 50%',
                                scrub: 0.8,
                                invalidateOnRefresh: true,
                            },
                        }
                    );
                }

                /* 2. HERO — a foto abre em círculo e o texto desliza */
                const hero = raiz.querySelector('.sobre-hero');
                const molduraFoto = raiz.querySelector('.sobre-hero-img-wrap');
                const foto = raiz.querySelector('.sobre-hero-img-frame');
                const textos = Array.from(
                    raiz.querySelectorAll('.sobre-hero-content > *:not(.sobre-tags)')
                );
                const tags = Array.from(raiz.querySelectorAll('.sobre-tag'));

                if (hero) {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: hero,
                            start: 'top 85%',
                            end: 'top 35%',
                            scrub: 0.9,
                            invalidateOnRefresh: true,
                        },
                    });

                    if (molduraFoto) {
                        tl.fromTo(
                            molduraFoto,
                            { opacity: 0, y: 40 },
                            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                            0
                        );
                    }

                    /* A foto se abre a partir do centro. O clip vai até 75%
                       (e não 50%) porque a diagonal de um quadrado é ~71% —
                       assim o círculo termina maior que a imagem e não corta
                       a borda dourada no fim da animação. */
                    if (foto) {
                        tl.fromTo(
                            foto,
                            { clipPath: 'circle(0% at 50% 50%)' },
                            {
                                clipPath: 'circle(75% at 50% 50%)',
                                duration: 1.2,
                                ease: 'power2.out',
                            },
                            0.05
                        );
                    }

                    // texto entra deslizando da direita, linha por linha
                    if (textos.length) {
                        tl.fromTo(
                            textos,
                            { opacity: 0, x: 40 },
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.9,
                                ease: 'power2.out',
                                stagger: 0.12,
                            },
                            0.2
                        );
                    }

                    // as tags surgem por último, em cascata curta
                    if (tags.length) {
                        tl.fromTo(
                            tags,
                            { opacity: 0, y: 18, scale: 0.9 },
                            {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.6,
                                ease: 'back.out(1.6)',
                                stagger: 0.06,
                            },
                            0.6
                        );
                    }
                }

                /* 3. CARDS DA EQUIPE — o efeito de gaveta propriamente dito:
                   cada card vem tombado para trás no eixo X e "deita" na
                   posição final, um depois do outro.
                   A animação vai no .container (wrapper) e não no .card, para
                   não disputar o transform com o efeito 3D do hover. */
                const cards = Array.from(
                    raiz.querySelectorAll('.carouselWrapper .container')
                );

                if (cards.length) {
                    gsap.fromTo(
                        cards,
                        {
                            opacity: 0,
                            y: 60,
                            rotateX: -18,
                            transformPerspective: 900,
                            transformOrigin: '50% 0%',
                        },
                        {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            duration: 1,
                            ease: 'power3.out',
                            stagger: 0.09,
                            scrollTrigger: {
                                trigger: raiz.querySelector('.carouselWrapper'),
                                start: 'top 88%',
                                end: 'top 40%',
                                scrub: 0.9,
                                invalidateOnRefresh: true,
                            },
                        }
                    );
                }

                ScrollTrigger.refresh();
            }, secaoRef);
        } catch (erro) {
            console.warn('[Sobre] animação desativada:', erro);
        }

        const onLoad = () => {
            try { ScrollTrigger.refresh(); } catch (_) { /* ignora */ }
        };
        window.addEventListener('load', onLoad);

        return () => {
            window.removeEventListener('load', onLoad);
            try { if (ctx) ctx.revert(); } catch (_) { /* ignora */ }
        };
    }, []);

    return (
        <section className="sobre" id="sobre" ref={secaoRef}>
            <div className="sobre-container">

                {/* Cabeçalho no formato padrão do site (mesmas classes da Equipe) */}
                <div className="sobre-topo secao-topo">
                    <p className="secao-slug">
                        <span className="barrasFirtsP">//</span> A história
                    </p>

                    <h2 className="secao-titulo">
                        Somos a <span>AUVOX</span>
                    </h2>

                    <div className="secao-sep" />
                </div>

                
                {/* Hero Section */}
                <div className="sobre-hero">
                    <div className="sobre-hero-img-wrap">
                        <div className="sobre-hero-img-frame">
                            <img src={equipeImg} loading="lazy" alt="Equipe Auvox" className="sobre-hero-img" />
                        </div>
                        <span className="sobre-hero-dot"></span>
                    </div>

                    <div className="sobre-hero-content">
                        <p className="sobre-role">Software house. Estudantes de Desenvolvimento de Sistemas transformando ideias em produtos digitais.</p>

                        <p className="sobre-description">
                            A Auvox nasceu dentro da ETEC de Guaianazes, no curso de Desenvolvimento de Sistemas II, como resposta a um problema simples: boas ideias digitais raramente saem do papel por falta de quem execute com qualidade de ponta a ponta.
                        </p>
                        <p className="sobre-description">
                            Hoje desenvolvemos aplicativos móveis, plataformas web e sistemas personalizados para os mais diversos setores, ajudando empresas a automatizarem processos e escalarem seus negócios — unindo teoria e prática do jeito que a gente aprendeu.
                        </p>

                        <div className="sobre-tags">
                            <span className="sobre-tag">Apps Mobile</span>
                            <span className="sobre-tag">Sistemas Web</span>
                            <span className="sobre-tag">UX/UI</span>
                            <span className="sobre-tag">Automação</span>
                            <span className="sobre-tag">Consultoria</span>
                        </div>
                    </div>
                </div>

                {/* Equipe — mesmo componente/seção do Sobre, sem quebra visual entre os dois */}
                <Equipe />

                <Contato />

            </div>
        </section>
    );
}

export default Sobre;
