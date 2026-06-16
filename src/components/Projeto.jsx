import React, { useState, useEffect, useRef } from "react";
import "../styles/projeto.css";

// IMPORTANDO OS ÍCONES COMO COMPONENTES REACT
// 'bi' = Boxicons (para a seção de funcionalidades e checks)
import { BiPlusMedical, BiShuffle, BiBarChartAlt2, BiShieldQuarter, BiCheck } from "react-icons/bi";
// 'di' = Devicons e 'fa' = FontAwesome (para as tecnologias no CTA)
import { DiReact, DiNodejsSmall, DiMysql } from "react-icons/di";
import { FaFigma, FaCode } from "react-icons/fa";

import logoIntermediCruz from "../assets/logo-intermedi-cruz.png";
import logoIntermediTexto from "../assets/logo-intermedi2.png";
import logoIntermediI from "../assets/logo-intermedi-i.png";

function Projeto() {
  const [activeTab, setActiveTab] = useState(null); // null para nenhum começar ativado, se preferir
  const [visivel, setVisivel] = useState(false);
  const secaoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisivel(true); },
      { threshold: 0.15 }
    );
    if (secaoRef.current) observer.observe(secaoRef.current);
    return () => observer.disconnect();
  }, []);

  // Agora passamos o Componente do ícone direto no objeto
  const funcionalidades = [
    { Icone: BiPlusMedical, titulo: "Gestão Inteligente de Estoque", descricao: "Farmácias podem registrar medicamentos em excesso ou em falta, permitindo uma redistribuição rápida e eficiente entre unidades parceiras." },
    { Icone: BiShuffle, titulo: "Conexão Automatizada", descricao: "O sistema realiza o match automaticamente entre farmácias, facilitando negociações e agilizando a transferência dos medicamentos." },
    { Icone: BiBarChartAlt2, titulo: "Acompanhamento em Tempo Real", descricao: "Usuários e farmácias acompanham instantaneamente a disponibilidade dos remédios e recebem atualizações sobre novos estoques." },
    { Icone: BiShieldQuarter, titulo: "Segurança e Organização", descricao: "Todas as movimentações ficam registradas na plataforma, garantindo mais controle, transparência e confiabilidade nas operações." },
  ];

  const etapas = [
    { numero: "01", titulo: "Problema Identificado", texto: "Muitas farmácias sofrem com falta de medicamentos enquanto outras possuem estoque parado, causando desperdício e prejuízos." },
    { numero: "02", titulo: "Conexão Entre Farmácias", texto: "O Intermedi permite que farmácias abram chamados informando medicamentos em falta ou sobrando dentro da plataforma." },
    { numero: "03", titulo: "Match Inteligente", texto: "O sistema identifica automaticamente farmácias compatíveis e facilita a redistribuição rápida dos medicamentos." },
    { numero: "04", titulo: "Acompanhamento em Tempo Real", texto: "Usuários acompanham a disponibilidade dos remédios e recebem atualizações quando o medicamento desejado chega à farmácia." },
  ];

  return (
    <section className="secaoProjeto" ref={secaoRef} id='projeto'>

      {/* ── HERO ── */}
      <div className={`projetoHero ${visivel ? "fadeIn" : ""}`}>
        <div className="heroEsquerda">
          <span className="tagProjeto">// NOSSO PROJETO</span>
          <h1 className="heroTitulo">
            Transformando a cadeia<br />
            farmacêutica com <span className="destaque">tecnologia</span>
          </h1>
          <p className="heroSubtitulo">
            O <b>Intermedi</b> conecta farmácias de forma inteligente, reduzindo desperdícios e facilitando a redistribuição de medicamentos. Enquanto farmácias equilibram seus estoques, usuários acompanham em tempo real a disponibilidade dos remédios que precisam.
          </p>
          <div className="heroBotoes">
            <a href="#funcionalidades" className="btnPrimario">Ver funcionalidades</a>
            <a href="#processo" className="btnSecundario">Como criamos →</a>
          </div>
        </div>

        <div className="heroDireita">
          <div className="logoCard">
            <div className="logoGlow"></div>
            <img src={logoIntermediCruz} loading="lazy" alt="Logo Intermedi" className="logoHeroImg principal" />
            <div className="logoTag">Plataforma B2B</div>
            <div className="logoMetrica">
              <span className="metricaNum">+40%</span>
              <span className="metricaLabel">economia em compras</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SOBRE ── */}
      {/* ── SOBRE O INTERMEDI REAGRUPADO COM ACABAMENTO PREMIUM ── */}
