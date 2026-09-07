import "../styles/footer.css";
import logoImg from "../assets/logo-auvox.webp";
import logoRazorbyte from "../assets/razorbyte-logo.webp";
import logoSkillDev from "../assets/skilldev-logo.webp";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-wave-divider" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 280" preserveAspectRatio="none" focusable="false">
          <path fill="#142740" d="M0,160 Q180,260 380,130 T800,160 T1200,120 T1440,140 L1440,280 L0,280 Z" />
        </svg>
      </div>

      <div className="footer-content">

        {/* Coluna 1: Logo, Slogan e Redes Sociais */}
        <div className="footer-brand-column">
          <div className="footer-logo">
            <img src={logoImg} alt="Logo Auvox" className="footer-logo-img" width="200" height="auto" />
          </div>
          <p className="footer-slogan">Onde a inovação tem valor de ouro</p>
          <div className="footer-socials">
            <a href="#instagram" aria-label="Instagram"><i className="bx bxl-instagram"></i></a>
            <a href="#facebook"  aria-label="Facebook"><i className="bx bxl-facebook-circle"></i></a>
            <a href="#github"    aria-label="GitHub"><i className="bx bxl-github"></i></a>
          </div>

          <div className="footer-partners">
            <p className="footer-partners-title">Parceiros oficiais</p>
            <div className="footer-partner-logos">
              <div className="partner-logo-card">
                <img src={logoRazorbyte} alt="Razorbyte" className="partner-logo-img" />
              </div>
              <div className="partner-logo-card">
                <img src={logoSkillDev} alt="Skill Dev" className="partner-logo-img" />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Links */}
        <div className="footer-links-column">
          <h3>Links</h3>
          <ul>
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#solucoes">Serviços</a></li>
            <li><a href="#equipe">Equipe</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>

        {/* Coluna 3: Contato */}
        <div className="footer-contact-column">
          <h3>Contato</h3>
          <p className="contact-email">company.auvox@gmail.com</p>
          <p className="contact-phone">(11) 1234-5678</p>
          <p className="contact-address">Av. Paulista, 1000 — São Paulo, SP</p>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="copyright">© 2026 AUVOX. Todos os direitos reservados.</p>
          <div className="footer-legal-links">
            <a href="#privacidade">Política de Privacidade</a>
            <a href="#termos">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
