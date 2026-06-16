import React from "react";
import "../styles/baixe.css";

import mockupCelulares from "../assets/mockup-celulares.png"; 
import logoPlayStory from "../assets/badge-playstore.png"; 
import logoAppStore from "../assets/badge-appstore.png";
import iconeLupa from "../assets/lupa.png";
import iconeConexao from "../assets/conexao.png";
import iconeSus from "../assets/sus.png";
import logoTextoVerde from "../assets/logo-baixe.png"; // Caminho da logo corrigido

function Baixe() {
  return (
    <section className="secaoBaixeApp" >
      <div className="baixeAppWrapper">
        
        {/* Bloco de Conteúdo (Fica na Direita por causa do Flex CSS) */}
        <div className="baixeAppEsquerda">
          
          {/* Logo principal adicionada acima do título */}
          <img src={logoTextoVerde} loading="lazy" alt="Intermedi" className="appLogoPrincipal" />
          
          <h2 className="secaoTitulo">
            Sua saúde, <br />
            <div className="destaque"> na palma da sua mão.</div>
          </h2>
          
          <p className="baixeAppSubtitulo">
            Conectando farmácias e pacientes em tempo real para trazer muito mais eficiência, economia e acesso à saúde.
          </p>

          {/* Grid de Diferenciais com ícones grandes */}
          <div className="appRecursosGrid">
            <div className="recursoItem">
              <div className="recursoIconeWrap">
                <img src={iconeLupa} alt="Buscar" className="appIconeImg" />
              </div>
              <p>Encontre farmácias próximas com o remédio disponível</p>
            </div>
            
            <div className="recursoItem">
              <div className="recursoIconeWrap">
                <img src={iconeConexao} alt="Redistribuição" className="appIconeImg" />
              </div>
              <p>Medicamentos redistribuídos em tempo real</p>
            </div>
            
            <div className="recursoItem">
              <div className="recursoIconeWrap">
                <img src={iconeSus} alt="Acesso SUS" className="appIconeImg" />
              </div>
              <p>Mais acesso para postos e pacientes que precisam</p>
            </div>
          </div>

          {/* Botões Lojas Grandes */}
          <div className="lojasBotoes">
            <a href="#appstore" className="btnLoja" target="_blank" rel="noreferrer">
              <img src={logoAppStore} alt="App Store" />
            </a>
            <a href="#googleplay" className="btnLoja" target="_blank" rel="noreferrer">
              <img src={logoPlayStory} alt="Google Play" />
            </a>
          </div>
        </div>

        {/* Bloco Visual (Fica na Esquerda por causa do Flex CSS) */}
        <div className="baixeAppDireita">
          <div className="cruzVerdeFundo"></div>
          <img 
            src={mockupCelulares} loading="lazy" 
            alt="Mockups do Aplicativo Intermedi" 
            className="imgMockupCelulares" 
          />
        </div>

      </div>
    </section>
  );
}

export default Baixe;