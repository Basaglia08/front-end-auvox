import React from "react";
import '../styles/sobre.css';
import equipeImg from '../assets/equipeAuvox.png';

function Sobre() {
    return (
        <section className="sobre" id="sobre">
            <div className="sobre-container">
                
                {/* Hero Section */}
                <div className="sobre-hero">
                    <div className="sobre-hero-content">
                        <h1 className="sobre-title">Sobre a <span>Auvox</span></h1>
                        
                        <p className="sobre-description">
             A Auvox é uma software house focada em transformar grandes ideias em produtos 
      digitais de alto impacto. Nós desenvolvemos aplicativos móveis, plataformas web 
      e sistemas personalizados para os mais diversos setores do mercado, ajudando empresas 
      a automatizarem processos e escalarem seus negócios.
                        </p>
                    </div>
                    <img src={equipeImg} loading="lazy" alt="Equipe Auvox" className="sobre-hero-img" />
                </div>

                {/* Informações Principais */}
                <div className="sobre-info">
                    <div className="info-box">
                        <h2>Quem Somos</h2>
                        <p>
                            Somos uma equipe de desenvolvedores focada em tecnologia, inovação e design funcional. Criamos soluções digitais completas, transformando ideias complexas em aplicativos e plataformas intuitivas que otimizam processos e geram valor real para negócios de qualquer segmento.
                        </p>
                    </div>

                    <div className="info-box">
                        <h2>Nossa Jornada</h2>
                        <p>
                            Como alunos da <strong>ETEC de Guaianazes</strong>, cursando <strong>Desenvolvimento de Sistemas II</strong>, encontramos na criação da Auvox a oportunidade de aplicar nosso conhecimento técnico em cenários reais. Unimos teoria e prática para projetar softwares modernos, escaláveis e eficientes para o mercado geral.
                        </p>
                    </div>
                </div>

                {/* Missão e Visão */}
                <div className="missao-visao">
                    <div className="mv-card">
                        <h3>Missão</h3>
                        <p>
                            Desenvolver softwares, sistemas e aplicativos robustos que resolvam problemas cotidianos de empresas e usuários, democratizando o acesso à tecnologia de ponta através de interfaces seguras, limpas e inteligentes.
                        </p>
                    </div>
                    <div className="mv-card">
                        <h3>Visão</h3>
                        <p>
                            Consolidar a Auvox como uma fábrica de software de referência em inovação e qualidade técnica entre projetos acadêmicos, expandindo nosso portfólio por diversos setores do mercado de tecnologia.
                        </p>
                    </div>
                </div>
                
            </div>
        </section>
    );
}

export default Sobre;