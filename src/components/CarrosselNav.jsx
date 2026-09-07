import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/carrosselNav.css';
import '../styles/YouCanScroll.css';
import Carrossel from './Carrossel.jsx';
import logo3d from '../assets/3dauvox.png';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_SCENES = 4;

/* Componente único: junta o slide (Auvox 01–04) e o efeito "Auvox pode
   projetar / prototipar / ..." no mesmo bloco, com um único fundo por trás
   dos dois (.slide-scroll-unificado). Como não são mais dois componentes
   separados cada um com seu próprio fundo, não existe mais nenhuma divisão
   visível entre uma parte e outra — é a mesma superfície do início ao fim. */
export default function CarrosselNav() {
  const mainRef = useRef(null);

  // Animação do slide (troca de cenas 01 → 04)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const layersHero = gsap.utils.toArray('.hero .layer');
      const layersLeft = gsap.utils.toArray('.left-content .layer');
      const layersRight = gsap.utils.toArray('.right-content .layer');
      const dots = gsap.utils.toArray('.scroll-indicator .dot');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: `+=${TOTAL_SCENES * 100}%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < TOTAL_SCENES - 1; i++) {
        const nextIdx = i + 1;

        tl.to('.ocean-text', {
          xPercent: -25 * nextIdx,
          duration: 1,
          ease: 'power2.inOut',
        }, i);

        tl.to('.page-number.-ones', {
          yPercent: -100 * nextIdx,
          duration: 1,
          ease: 'power2.inOut',
        }, i);

        tl.to(layersHero[i], { opacity: 0, filter: 'blur(10px)', y: -20, duration: 0.5 }, i)
          .fromTo(layersHero[nextIdx],
            { opacity: 0, filter: 'blur(10px)', y: 20 },
            { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5 },
            i + 0.5
          );

        tl.to(layersLeft[i], { opacity: 0, y: -20, duration: 0.5 }, i)
          .fromTo(layersLeft[nextIdx],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 },
            i + 0.5
          );

        tl.to(layersRight[i], { opacity: 0, y: -20, duration: 0.5 }, i)
          .fromTo(layersRight[nextIdx],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 },
            i + 0.5
          );

        tl.to(dots[i], { height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.3)', duration: 0.3 }, i)
          .to(dots[nextIdx], { height: '24px', backgroundColor: '#f2b544', duration: 0.3 }, i + 0.5);
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Efeito "Auvox pode projetar / prototipar / resolver..."
  useEffect(() => {
    const items = gsap.utils.toArray('.scroll-list li');

    /* Tema fixo em escuro. O painel "Config" do tweakpane (que mostrava o
       seletor Dark/Light no canto da tela) foi removido — era do template
       original e não faz parte do site. */
    const update = () => {
      document.documentElement.dataset.theme = 'dark';
    };

    const highlight = (item) =>
      gsap.to(item, {
        opacity: 1,
        filter: 'brightness(1.3) saturate(1.2)',
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

    const unhighlight = (item) =>
      gsap.to(item, {
        opacity: 0.15,
        filter: 'brightness(0.5) saturate(0.5)',
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

    const createdTriggers = items.map((item) =>
      ScrollTrigger.create({
        trigger: item,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => highlight(item),
        onEnterBack: () => highlight(item),
        onLeave: () => unhighlight(item),
        onLeaveBack: () => unhighlight(item),
      })
    );

    const prefixTimeline = gsap
      .timeline()
      .fromTo('.sticky-prefix', { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none' }, 0)
      .to('.sticky-prefix', { opacity: 1, duration: 0.84, ease: 'none' }, 0.08)
      .to('.sticky-prefix', { opacity: 0, duration: 0.08, ease: 'none' }, 0.92);

    const scrollTween = ScrollTrigger.create({
      trigger: '.scroll-list',
      start: 'top 50%',
      end: 'bottom 50%',
      animation: prefixTimeline,
      scrub: 2,
    });

    update();

    return () => {
      scrollTween.kill();
      createdTriggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  const itemsList = [
    'projetar.',
    'prototipar.',
    'resolver.',
    'construir.',
    'desenvolver.',
    'depurar.',
  ];

  return (
    <div className="slide-scroll-unificado" id="solucoes">
      {/* ── Slide 01–04 ── */}
      <main className="carrossel-nav" ref={mainRef}>
        <div className="scroll-indicator">
          <div className="dot active" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>

        <div className="ocean">
          <img src={logo3d} alt="" aria-hidden="true" className="ocean-logo" />
          <div className="ocean-text">AUVOX</div>
        </div>

        <div className="left-side">
          <div className="page-numbers">
            <div className="page-number -tens">0</div>
            <div className="page-number -ones-wrapper">
              <div className="page-number -ones">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero">
          <div className="layer active">
            <button className="button-top-right">Nossas Soluções</button>
            <h1 className="heading">TECNOLOGIA QUE <br/> TRANSFORMA IDEIAS </h1>
          </div>
          <div className="layer">
            <button className="button-top-right">Conheça a IA</button>
            <h1 className="heading">INOVAÇÃO EM <br /> CADA SOLUÇÃO</h1>
          </div>
          <div className="layer">
            <button className="button-top-right">Ver Arquiteturas</button>
            <h1 className="heading">DESENVOLVIMENTO   <br />DE ALTO NÍVEL</h1>
          </div>
          <div className="layer">
            <button className="button-top-right">Falar com Especialistas</button>
            <h1 className="heading">TECNOLOGIA  <br /> COM PROPÓSITO</h1>
          </div>
        </div>

        <div className="left-content">
          <div className="layer active">
            <div className="fact subtitle">Foco em</div>
            <div className="fact number" style={{'color': 'var(--primary-color)'}}>SOLUÇÕES</div>
            <div className="fact description">digitais para diferentes necessidades</div>
          </div>
          <div className="layer">
            <div className="fact subtitle">Nossa abordagem</div>
            <div className="fact number" style={{'color': 'var(--primary-color)'}}>INOVAÇÃO</div>
            <div className="fact description">aplicada ao desenvolvimento de soluções</div>
          </div>
          <div className="layer">
            <div className="fact subtitle">Foco em</div>
            <div className="fact number" style={{'color': 'var(--primary-color)'}}>TECNOLOGIA</div>
            <div className="fact description">do desenvolvimento ao resultado</div>
          </div>
          <div className="layer">
            <div className="fact subtitle">Nosso propósito</div>
            <div className="fact number" style={{'color': 'var(--primary-color)'}}>IMPACTO</div>
            <div className="fact description">tecnologia criada para fazer a diferença</div>
          </div>
        </div>

        <div className="right-content">
          <div className="layer active">
            <h2 className="heading">Tecnologia que gera novas possibilidades.</h2>
            <p className="paragraph">Criamos soluções digitais que combinam inovação, funcionalidade e tecnologia para transformar necessidades em oportunidades.</p>
          </div>
          <div className="layer">
            <h2 className="heading">Tecnologia pensada para evoluir.</h2>
            <p className="paragraph">Buscamos unir criatividade, conhecimento técnico e novas tecnologias para criar soluções eficientes, modernas e adaptáveis.</p>
          </div>
          <div className="layer">
            <h2 className="heading">Tecnologia, desempenho e evolução.</h2>
            <p className="paragraph">Desenvolvemos soluções digitais buscando equilíbrio entre desempenho, organização, escalabilidade e uma experiência de uso eficiente.</p>
          </div>
          <div className="layer">
            <h2 className="heading">Criamos tecnologia que faz sentido.</h2>
            <p className="paragraph">A Auvox transforma desafios em soluções digitais, buscando criar experiências úteis, acessíveis e capazes de gerar impacto.</p>
          </div>
        </div>
      </main>

      {/* ── "Auvox pode projetar / prototipar / ..." ── mesmo fundo acima */}
      <main className="scroll-main">
        <header className="scroll-header"></header>

        <div className="scroll-row">
          <div className="sticky-prefix">
            <span> Auvox pode</span>
          </div>

          <section className="scroll-content">
            <ul aria-hidden="true" className="scroll-list">
              {itemsList.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="scroll-footer-section"></section>
      </main>

      {/* ── Cards de soluções ──
          Renderizado DENTRO do mesmo wrapper .slide-scroll-unificado,
          então herda exatamente o mesmo fundo do slide e do efeito de
          texto acima: uma superfície só, sem emenda entre as partes. */}
      <Carrossel />
    </div>
  );
}
