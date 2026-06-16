import React from "react";
import "../styles/main.css";

function Main() {
  return (
    <>
     <main className="main-solucoes" id="solucoes">
        {/* Topo da seção: Título e Subtítulo */}
        <div className="containerMain">
          <p className="firstP">
            <span className="barrasFirtsP">//</span> NOSSAS SOLUÇÕES
          </p>
          <h1 className="firstH1">
            Tecnologia que <span className="spanH1">TRANSFORMA</span> seu negócio
          </h1>
        </div>

        {/* Grid de Cards unificado */}
        <div className="grid-cards-solucoes">
          
          {/* CARD 1 - DESENVOLVIMENTO DE SISTEMAS (Escuro / Dark) */}
          <section className="card-solucao card-dark">
            <div className="classImgSection">
              {/* Ícone de código em formato outline */}
              <i className='bx bx-code-alt icon-main-solucoes'></i>
            </div>
            
            {/* Bloco de conteúdo agrupado para travar o quadrado */}
            <div className="card-body-text">
              <p className="tituloSection">Desenvolvimento de Sistemas</p>
              <span className="spanLinha"></span> 
              <p className="descricaoSection">
                Desenvolvimento de sistemas é criar e manter softwares para atender necessidades específicas.
              </p>
              <ul className="ulSection">
                <li>Sites institucionais</li>
                <li>Aplicações web</li>
                <li>E-commerce</li>
              </ul>
            </div>
            
            <button className="buttonSection">Saiba mais</button>
          </section>

          {/* CARD 2 - AUTOMAÇÃO DE PROCESSOS (Claro / Light) */}
          <section className="card-solucao card-light">
            <div className="classImgSection">
              {/* Ícone de Chave Inglesa */}
              <i className='bx bx-wrench icon-main-solucoes'></i>
            </div>
            
            {/* Bloco de conteúdo agrupado para travar o quadrado */}
            <div className="card-body-text">
              <p className="tituloSection">Automação de Processos</p>
              <span className="spanLinha"></span> 
              <p className="descricaoSection">
                Automação de processos é usar tecnologia para executar tarefas automaticamente e reduzir trabalho manual.
              </p>
              <ul className="ulSection">
                <li>Fluxos automatizados</li>
                <li>Processos internos inteligentes</li>
                <li>Geração automática de relatórios</li>
              </ul>
            </div>
            
            <button className="buttonSection">Saiba mais</button>
          </section>

          {/* CARD 3 - SOLUÇÕES DIGITAIS (Claro / Light) */}
          <section className="card-solucao card-light">
            <div className="classImgSection">
              {/* Ícone de Nuvem */}
              <i className='bx bx-cloud icon-main-solucoes'></i>
            </div>
            
            {/* Bloco de conteúdo agrupado para travar o quadrado */}
            <div className="card-body-text">
              <p className="tituloSection">Soluções Digitais</p>
              <span className="spanLinha"></span> 
              <p className="descricaoSection">
                Soluções digital são tecnologias criadas para resolver problemas e melhorar processos.
              </p>
              <ul className="ulSection">
                <li>Desenvolvimento de sistemas</li>
                <li>Integrações de APIs</li>
                <li>Painéis administrativos</li>
              </ul>
            </div>
            
            <button className="buttonSection">Saiba mais</button>
          </section>

        </div>
      </main>
    </>
  );
}

export default Main;