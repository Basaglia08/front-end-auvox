import React from "react";
import "../styles/home.css";

function Home() {
  const icone = "<"
  const icone2 = "/>"
  return (
    <>
      <section id="inicio" style={{ paddingTop: '120px' }}>
        {/* Animação das ondas no fundo */}
        <div className="wave">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Bloco de Conteúdo */}
        <div className="content">
          <h2>
            <span className="title-slashes">{icone}{icone2}</span>
            <div className="title-text">
              Onde a inovação<br /> tem valor de <span>OURO </span>
            </div>
          </h2>
          
          <div className="container-btn">
            <button className="button">
              <span className="button-content">Conheça nossas soluções</span>
            </button>
          </div>

        </div>
      </section>
    </>
  );
}

export default Home;