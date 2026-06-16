import { useState, useEffect, useCallback } from "react";
import "../styles/navBar.css";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { href: "#inicio",   label: "Início" },
  { href: "#solucoes", label: "Soluções" },
  { href: "#projeto",  label: "Projeto", chevron: true },
  { href: "#sobre",    label: "Sobre" },
  { href: "#equipe",   label: "Equipe" },
  { href: "#contato",  label: "Contato" },
];

function NavBar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  /* Fecha menu ao redimensionar para desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) fecharMenu(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fecharMenu]);

  /* Trava scroll do body quando menu mobile está aberto */
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuAberto]);

  return (
    <nav className="navbar">
      {/* Logo */}
      <a href="#inicio" className="nav-logo" onClick={fecharMenu}>
        <img src={logo} alt="Auvox Logo" width="60" height="60" />
      </a>

      {/* Links — desktop */}
      <ul className="nav-links">
        {NAV_LINKS.map(({ href, label, chevron }) => (
          <li key={href}>
            <a href={href} className="nav-item">
              {label}
              {chevron && (
                <svg className="chevron-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* Botão hamburguer — mobile */}
      <button
        className={`nav-hamburguer${menuAberto ? " aberto" : ""}`}
        onClick={() => setMenuAberto((v) => !v)}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuAberto}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay + Menu mobile */}
      {menuAberto && (
        <div className="nav-overlay" onClick={fecharMenu} aria-hidden="true" />
      )}

      <ul className={`nav-mobile${menuAberto ? " visivel" : ""}`}>
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className="nav-mobile-item" onClick={fecharMenu}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
