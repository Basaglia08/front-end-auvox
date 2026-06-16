import { lazy, Suspense, useEffect } from 'react';
import NavBar from './components/NavBar.jsx';
import './styles/app.css';

/* Componentes acima da dobra — carregam imediatamente */
import Home from './components/Home.jsx';

/* Componentes abaixo da dobra — carregam só quando necessário */
const Main     = lazy(() => import('./components/Main.jsx'));
const Projetos = lazy(() => import('./components/Projeto.jsx'));
const Baixe    = lazy(() => import('./components/Baixe.jsx'));
const Sobre    = lazy(() => import('./components/Sobre.jsx'));
const Equipe   = lazy(() => import('./components/Equipe.jsx'));
const Contato  = lazy(() => import('./components/Contato.jsx'));
const Footer   = lazy(() => import('./components/Footer.jsx'));

/* Fallback minimalista — mantém o layout sem travar */
const Skeleton = () => (
  <div style={{ minHeight: '60vh', background: 'transparent' }} aria-hidden="true" />
);

function App() {
  useEffect(() => {
    const secoes = document.querySelectorAll('#inicio, #solucoes, #sobre, #projeto, #equipe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add('secao-visivel');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    secoes.forEach((secao) => {
      secao.classList.add('revelar-secao');
      observer.observe(secao);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <NavBar />
      <Home />
      <Suspense fallback={<Skeleton />}>
        <Main />
        <Projetos />
        <Baixe />
        <Sobre />
        <Equipe />
        <Contato />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
