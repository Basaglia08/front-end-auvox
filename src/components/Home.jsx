import React, { useEffect, useState, useRef } from "react";
import "../styles/home.css";

function Home() {
  const icone = "<";
  const icone2 = "/>";
  const canvasRef = useRef(null);

  // Efeito de digitação no título
  const fullTextLine1 = "Onde a inovação";
  const fullTextLine2 = " tem valor de ";
  const fullTextWord = "OURO";

  const [textLine1, setTextLine1] = useState("");
  const [textLine2, setTextLine2] = useState("");
  const [textWord, setTextWord] = useState("");

  // 1. Otimização do efeito de digitação usando setTimeout encadeado
  useEffect(() => {
    let timeoutId;
    let currentStep = 0;
    let index = 0;

    const type = () => {
      if (currentStep === 0) {
        if (index <= fullTextLine1.length) {
          setTextLine1(fullTextLine1.slice(0, index));
          index++;
          timeoutId = setTimeout(type, 50);
        } else {
          currentStep = 1;
          index = 0;
          timeoutId = setTimeout(type, 100);
        }
      } else if (currentStep === 1) {
        if (index <= fullTextLine2.length) {
          setTextLine2(fullTextLine2.slice(0, index));
          index++;
          timeoutId = setTimeout(type, 50);
        } else {
          currentStep = 2;
          index = 0;
          timeoutId = setTimeout(type, 100);
        }
      } else if (currentStep === 2) {
        if (index <= fullTextWord.length) {
          setTextWord(fullTextWord.slice(0, index));
          index++;
          timeoutId = setTimeout(type, 80);
        }
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, []);

  // 2. Animação de fundo no Canvas mais otimizada
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    /* O canvas agora mede o PRÓPRIO quadro (elemento pai), não a janela.
       Como a seção virou um card com margem, usar window.innerWidth deixaria
       o desenho esticado/cortado em relação à área visível. */
    const medir = () => {
      const pai = canvas.parentElement;
      return {
        largura: pai ? pai.clientWidth : window.innerWidth,
        altura: pai ? pai.clientHeight : window.innerHeight,
      };
    };

    const resizeCanvas = () => {
      const { largura, altura } = medir();
      canvas.width = largura;
      canvas.height = altura;
      criarWriters();
    };

    const codeBlocks = [
      ["function buildFuture() {", "  const tech = 'innovation';", "  return <Success />;", "}"],
      ["import { Gold } from 'gold-tech';", "await solution.deploy();", "console.log('Value created');"],
      ["const innovation = true;", "if (innovation) {", "  scaleBusiness();", "}"],
      ["// Onde a inovação tem valor", "npm run build --production", "git commit -m 'feat: gold'"],
      ["class Innovation {", "  constructor() {", "    this.value = 'OURO';", "  }", "}"]
    ];

    const fontSize = 13;
    const blockWidth = 320;
    let writers = [];

    function criarWriters() {
      const colunas = Math.floor(canvas.width / blockWidth) + 1;
      writers = Array.from({ length: colunas }, (_, i) => ({
        x: i * blockWidth + 20,
        y: Math.random() * (canvas.height / 2),
        blockIndex: Math.floor(Math.random() * codeBlocks.length),
        lineIndex: 0,
        charIndex: 0
      }));
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = 0;
    const interval = 40; // Intervalo fixo para controle de FPS

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const delta = currentTime - lastTime;

      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Courier New", monospace`;

      writers.forEach((w) => {
        const currentBlock = codeBlocks[w.blockIndex];

        // Atualiza a escrita de caracteres
        if (w.lineIndex < currentBlock.length) {
          const currentLine = currentBlock[w.lineIndex];
          if (w.charIndex < currentLine.length) {
            w.charIndex++;
          } else {
            w.lineIndex++;
            w.charIndex = 0;
          }
        } else {
          // Reinicia posição da coluna
          w.y += 120;
          if (w.y > canvas.height) {
            w.y = -50;
          }
          w.blockIndex = Math.floor(Math.random() * codeBlocks.length);
          w.lineIndex = 0;
          w.charIndex = 0;
        }

        // Renderização do código
        ctx.fillStyle = "#f2b544";

        // Linhas completas
        for (let l = 0; l < w.lineIndex; l++) {
          ctx.fillText(currentBlock[l], w.x, w.y + l * 20);
        }

        // Linha atual em digitação
        if (w.lineIndex < currentBlock.length) {
          const activeLine = currentBlock[w.lineIndex].substring(0, w.charIndex);
          ctx.fillText(activeLine + "_", w.x, w.y + w.lineIndex * 20);
        }
      });
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="inicio" className="home-quadro" style={{ paddingTop: "120px" }}>
      <canvas ref={canvasRef} className="code-rain-canvas" />

      <div className="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="content">
        <h2>
          <span className="title-slashes">
            {icone}
            {icone2}
          </span>
          <div className="title-text code-font">
            {textLine1}
            <br />
            {textLine2}
            <span className="gold-text">{textWord}</span>
            <span className="cursor-blink">|</span>
          </div>
        </h2>

        <div className="container-btn">
          <button className="button">
            <span className="button-content">Conheça nossas soluções</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Home;