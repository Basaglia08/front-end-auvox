// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/projeto.css';

import mockupCelulares from '../assets/mockup-celulares.png';



import banner1 from '../assets/banner1.png';
import celular from '../assets/celular.png';
import computer from '../assets/computer.png';
import equipeAuvox from '../assets/equipeAuvox.png';
import minhaImagem from '../assets/logo.png';
import baixeIntermedi from '../assets/propaganda.png';


gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   PARA ADICIONAR UM PROJETO NOVO
   Basta acrescentar um objeto neste array. O componente cuida do
   resto sozinho:
   - a posição na grade (esquerda / direita) alterna pela ordem do
     array, sem limite de quantidade;
   - o número (01, 02, 03...) é calculado pelo índice;
   - o projeto entra automaticamente na navegação do modal
     (anterior / próximo), que dá a volta ao chegar no fim.

   IMAGENS
   - capa      imagem usada exclusivamente no card da grade.
   - imagens   array com as imagens exibidas no carrossel do modal. Pode ter
               quantas quiser — as setas e os indicadores se
               ajustam à quantidade automaticamente. Com uma
               imagem só, os controles do carrossel nem aparecem.

               Cada item pode ser:
                 a) só o import        → mockupCelulares
                 b) objeto com alt     → { src: banner1, alt: '...' }

   Campos usados NA GRADE:
   - titulo     (obrigatório)
   - legenda    linha pequena embaixo do título
   - etiqueta   texto pequeno alinhado à direita
   - cor        cor do bloco atrás da foto no card
   - alt        texto alternativo padrão das imagens

   Campos usados NO MODAL (todos opcionais — o que faltar
   simplesmente não é renderizado):
   - destaque    frase curta de impacto, em destaque colorido
   - descricao   parágrafo explicando o projeto
   - disciplina  o que foi feito (ex.: 'Front-end · UI Design')
   - equipe      quem fez
   - ano         ano de entrega
   - link        endereço do projeto
   - textoBotao  rótulo do botão (padrão: 'Acessar o projeto')
   ═══════════════════════════════════════════════════════════════ */
const PROJETOS = [
  {
    id: 'intermedi',
    titulo: 'Intermedi',
    legenda: 'REDE DE FARMÁCIAS · PLATAFORMA WEB E MOBILE',
    etiqueta: 'PROJETO AUVOX',
    cor: '#f2b544',
    alt: 'Plataforma Intermedi',

    capa: { src: mockupCelulares, alt: 'Aplicativo Intermedi em telas de celular' },

    // imagens exibidas somente dentro do modal
    imagens: [
      { src: baixeIntermedi, alt: 'Tela de login do aplicativo' },
    ],

    destaque: 'Uma rede de farmácias inteira operando na palma da mão.',
    descricao:
      'Plataforma completa para gestão da rede: painel administrativo, controle de chamados e integração entre farmácias, com um aplicativo pensado para o dia a dia de quem está no balcão.',
    disciplina: 'Produto digital · Front-end · UI Design',
    equipe: 'Time Auvox',
    ano: '2026',
    link: '#contato',
    textoBotao: 'Ver o projeto completo',
  },
];

/* Aceita `imagens: [...]` (novo) e também o antigo `imagem: x`, e
   normaliza cada item para { src, alt } — assim tanto faz passar só o
   import ou um objeto com alt. */
function galeriaDe(projeto) {
  const bruta = Array.isArray(projeto.imagens) && projeto.imagens.length
    ? projeto.imagens
    : projeto.imagem
      ? [projeto.imagem]
      : [];

  return bruta
    .map((item) =>
      typeof item === 'string'
        ? { src: item, alt: projeto.alt || projeto.titulo }
        : { src: item?.src, alt: item?.alt || projeto.alt || projeto.titulo }
    )
    .filter((item) => item.src);
}

