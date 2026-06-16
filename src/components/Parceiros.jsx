import React from "react";
import "../styles/parceiros.css"; 

// Importações com os nomes exatos que estão na sua pasta assets
import logoRazorbyte from "../assets/razorbyte-logo.png";
import logoSkillDev from "../assets/skilldev-logo.png";

function Parceiros() {
  return (
    <section className="secaoParceiros">
      
      {/* Topo padronizado com o estilo do Equipe.jsx */}
      <div className="parceirosTopo">
        
      <h2 className="parceirosTitulo">Nossos <strong>PARCEIROS</strong> estratégicos</h2>
      </div>

      {/* Container das Marcas em Tamanho Ampliado */}
      <div className="parceirosLogosWrap">
        <div className="cardParceiroLogo">
          <img 
            src={logoRazorbyte} loading="lazy" 
            alt="Logo Razorbyte" 
            className="imgParceiroLogo" 
          />
        </div>

        <div className="cardParceiroLogo">
          <img 
            src={logoSkillDev} loading="lazy" 
            alt="Logo Skill Dev" 
            className="imgParceiroLogo" 
          />
        </div>
      </div>

    </section>
  );
}

export default Parceiros;