<div className="sobreWrapper">
  
  {/* Esquerda: Conteúdo, Hierarquia e Bullets em Mini-Cards */}
  <div className="sobreTexto">
    <span className="tagSecao">// SOBRE O INTERMEDI</span>
    <h2 className="secaoTitulo">
      Uma solução pensada<br />
      para o <span className="destaque">mercado real</span>
    </h2>
    <p className="sobreDescricao">
      O setor farmacêutico independente enfrenta desafios sérios. O Intermedi nasceu para mudar esse cenário, centralizando negociações e automatizando processos de ponta a ponta.
    </p>
    
    {/* Bullets transformados em Mini-Cards Horizontais */}
    <div className="sobreMiniCards">
      <div className="miniCard">
        <div className="miniCardIcone">
          <BiCheck size="1.2rem" />
        </div>
        <div className="miniCardInfo">
          <h4>Redistribuição Inteligente</h4>
          <p>Farmácias com excesso de medicamentos ajudam unidades com falta em tempo real.</p>
        </div>
      </div>

      <div className="miniCard">
        <div className="miniCardIcone">
          <BiCheck size="1.2rem" />
        </div>
        <div className="miniCardInfo">
          <h4>Monitoramento em Tempo Real</h4>
          <p>Acompanhe a disponibilidade dos remédios e receba atualizações instantâneas.</p>
        </div>
      </div>

      <div className="miniCard">
        <div className="miniCardIcone">
          <BiCheck size="1.2rem" />
        </div>
        <div className="miniCardInfo">
          <h4>Menos Desperdício, Mais Eficiência</h4>
          <p>Reduza perdas de estoque e agilize o acesso aos medicamentos para todos.</p>
        </div>
      </div>
    </div>
  </div>

  {/* Direita: Interface "Viva" com Dashboard Visual e Métricas Dinâmicas */}
  <div className="sobreMockupContainer">
    {/* Glow sutil de fundo */}
    <div className="mockupGlowVerde"></div>
    
    {/* Card Principal simula um Dashboard Mockup Vivo */}
    <div className="dashboardMockup">
      <div className="mockupHeader">
        <div className="mockupDots"><span></span><span></span><span></span></div>
        <div className="mockupTitle">intermedi_analytics_v2.ms</div>
      </div>
      <div className="mockupBody">
        <img src={logoIntermediCruz} loading="lazy" alt="Logo Intermedi" className="mockupLogoCentral" />
        <div className="mockupLinhasCarregando">
          <span className="linhaLonga"></span>
          <span className="linhaCurta"></span>
        </div>
      </div>
    </div>

    {/* Pequenos Indicadores de Métricas Flutuantes */}
    <div className="metricaFlutuante m1">
      <div className="metricaBadge verde"></div>
      <div className="metricaTxt">
        <h5>+120 farmácias</h5>
        <p>conectadas na rede</p>
      </div>
    </div>

    <div className="metricaFlutuante m2">
      <div className="metricaBadge amarelo"></div>
      <div className="metricaTxt">
        <h5>98% uptime</h5>
        <p>disponibilidade da API</p>
      </div>
    </div>

    <div className="metricaFlutuante m3">
      <div className="metricaBadge azul"></div>
      <div className="metricaTxt">
        <h5>Real-time</h5>
        <p>negociação direta</p>
      </div>
    </div>
  </div>

</div>

      {/* ── FUNCIONALIDADES ── */}
      <div className="funcionalidadesWrapper" id="funcionalidades">
        <div className="funcTopo">
          <span className="tagSecao">// FUNCIONALIDADES</span>
          <h2 className="secaoTitulo">Tudo que sua farmácia precisa em <span className="destaque">um lugar</span></h2>
        </div>
        <div className="funcGrid">
          {funcionalidades.map((f, i) => {
            const IconeComponente = f.Icone;
            return (
              <div
                className={`funcCard ${activeTab === i ? "ativo" : ""}`}
                key={i}
                onClick={() => setActiveTab(i)}
              >
                <div className="funcIconeReact">
                  <IconeComponente size="2.5rem" color={activeTab === i ? "#f2b544" : "#7b8fa6"} />
                </div>
                <h3 className="funcTitulo">{f.titulo}</h3>
                <p className="funcDescricao">{f.descricao}</p>
                <div className="funcBarra"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PROCESSO ── */}
      <div className="processoWrapper" id="processo">
        <div className="processoTopo">
          <span className="tagSecao">// PROCESSO DE DESENVOLVIMENTO</span>
          <h2 className="secaoTitulo">Do problema à <span className="destaque">solução</span></h2>
        </div>
        <div className="processoEtapas">
          {etapas.map((e, i) => (
            <div className="etapa" key={i}>
              <div className="etapaNumero">{e.numero}</div>
              <div className="etapaConteudo">
                <h3 className="etapaTitulo">{e.titulo}</h3>
                <p className="etapaTexto">{e.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA FINAL (TECNOLOGIAS COLORIDAS) ── */}
      <div className="ctaFinal">
        <div className="ctaGlow"></div>
        <div className="ctaLogoWrap"><img src={logoIntermediTexto} loading="lazy" alt="Intermedi" className="ctaLogo" /></div>
        <h2 className="ctaTitulo">O futuro da distribuição<br />farmacêutica começa aqui!</h2>
        <p className="ctaSubtitulo">Desenvolvido por uma equipe apaixonada por tecnologia e impacto real.</p>
        
        <div className="ctaStack">
          <span className="stackTag"><DiReact size="1.4rem" color="#61DAFB" /> React</span>
          <span className="stackTag"><DiNodejsSmall size="1.4rem" color="#339933" /> Node.js</span>
          <span className="stackTag"><DiMysql size="1.4rem" color="#4479A1" /> MySQL</span>
          <span className="stackTag"><FaCode size="1.1rem" color="#007ACC" /> REST API</span>
          <span className="stackTag"><FaFigma size="1.1rem" color="#F24E1E" /> Figma</span>
        </div>
      </div>

    </section>
  );
}

export default Projeto;