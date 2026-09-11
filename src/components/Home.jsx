import React, { useEffect, useRef, useState } from "react";
import InteractiveGlobe from "./InteractiveGlobe";
import "../styles/home.css";

const TITLE_LINE_ONE = "Onde a inovação";
const TITLE_LINE_TWO = "tem valor de ";
const TITLE_GOLD_WORD = "OURO.";

function Home() {
  const canvasRef = useRef(null);
  const reducedMotionInitial = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [typedTitleLineOne, setTypedTitleLineOne] = useState(
    reducedMotionInitial ? TITLE_LINE_ONE : "",
  );
  const [typedTitleLineTwo, setTypedTitleLineTwo] = useState(
    reducedMotionInitial ? TITLE_LINE_TWO : "",
  );
  const [typedTitleWord, setTypedTitleWord] = useState(
    reducedMotionInitial ? TITLE_GOLD_WORD : "",
  );

  useEffect(() => {
    if (reducedMotionInitial) return undefined;

    let phase = 0;
    let characterIndex = 0;
    let timeoutId;

    const typeTitle = () => {
      if (phase === 0) {
        if (characterIndex <= TITLE_LINE_ONE.length) {
          setTypedTitleLineOne(TITLE_LINE_ONE.slice(0, characterIndex));
          characterIndex += 1;
          timeoutId = setTimeout(typeTitle, 52);
        } else {
          phase = 1;
          characterIndex = 0;
          timeoutId = setTimeout(typeTitle, 120);
        }
      } else if (phase === 1) {
        if (characterIndex <= TITLE_LINE_TWO.length) {
          setTypedTitleLineTwo(TITLE_LINE_TWO.slice(0, characterIndex));
          characterIndex += 1;
          timeoutId = setTimeout(typeTitle, 52);
        } else {
          phase = 2;
          characterIndex = 0;
          timeoutId = setTimeout(typeTitle, 120);
        }
      } else if (characterIndex <= TITLE_GOLD_WORD.length) {
        setTypedTitleWord(TITLE_GOLD_WORD.slice(0, characterIndex));
        characterIndex += 1;
        timeoutId = setTimeout(typeTitle, 80);
      }
    };

    typeTitle();
    return () => clearTimeout(timeoutId);
  }, [reducedMotionInitial]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const codeBlocks = [
      ["const product = await build();", "product.ship();"],
      ["import { future } from '@auvox';", "future.create({ impact: true });"],
      ["interface Experience {", "  clarity: boolean;", "}"],
      ["git commit -m 'launch'", "npm run scale"],
      ["function solve(problem) {", "  return aBetterWay(problem);", "}"],
    ];
    let columns = [];
    let animationFrame;
    let lastFrame = 0;

    const createColumns = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      const density = window.innerWidth < 700 ? 250 : 300;

      canvas.width = width;
      canvas.height = height;
      columns = Array.from({ length: Math.ceil(width / density) + 1 }, (_, index) => ({
        x: index * density + 20,
        y: Math.random() * height,
        block: Math.floor(Math.random() * codeBlocks.length),
        line: 0,
        character: 0,
      }));
    };

    const draw = (timestamp) => {
      animationFrame = requestAnimationFrame(draw);
      if (timestamp - lastFrame < 52) return;
      lastFrame = timestamp;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = '12px "Courier New", monospace';
      context.fillStyle = "rgba(242, 181, 68, 0.46)";

      columns.forEach((column) => {
        const block = codeBlocks[column.block];
        const currentLine = block[column.line] || "";

        if (column.character < currentLine.length) {
          column.character += 1;
        } else if (column.line < block.length - 1) {
          column.line += 1;
          column.character = 0;
        } else {
          column.y += 112;
          if (column.y > canvas.height + 80) column.y = -80;
          column.block = Math.floor(Math.random() * codeBlocks.length);
          column.line = 0;
          column.character = 0;
        }

        block.forEach((line, lineIndex) => {
          if (lineIndex < column.line) {
            context.fillText(line, column.x, column.y + lineIndex * 18);
          }
        });

        if (column.line < block.length) {
          context.fillText(
            `${currentLine.slice(0, column.character)}_`,
            column.x,
            column.y + column.line * 18,
          );
        }
      });
    };

    createColumns();
    window.addEventListener("resize", createColumns);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", createColumns);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section id="inicio" className="home-quadro">
      <canvas ref={canvasRef} className="code-rain-canvas" aria-hidden="true" />
      <div className="home-grid" aria-hidden="true" />
      <div className="home-glow home-glow-one" aria-hidden="true" />
      <div className="home-glow home-glow-two" aria-hidden="true" />

      <div className="home-layout">
        <div className="home-copy">
          <h1>
            {typedTitleLineOne}
            <br />
            <span>
              {typedTitleLineTwo}
              <em>{typedTitleWord}</em>
              <span className="title-caret" aria-hidden="true">|</span>
            </span>
          </h1>

          <p className="hero-description">
            Criamos experiências digitais, plataformas e sistemas que transformam
            ideias complexas em soluções simples de usar e prontas para crescer.
          </p>

          <div className="hero-actions">
            <a className="hero-primary" href="#solucoes">
              <span>Conheça nossas soluções</span>
            </a>
          </div>
        </div>

        <div className="home-visual" aria-label="Globo terrestre interativo Auvox">
          <InteractiveGlobe />
        </div>
      </div>

    </section>
  );
}

export default Home;
