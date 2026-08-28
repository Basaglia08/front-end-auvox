// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/carrossel.css';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: 1,
    subtitle: 'DESENVOLVIMENTO',
    title: 'Desenvolvimento de Sistemas',
    text: 'Sistemas web e mobile sob medida, do protótipo ao deploy, com arquitetura escalável e código sustentável para crescer junto com a sua operação.',
    image:
      'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    subtitle: 'AUTOMAÇÃO',
    title: 'Automação de Processos',
    text: 'Integrações e fluxos automatizados que eliminam tarefas repetitivas, reduzem erros manuais e liberam o time para o que realmente gera valor.',
    image:
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    subtitle: 'PRODUTO DIGITAL',
    title: 'Soluções Digitais',
    text: 'Da descoberta ao produto no ar: UX, design system e front-end de alta performance para entregar uma experiência consistente em qualquer tela.',
    image:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
];

// Quanto cada card "flutua" no parallax. O do meio se move mais, o que dá
// o desenho de arco/onda na fileira conforme a página rola.
const PARALLAX = [46, 84, 46];

/* Este componente NÃO tem fundo próprio: ele é renderizado dentro do
   wrapper .slide-scroll-unificado (CarrosselNav), que já fornece a textura
   escura do slide e do efeito "Auvox pode ...". Como é a mesma superfície
   contínua, não existe divisão/emenda entre uma parte e outra. */