export default function ProjetoAuvox() {
  const secaoRef = useRef(null);
  const modalRef = useRef(null);
  const total = PROJETOS.length;

  /* Índice do projeto aberto no modal. null = modal fechado. */
  const [aberto, setAberto] = useState(null);
  /* Índice da imagem exibida no carrossel do projeto aberto. */
  const [foto, setFoto] = useState(0);

  const ativo = aberto === null ? null : PROJETOS[aberto];
  const galeria = ativo ? galeriaDe(ativo) : [];
  const temGaleria = galeria.length > 1;

  const abrir = useCallback((i) => {
    setAberto(i);
    setFoto(0);
  }, []);

  const fechar = useCallback(() => setAberto(null), []);

  /* Trocar de projeto sempre volta o carrossel para a primeira imagem. */
  const proximo = useCallback(() => {
    setAberto((i) => (i === null ? null : (i + 1) % total));
    setFoto(0);
  }, [total]);

  const anterior = useCallback(() => {
    setAberto((i) => (i === null ? null : (i - 1 + total) % total));
    setFoto(0);
  }, [total]);

  /* Navegação do carrossel: dá a volta nas pontas, igual à dos projetos. */
  const proximaFoto = useCallback(() => {
    setFoto((f) => (galeria.length ? (f + 1) % galeria.length : 0));
  }, [galeria.length]);

  const fotoAnterior = useCallback(() => {
    setFoto((f) => (galeria.length ? (f - 1 + galeria.length) % galeria.length : 0));
  }, [galeria.length]);

  /* Teclado + trava do scroll da página enquanto o modal estiver aberto.
     ← →  imagens do projeto (ou projetos, se só houver uma imagem)
     ↑ ↓  projeto anterior / próximo
     Esc  fecha                                                        */
  useEffect(() => {
    if (aberto === null) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        fechar();
      } else if (e.key === 'ArrowRight') {
        temGaleria ? proximaFoto() : proximo();
      } else if (e.key === 'ArrowLeft') {
        temGaleria ? fotoAnterior() : anterior();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        proximo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        anterior();
      }
    };

    /* O Lenis (scroll suave, criado no App) escuta wheel/touch no window.
       Como os eventos sobem do alvo até o window, parar a propagação aqui
       no modal faz o Lenis nunca recebê-los — e aí a coluna de informações
       rola nativamente, em vez de rolar a página atrás. (O atributo
       data-lenis-prevent no JSX cobre o mesmo caso nas versões do Lenis que
       o suportam; os dois juntos garantem o comportamento.) */
    const segurarScroll = (e) => e.stopPropagation();
    const modal = modalRef.current;

    if (modal) {
      modal.addEventListener('wheel', segurarScroll, { passive: false });
      modal.addEventListener('touchmove', segurarScroll, { passive: false });
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      if (modal) {
        modal.removeEventListener('wheel', segurarScroll);
        modal.removeEventListener('touchmove', segurarScroll);
      }
      document.body.style.overflow = overflowAnterior;
    };
  }, [
    aberto,
    temGaleria,
    fechar,
    proximo,
    anterior,
    proximaFoto,
    fotoAnterior,
  ]);

  useEffect(() => {
    const raiz = secaoRef.current;
    if (!raiz) return undefined;

    let ctx;

    /* try/catch por segurança: este componente vive dentro do <Suspense>
       do App. Um erro solto aqui derrubaria a árvore inteira e faria os
       outros componentes sumirem junto. */
    try {
      ctx = gsap.context(() => {
        /* ── CABEÇALHO ──
           Efeito simples: aparece subindo quando o scroll desce e some
           quando sobe. `scrub` amarra o progresso à posição da página,
           então o caminho de volta é automático. */
        const cabecalho = raiz.querySelector('.projeto-cabecalho');

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

        /* ── PROJETOS ──
           Mesma ideia: cada item tem seu próprio percurso de scroll com
           scrub, então aparece ao descer e se desfaz ao subir. */
        const itens = Array.from(raiz.querySelectorAll('.projeto-item'));

        itens.forEach((item) => {
          const moldura = item.querySelector('.projeto-moldura');
          const foto = item.querySelector('.projeto-foto');
          const bloco = item.querySelector('.projeto-bloco');
          const meta = item.querySelector('.projeto-rodape');
          const linhas = Array.from(
            item.querySelectorAll('.projeto-rodape > *')
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              end: 'top 45%',
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });

          // a moldura sobe e ganha corpo
          if (moldura) {
            tl.fromTo(
              moldura,
              { opacity: 0, y: 75 },
              { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
              0
            );
          }

          /* zoom-out da foto. Fica no WRAPPER .projeto-foto de propósito:
             o zoom do hover mora no <img>, e se as duas animações
             disputassem o mesmo transform, o hover pararia de funcionar. */
          if (foto) {
            tl.fromTo(
              foto,
              { scale: 1.08 },
              { scale: 1, duration: 1.1, ease: 'power2.out' },
              0
            );
          }

          // número, título e etiqueta entram em cascata
          if (linhas.length) {
            tl.fromTo(
              linhas,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.08,
              },
              0.3
            );
          } else if (meta) {
            tl.fromTo(
              meta,
              { opacity: 0, y: 26 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
              0.3
            );
          }

          /* Deslocamento sutil do bloco colorido ao longo de todo o
             percurso da seção pela tela. */
          if (bloco) {
            gsap.fromTo(
              bloco,
              { x: 8, y: 8 },
              {
                x: 18,
                y: 18,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }
        });

        ScrollTrigger.refresh();
      }, secaoRef);
    } catch (erro) {
      console.warn('[ProjetoAuvox] animação desativada:', erro);
    }

    const onLoad = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* ignora */
      }
    };
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      try {
        if (ctx) ctx.revert();
      } catch {
        /* ignora */
      }
    };
  }, []);

  const externo = ativo?.link && !ativo.link.startsWith('#');

  return (
    <>
      <section className="projeto-secao" id="projeto" ref={secaoRef}>
        {/* Cabeçalho no formato padrão do site (mesmas classes da Equipe) */}
        <header className="projeto-cabecalho secao-topo">
          <p className="secao-slug">
            <span className="projeto-barras">//</span> Nossos projetos
          </p>

          <h2 className="secao-titulo" style={{color: '#fff'}}>
            O que a Auvox já <span>COLOCOU NO AR</span>
          </h2>

          <div className="secao-sep" />
        </header>

        {/* A alternância esquerda/direita é feita no CSS por :nth-child,
            então o array pode crescer à vontade. */}
        <div className="projeto-grade">
          {PROJETOS.map((projeto, i) => {
            const numero = String(i + 1).padStart(2, '0');
            const capa = projeto.capa || galeriaDe(projeto)[0];

            return (
              <article className="projeto-item" key={projeto.id || projeto.titulo}>
                {/* O card é um botão: o clique abre o modal. */}
                <button
                  type="button"
                  className="projeto-card"
                  onClick={() => abrir(i)}
                  aria-haspopup="dialog"
                >
                  <div className="projeto-moldura">
                    <span
                      className="projeto-bloco"
                      style={{ '--cor-projeto': projeto.cor || '#f2b544' }}
                      aria-hidden="true"
                    />

                    <div className="projeto-foto">
                      {capa && (
                        <img src={capa.src} alt={capa.alt} loading="lazy" />
                      )}
                    </div>

                    <span className="projeto-marcador" aria-hidden="true">
                      +
                    </span>
                  </div>

                  <div className="projeto-rodape">
                    <span className="projeto-numero">{numero}</span>

                    <div className="projeto-info">
                      <h3 className="projeto-nome">{projeto.titulo}</h3>
                      {projeto.legenda && (
                        <p className="projeto-legenda">{projeto.legenda}</p>
                      )}
                    </div>

                    {projeto.etiqueta && (
                      <span className="projeto-etiqueta">{projeto.etiqueta}</span>
                    )}
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── MODAL ──
          Renderizado com createPortal direto no <body>. Isso é
          necessário: a seção #projeto recebe `transform` da animação
          .revelar-secao (app.css) e tem overflow: hidden, e qualquer
          um dos dois faria um position: fixed aqui dentro se prender à
          seção em vez da tela. */}
      {ativo &&
        createPortal(
          <div
            className="projeto-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Projeto ${ativo.titulo}`}
          >
            {/* clique no fundo fecha */}
            <div className="projeto-modal-fundo" onClick={fechar} aria-hidden="true" />

            <header className="projeto-modal-topo">
              <span className="projeto-modal-marca">AUVOX / SALA DE PROJETOS</span>
              <span className="projeto-modal-contador">
                {String(aberto + 1).padStart(2, '0')} DE {String(total).padStart(2, '0')}
              </span>
              <button type="button" className="projeto-modal-fechar" onClick={fechar}>
                FECHAR <span aria-hidden="true">✕</span>
              </button>
            </header>

            <div className="projeto-modal-painel">
              {/* ── Carrossel de imagens ──
                  O trilho desliza -100% por imagem. Os controles só
                  aparecem quando o projeto tem mais de uma. */}
              <figure className="projeto-modal-galeria">
                <div
                  className="projeto-galeria-trilho"
                  style={{ transform: `translateX(-${foto * 100}%)` }}
                >
                  {galeria.map((img, i) => (
                    <div className="projeto-galeria-slide" key={`${ativo.id}-${i}`}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>

                {temGaleria && (
                  <>
                    <button
                      type="button"
                      className="projeto-galeria-btn -esquerda"
                      onClick={fotoAnterior}
                      aria-label="Imagem anterior"
                    >
                      <span aria-hidden="true">‹</span>
                    </button>

                    <button
                      type="button"
                      className="projeto-galeria-btn -direita"
                      onClick={proximaFoto}
                      aria-label="Próxima imagem"
                    >
                      <span aria-hidden="true">›</span>
                    </button>

                    <div className="projeto-galeria-rodape">
                      <span className="projeto-galeria-contador">
                        {String(foto + 1).padStart(2, '0')} /{' '}
                        {String(galeria.length).padStart(2, '0')}
                      </span>

                      <div className="projeto-galeria-pontos">
                        {galeria.map((img, i) => (
                          <button
                            key={`ponto-${ativo.id}-${i}`}
                            type="button"
                            className={`projeto-galeria-ponto${i === foto ? ' ativo' : ''}`}
                            onClick={() => setFoto(i)}
                            aria-label={`Ver imagem ${i + 1}`}
                            aria-current={i === foto}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </figure>

              {/* a key troca a cada projeto: o React remonta a coluna e a
                  animação de entrada roda de novo a cada navegação */}
              <aside
                className="projeto-modal-info"
                data-lenis-prevent
                key={ativo.id || aberto}
              >
                <div className="projeto-modal-tags">
                  {ativo.etiqueta && <span>{ativo.etiqueta}</span>}
                  {ativo.legenda && <span>{ativo.legenda}</span>}
                </div>

                <h3 className="projeto-modal-nome">{ativo.titulo}</h3>

                {ativo.destaque && (
                  <p
                    className="projeto-modal-destaque"
                    style={{ '--cor-projeto': ativo.cor || '#f2b544' }}
                  >
                    {ativo.destaque}
                  </p>
                )}

                {ativo.descricao && (
                  <p className="projeto-modal-descricao">{ativo.descricao}</p>
                )}

                <dl className="projeto-modal-ficha">
                  {ativo.disciplina && (
                    <div>
                      <dt>DISCIPLINA</dt>
                      <dd>{ativo.disciplina}</dd>
                    </div>
                  )}
                  {ativo.equipe && (
                    <div>
                      <dt>QUEM FEZ</dt>
                      <dd>{ativo.equipe}</dd>
                    </div>
                  )}
                  {ativo.ano && (
                    <div>
                      <dt>ANO</dt>
                      <dd>{ativo.ano}</dd>
                    </div>
                  )}
                </dl>

                {ativo.link && (
                  <a
                    className="projeto-modal-botao"
                    href={ativo.link}
                    onClick={externo ? undefined : fechar}
                    {...(externo
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {ativo.textoBotao || 'Acessar o projeto'}
                  </a>
                )}
              </aside>
            </div>

            <footer className="projeto-modal-rodape">
              {total > 1 ? (
                <button type="button" className="projeto-modal-nav" onClick={anterior}>
                  <span aria-hidden="true">←</span> PROJETO ANTERIOR
                </button>
              ) : (
                <span />
              )}

              <span className="projeto-modal-dica">
                {temGaleria ? '← → IMAGENS · ESC FECHAR' : 'ESC FECHAR'}
              </span>

              {total > 1 ? (
                <button type="button" className="projeto-modal-nav" onClick={proximo}>
                  PRÓXIMO PROJETO <span aria-hidden="true">→</span>
                </button>
              ) : (
                <span />
              )}
            </footer>
          </div>,
          document.body
        )}
    </>
  );
}
