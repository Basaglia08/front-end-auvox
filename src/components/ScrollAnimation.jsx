// @ts-nocheck
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Pane } from "tweakpane";
import "../styles/YouCanScroll.css";

export default function ScrollAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const config = {
      theme: "dark",
    };

    const ctrl = new Pane({ title: "Config", expanded: false });
    const items = gsap.utils.toArray(".scroll-list li");

    const update = () => {
      document.documentElement.dataset.theme = config.theme;
    };

    ctrl.addBinding(config, "theme", {
      label: "Theme",
      options: { Dark: "dark", Light: "light" },
    });
    ctrl.on("change", update);

    // Acende/foca a palavra que está passando exatamente pelo centro da tela
    // (mesma altura do "you can"). Em vez de um timeline com tempos fixos por
    // índice (que podia ficar dessincronizado da posição real na tela), cada
    // palavra tem seu próprio ScrollTrigger que reage à posição real dela:
    // ela acende quando o centro dela cruza o centro da viewport, e apaga
    // quando sai — isso garante alinhamento perfeito com o "you can",
    // tanto descendo quanto subindo o scroll.
    const highlight = (item) =>
      gsap.to(item, {
        opacity: 1,
        filter: "brightness(1.3) saturate(1.2)",
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });

    const unhighlight = (item) =>
      gsap.to(item, {
        opacity: 0.15,
        filter: "brightness(0.5) saturate(0.5)",
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });

    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        end: "bottom center",
        onEnter: () => highlight(item),
        onEnterBack: () => highlight(item),
        onLeave: () => unhighlight(item),
        onLeaveBack: () => unhighlight(item),
      });
    });

    // "you can" fica fixo/estático na tela. Ele só entra em cena (fade-in) no
    // início da lista e some (fade-out) no final — usando EXATAMENTE o mesmo
    // trigger/início/fim da lista de palavras, então fica sempre sincronizado,
    // tanto descendo quanto subindo o scroll (o scrub do GSAP é reversível).
    const prefixTimeline = gsap
      .timeline()
      .fromTo(
        ".sticky-prefix",
        { opacity: 0 },
        { opacity: 1, duration: 0.08, ease: "none" },
        0,
      )
      .to(".sticky-prefix", { opacity: 1, duration: 0.84, ease: "none" }, 0.08)
      .to(".sticky-prefix", { opacity: 0, duration: 0.08, ease: "none" }, 0.92);

    ScrollTrigger.create({
      trigger: ".scroll-list",
      start: "top 50%",
      end: "bottom 50%",
      animation: prefixTimeline,
      scrub: 2, // catch-up bem mais lento e suave em relação ao scroll bruto
    });

    update();

    return () => {
      ctrl.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const itemsList = [
    "projetar.",
    "prototipar.",
    "resolver.",
    "construir.",
    "desenvolver.",
    "depurar.",
  ];
  return (
    <div ref={containerRef}>
      <main className="scroll-main">
        <header className="scroll-header"></header>

        <div className="scroll-row">
          {/* Frase estática na viewport */}
          <div className="sticky-prefix">
            <span> Auvox pode</span>
          </div>

          <section className="scroll-content">
            <ul aria-hidden="true" className="scroll-list">
              {itemsList.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="scroll-footer-section"></section>
      </main>

      {/* <footer className="scroll-footer">ʕ⊙ᴥ⊙ʔ jh3yy &copy; 2024</footer> */}
    </div>
  );
}