export default function Carrossel() {
  const sectionRef = useRef(null);
  // Card com a "caixinha" travada aberta pelo clique (o hover abre pelo CSS)
  const [aberto, setAberto] = useState(null);

  useEffect(() => {
    const raiz = sectionRef.current;
    if (!raiz) return undefined;

    const cards = Array.from(raiz.querySelectorAll('.carrossel-card'));
    const wraps = Array.from(raiz.querySelectorAll('.carrossel-card-wrap'));
    if (!cards.length) return undefined;

    let ctx;

    /* IMPORTANTE: tudo aqui roda dentro de try/catch.
       Este componente é renderizado dentro do <Suspense> do App, junto com
       Baixe, Sobre, Equipe, Contato e Footer. Se qualquer coisa estourar um
       erro dentro deste useEffect, o React derruba a árvore inteira e TODOS
       esses componentes somem da tela de uma vez. Com o try/catch, o pior
       cenário passa a ser "os cards ficam parados, sem animação" — o resto
       do site continua de pé. */
    try {
      ctx = gsap.context(() => {
        /* Cada card é revelado em 3 camadas que se sobrepõem — é isso que
           tira o "seco" de um fade simples:
           1. a moldura sobe, desgira e ganha escala;
           2. a foto é descoberta de baixo para cima (clip-path) enquanto
              desamplia de 1.35 para 1, como uma cortina abrindo;
           3. o texto sobe depois, já com a foto no lugar.               */
        const revelar = (tl, card, i, posicao) => {
          const media = card.querySelector('.carrossel-card-media');
          const conteudo = card.querySelector('.carrossel-card-conteudo');

          tl.fromTo(
            card,
            { opacity: 0, y: 100, scale: 0.88, rotation: (i - 1) * 3, transformOrigin: '50% 100%' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 1,
              ease: 'power3.out',
              immediateRender: true,
            },
            posicao
          );

          if (media) {
            tl.fromTo(
              media,
              { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.35 },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                scale: 1,
                duration: 1.15,
                ease: 'power2.out',
                immediateRender: true,
              },
              posicao
            );
          }

          if (conteudo) {
            tl.fromTo(
              conteudo,
              { opacity: 0, y: 38 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: true },
              posicao + 0.45
            );
          }
        };

        /* Breakpoint com window.matchMedia (API nativa do navegador) em vez
           de gsap.matchMedia — que só existe a partir do GSAP 3.11 e, em
           versão mais antiga, estoura "is not a function" e leva o resto
           dos componentes junto. */
        const desktop =
          typeof window.matchMedia === 'function'
            ? window.matchMedia('(min-width: 901px)').matches
            : window.innerWidth > 900;

        if (desktop) {
          /* (A) REVELAÇÃO — gatilho na própria fileira (.carrossel-grid),
             de 'top 90%' a 'top 30%', com `scrub`: o progresso é amarrado
             ao scroll, então acontece exatamente enquanto os cards
             atravessam a tela e volta ao subir. O delay de 0.4 entre um
             card e outro faz a entrada em cascata: 1º, 2º, 3º. */
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: raiz.querySelector('.carrossel-grid'),
              start: 'top 90%',
              end: 'top 30%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          cards.forEach((card, i) => revelar(tl, card, i, i * 0.4));
          tl.to({}, { duration: 0.3 }); // respiro no fim do percurso

          /* (B) PARALLAX — enquanto a seção inteira passa pela tela, cada
             card flutua em velocidade diferente. É o que dá profundidade e
             mantém o bloco "vivo" durante todo o scroll. */
          wraps.forEach((wrap, i) => {
            const d = PARALLAX[i % PARALLAX.length];
            gsap.fromTo(
              wrap,
              { y: d },
              {
                y: -d,
                ease: 'none',
                scrollTrigger: {
                  trigger: raiz,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          });
        } else {
          /* Mobile: cards empilhados, sem parallax. Cada um tem o próprio
             gatilho e faz a mesma revelação em camadas ao entrar na tela. */
          cards.forEach((card, i) => {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: card, start: 'top 85%' },
            });
            revelar(tl, card, i, 0);
          });
        }

        // O componente entra por lazy load: recalcula as posições depois
        ScrollTrigger.refresh();
      }, sectionRef);
    } catch (erro) {
      // Falhou? Mostra os cards estáticos e segue o baile.
      console.warn('[Carrossel] animação desativada:', erro);
      try {
        gsap.set(cards, { clearProps: 'all' });
        gsap.set(wraps, { clearProps: 'all' });
      } catch (_) {
        /* ignora */
      }
    }

    // As imagens são remotas: quando terminam de carregar, a altura muda,
    // então recalculamos os pontos de start/end.
    const onLoad = () => {
      try {
        ScrollTrigger.refresh();
      } catch (_) {
        /* ignora */
      }
    };
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      try {
        if (ctx) ctx.revert();
      } catch (_) {
        /* ignora */
      }
    };
  }, []);

  const alternar = (index) => setAberto((atual) => (atual === index ? null : index));

  return (
    <section className="carrossel-secao" ref={sectionRef}>
      <div className="carrossel-inner">
        <div className="carrossel-grid">
          {CARDS.map((card, index) => (
            // .carrossel-card-wrap existe só para o parallax: o GSAP mexe
            // no wrapper e no card separadamente, sem um atropelar o outro.
            <div className="carrossel-card-wrap" key={card.id}>
              <article
                className={`carrossel-card ${aberto === index ? 'aberto' : ''}`}
                onClick={() => alternar(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    alternar(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={aberto === index}
              >
                {/* .carrossel-card-media leva o clip-path e a escala da
                    revelação; o <img> fica livre para o zoom do hover. */}
                <div className="carrossel-card-media">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="carrossel-card-imagem"
                    loading="lazy"
                  />
                </div>
                <div className="carrossel-card-overlay" />

                <div className="carrossel-card-conteudo">
                  <span className="carrossel-card-subtitulo">{card.subtitle}</span>
                  <h3 className="carrossel-card-titulo">{card.title}</h3>

                  {/* A "caixinha" que abre no hover / clique */}
                  <div className="carrossel-caixa">
                    <div className="carrossel-caixa-clip">
                      <div className="carrossel-caixa-box">
                        <p className="carrossel-caixa-texto">{card.text}</p>
                        <span className="carrossel-caixa-link">Saiba mais →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}