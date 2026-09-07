import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import NavBar from "./components/NavBar.jsx";
import "./styles/app.css";

/* Componentes acima da dobra — carregam imediatamente */
import Home from "./components/Home.jsx";

/* Componentes abaixo da dobra — carregam só quando necessário */
const Sobre = lazy(() => import("./components/Sobre.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const CarrosselNav = lazy(() => import("./components/CarrosselNav.jsx"));
const ProjetoAuvox = lazy(() => import("./components/ProjetoAuvox.jsx"));

/* Fallback minimalista — mantém o layout sem travar */
const Skeleton = () => (
  <div
    style={{ minHeight: "60vh", background: "transparent" }}
    aria-hidden="true"
  />
);

function App() {
  /* Scroll suave e lento no site inteiro (Lenis + GSAP ScrollTrigger).
     É isso que faz o scroll "descer a tela" com inércia, em vez do pulo
     seco padrão do navegador — e funciona igual subindo ou descendo. */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.6, // quanto maior, mais lento/suave o scroll
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });

    // Mantém o ScrollTrigger (usado no efeito "you can scroll") sincronizado
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Faz os links de âncora do menu (#inicio, #solucoes, etc.) usarem o
    // mesmo scroll suave do Lenis em vez do salto instantâneo do navegador
    const onAnchorClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();

      /* A duração acompanha a distância: links próximos continuam ágeis e
         saltos longos ganham tempo suficiente para não parecerem bruscos. */
      const distancia = Math.abs(target.getBoundingClientRect().top - 80);
      const telas = distancia / Math.max(window.innerHeight, 1);
      const duracao = Math.min(2.15, 1.15 + Math.min(telas, 5) * 0.2);
      const easingSuave = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      window.history.replaceState(null, "", id);
      lenis.scrollTo(target, {
        offset: -80,
        duration: duracao,
        easing: easingSuave,
      });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const secoes = document.querySelectorAll(
      "#inicio, #solucoes, #sobre, #projeto, #equipe",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add("secao-visivel");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" },
    );

    secoes.forEach((secao) => {
      secao.classList.add("revelar-secao");
      observer.observe(secao);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <NavBar />
      <Home />
      {/* O efeito "Auvox pode ..." NAO entra aqui: ele ja vive dentro do
          CarrosselNav, logo depois do slide, junto com os cards.
          Renderizar o ScrollAnimation tambem nesta linha duplicava o
          bloco: como os dois usam as mesmas classes (.scroll-list,
          .sticky-prefix), o GSAP mirava nos dois ao mesmo tempo e o
          "Auvox pode" de um bloco aparecia ao lado das palavras do
          outro, cada um numa ponta da tela. */}

      <Suspense fallback={<Skeleton />}>
        <CarrosselNav />
        <ProjetoAuvox />

        <Sobre />

        <Footer />

      </Suspense>
    </>
  );
}

export default App;
