import "../styles/equipe.css";
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";

import ariella    from "../assets/ariella.png";
import ariellaC   from "../assets/ariellacolor.png";
import ana        from "../assets/ana.png";
import anaC       from "../assets/anacolor.png";
import beatriz    from "../assets/bia.png";
import beatrizC   from "../assets/biacolor.png";
import gabriel    from "../assets/gabriel.png";
import gabrielC   from "../assets/gabrielcolor.png";
import matheus    from "../assets/matheus.png";
import matheusC   from "../assets/matheuscolor.png";
import alexandreR from "../assets/alexandre-rafael.png";
import alexandreRC from "../assets/alex1color.png";
import alexandreS from "../assets/alexandre-santiago.png";
import alexandreSC from "../assets/alex2color.png";
import miguel     from "../assets/miguel.png";
import miguelC    from "../assets/miguelcolor.png";
import eduardo    from "../assets/eduardo.png";
import eduardoC   from "../assets/eduardocolor.png";
import fabricio   from "../assets/fabricio.png";
import fabricioC  from "../assets/fabascolor.png";

const membros = [
  { nome: "Ariella",      cargo: "Tester",             foto: ariella,    fotoColor: ariellaC,    linkedin: "https://www.linkedin.com/in/ariella-pacheco-280119243",    github: "https://github.com/AriellaPacheco",    instagram: "https://www.instagram.com/ariellagomesz/" },
  { nome: "Ana",          cargo: "Designer",           foto: ana,        fotoColor: anaC,        linkedin: "https://www.linkedin.com/in/ana-julia-moraes-338b8839b",   github: "https://github.com/AJMoraes-afk",      instagram: "https://www.instagram.com/an4_juli/" },
  { nome: "Bia",          cargo: "Front-End",          foto: beatriz,    fotoColor: beatrizC,    linkedin: "https://www.linkedin.com/in/beatriz-florencio-a48152395",  github: "https://github.com/biaaxwttp",         instagram: "https://www.instagram.com/biaaxwttp/" },
  { nome: "Gabriel",      cargo: "Full Stack",         foto: gabriel,    fotoColor: gabrielC,    linkedin: "#",                                                        github: "https://github.com/bielsanc",          instagram: "https://www.instagram.com/bielsanc/" },
  { nome: "Matheus",      cargo: "Analista",           foto: matheus,    fotoColor: matheusC,    linkedin: "https://www.linkedin.com/in/matheus-bier-b493a8378/",      github: "https://github.com/MatheusBier702",    instagram: "https://www.instagram.com/theus.702/" },
  { nome: "Alexandre R.", cargo: "Banco de Dados",     foto: alexandreR, fotoColor: alexandreRC, linkedin: "#",                                                        github: "https://github.com/alexandre019-art",  instagram: "https://www.instagram.com/ale.rafael_/" },
  { nome: "Alexandre S.", cargo: "Gerente de Projeto", foto: alexandreS, fotoColor: alexandreSC, linkedin: "",                                                         github: "https://github.com/a-s-coda/a-s-coda", instagram: "https://www.instagram.com/a.s.ofc/" },
  { nome: "Miguel",       cargo: "Full Stack",         foto: miguel,     fotoColor: miguelC,     linkedin: "https://www.linkedin.com/in/miguel-basaglia-batista/",     github: "https://github.com/Basaglia08",        instagram: "https://www.instagram.com/mglbasaglia/" },
  { nome: "Eduardo",      cargo: "Back-end",           foto: eduardo,    fotoColor: eduardoC,    linkedin: "https://www.linkedin.com/in/eduardo-viana-494831345/",     github: "https://github.com/SoloManViana",      instagram: "#" },
  { nome: "Fabricio",     cargo: "Back-End",           foto: fabricio,   fotoColor: fabricioC,   linkedin: "https://www.linkedin.com/in/fabricio-cruz-679b52408/",    github: "https://github.com/fabascoder",        instagram: "https://www.instagram.com/fabricio_aulves/" },
];

function Equipe() {
  return (
    <div id="equipe" className="equipeBloco">
      <div className="topoEquipe">
        <p className="firstP"><span className="barrasFirtsP">//</span> NOSSA EQUIPE</p>
        <h1 className="firstH1">
          Conheça os <span className="spanH1">ESPECIALISTAS</span><br />
          por trás da AUVOX
        </h1>
        <div className="topoSep" />
      </div>

      <div className="carouselWrapper">
        <div className="containerCards">
          {membros.map((membro) => (
            <div className="container" key={membro.nome}>
              <div className="card">
                <div className="cardInner">

                  <div className="slide slide1">
                    {/* Foto P&B — base */}
                    <img
                      className="imagIcon imagIcon--bw"
                      src={membro.foto}
                      alt={membro.nome}
                      loading="lazy"
                      width="200"
                      height="267"
                    />
                    {/* Foto colorida — aparece no hover */}
                    <img
                      className="imagIcon imagIcon--color"
                      src={membro.fotoColor}
                      alt={`${membro.nome} colorido`}
                      loading="lazy"
                      width="200"
                      height="267"
                      aria-hidden="true"
                    />
                    <span className="cargoEquipe">{membro.cargo}</span>
                  </div>

                  <div className="content">
                    <p className="nomeEquipe">{membro.nome}</p>
                    <div className="cardDivider" />
                    <div className="slide slide2">
                      <ul className="cardEquipe">
                        <li>
                          <a href={membro.linkedin || "#"} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${membro.nome}`}>
                            <FaLinkedinIn size={14} />
                          </a>
                        </li>
                        <li>
                          <a href={membro.github} target="_blank" rel="noreferrer" aria-label={`GitHub de ${membro.nome}`}>
                            <FaGithub size={14} />
                          </a>
                        </li>
                        <li>
                          <a href={membro.instagram} target="_blank" rel="noreferrer" aria-label={`Instagram de ${membro.nome}`}>
                            <FaInstagram size={14} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Equipe;