// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/contato.css";

gsap.registerPlugin(ScrollTrigger);

// URL do back-end (pode ser sobrescrita por VITE_API_URL no .env do Vite)
const API_URL =
  import.meta.env.VITE_API_URL || "https://back-end-auvox.onrender.com";

// Tempo máximo esperando o back-end antes de mostrar erro (ms)
const TIMEOUT_MS = 30_000;

// MÁSCARA DE TELEFONE
const aplicarMascara = (valor) => {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 2) return `(${nums}`;
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  if (nums.length <= 11)
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  return valor;
};

// VALIDAÇÕES
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email.trim());
};

const validarTelefone = (tel) => {
  const nums = tel.replace(/\D/g, "");
  return nums.length === 10 || nums.length === 11;
};

const MENSAGEM_MIN = 10;
const MENSAGEM_MAX = 2000;

// Canais de contato — editar aqui reflete no painel lateral
/* Todos os ícones vêm da família SÓLIDA do Boxicons (prefixo `bxs-`).
   Misturar `bx-` (contorno) com `bxs-` (preenchido) é o que deixa um
   conjunto sem unidade — assim os três têm o mesmo peso visual. */
const CANAIS = [
  {
    icone: "bxs-envelope",
    rotulo: "Mande um e-mail",
    valor: "company.auvox@gmail.com",
  },
  { icone: "bxs-phone", rotulo: "Fale por telefone", valor: "(11) 1234-5678" },
  {
    icone: "bxs-map",
    rotulo: "Venha tomar um café",
    valor: "Av. Paulista, 1000 — São Paulo, SP",
  },
];

function Contato() {
  const secaoRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // "Acorda" o servidor no Render assim que a página carrega: o plano free
  // hiberna após ~15 min sem uso e leva ~30-60 s para subir. Fazendo o ping
  // aqui, quando o usuário terminar de preencher o formulário o back-end
  // já está de pé e o envio leva poucos segundos.
  useEffect(() => {
    fetch(`${API_URL}/health`, { method: "GET" }).catch(() => {});
  }, []);

  const showToast = (tipo, mensagem) => {
    setToast({ tipo, mensagem });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── ANIMAÇÕES DE SCROLL ──
     Todas com `scrub`: o progresso fica amarrado à posição do scroll, então
     descendo a seção se monta e subindo ela se desmonta sozinha. */
  useEffect(() => {
    const raiz = secaoRef.current;
    if (!raiz) return undefined;

    let ctx;

    /* try/catch por segurança: o componente vive dentro do <Suspense> do
       App. Um erro solto aqui derrubaria a árvore inteira. */
    try {
      ctx = gsap.context(() => {
        /* CABEÇALHO — efeito simples: aparece subindo quando o scroll
           desce e desaparece quando sobe. Como o timeline usa `scrub`, o
           progresso segue a posição da página nos dois sentidos. */
        const cabecalho = raiz.querySelector(".contato-header");

        if (cabecalho) {
          gsap.fromTo(
            cabecalho.children,
            { opacity: 0, y: 34 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: cabecalho,
                start: "top 92%",
                end: "top 50%",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Painel: lateral entra pela esquerda, campos sobem em cascata
        const painel = raiz.querySelector(".contato-painel");
        const lateral = raiz.querySelector(".contato-lateral");
        const canais = Array.from(raiz.querySelectorAll(".contato-canal"));
        const campos = Array.from(raiz.querySelectorAll(".contato-form > *"));

        if (painel) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: painel,
              start: "top 88%",
              end: "top 40%",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });

          if (lateral) {
            tl.fromTo(
              lateral,
              { opacity: 0, x: -40 },
              { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
              0,
            );
          }

          if (canais.length) {
            tl.fromTo(
              canais,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.1,
              },
              0.3,
            );
          }

          if (campos.length) {
            tl.fromTo(
              campos,
              { opacity: 0, y: 34 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.09,
              },
              0.15,
            );
          }
        }

        ScrollTrigger.refresh();
      }, secaoRef);
    } catch (erro) {
      console.warn("[Contato] animação desativada:", erro);
    }

    const onLoad = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* ignora */
      }
    };
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      try {
        if (ctx) ctx.revert();
      } catch {
        /* ignora */
      }
    };
  }, []);

  // ATUALIZA INPUTS
  const handleChange = (e) => {
    const { id, value } = e.target;
    const novoValor = id === "telefone" ? aplicarMascara(value) : value;
    setFormData({ ...formData, [id]: novoValor });
    if (erros[id]) {
      setErros({ ...erros, [id]: "" });
    }
  };

  // VALIDA TODOS OS CAMPOS
  const validar = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = "Por favor, informe seu nome.";
    }

    if (!formData.email.trim()) {
      novosErros.email = "Por favor, informe seu e-mail.";
    } else if (!validarEmail(formData.email)) {
      novosErros.email = "E-mail inválido. Ex: nome@dominio.com";
    }

    if (!formData.telefone.trim()) {
      novosErros.telefone = "Por favor, informe seu telefone.";
    } else if (!validarTelefone(formData.telefone)) {
      novosErros.telefone = "Telefone incompleto. Ex: (11) 99999-9999";
    }

    if (!formData.mensagem.trim()) {
      novosErros.mensagem = "Por favor, escreva sua mensagem.";
    } else if (formData.mensagem.trim().length < MENSAGEM_MIN) {
      novosErros.mensagem = `Mensagem muito curta. Mínimo ${MENSAGEM_MIN} caracteres.`;
    } else if (formData.mensagem.trim().length > MENSAGEM_MAX) {
      novosErros.mensagem = `Mensagem muito longa. Máximo ${MENSAGEM_MAX} caracteres.`;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // ENVIA FORMULÁRIO
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setLoading(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(`${API_URL}/contato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.sucesso) {
        showToast("sucesso", "Mensagem enviada com sucesso!");
        setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
        setErros({});
      } else if (response.status === 422 && Array.isArray(data.erros)) {
        // Validação do back-end: mostra o primeiro erro real
        showToast("erro", data.erros[0]);
      } else if (response.status === 429) {
        showToast("erro", data.erro || "Muitas tentativas. Aguarde alguns minutos.");
      } else {
        showToast("erro", data.erro || "Erro ao enviar mensagem. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      if (error.name === "AbortError") {
        showToast("erro", "O servidor demorou para responder. Tente novamente.");
      } else {
        showToast("erro", "Não foi possível conectar ao servidor.");
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  const mensagemLen = formData.mensagem.length;
  const contadorClasse =
    mensagemLen > MENSAGEM_MAX
      ? "contador-erro"
      : mensagemLen >= MENSAGEM_MIN
        ? "contador-ok"
        : "contador-neutro";

  // Toast renderizado direto no body via Portal — escapa qualquer stacking context
  const toastPortal =
    toast &&
    createPortal(
      <div className={`toast toast-${toast.tipo}`}>
        <div className="toast-icone">
          {toast.tipo === "sucesso" ? (
            <i className="bx bx-check"></i>
          ) : (
            <i className="bx bx-x"></i>
          )}
        </div>
        <div className="toast-texto">
          <span className="toast-titulo">
            {toast.tipo === "sucesso" ? "Enviado!" : "Ops, erro!"}
          </span>
          <span className="toast-msg">{toast.mensagem}</span>
        </div>
        <button className="toast-fechar" onClick={() => setToast(null)}>
          <i className="bx bx-x"></i>
        </button>
      </div>,
      document.body,
    );

  return (
    <section className="contato-secao" id="contato" ref={secaoRef}>
      {/* TOAST — renderizado no body via Portal */}
      {toastPortal}

      {/* brilhos suaves de fundo */}
      <span className="contato-brilho -um" aria-hidden="true" />
      <span className="contato-brilho -dois" aria-hidden="true" />

      {/* TOPO — mesmo formato do cabeçalho da Equipe */}
      <div className="contato-header secao-topo -escuro">
        <p className="secao-slug">
          <span className="contato-slashes">//</span> Fale com a Auvox
        </p>

        <h2 className="secao-titulo">
          <span>CONTATO</span>
        </h2>

        <div className="secao-sep" />

        <p className="contato-subtitulo">
          Tem um projeto em mente, uma ideia solta ou só uma dúvida? Escreva pra
          gente — a resposta vem rápido e sem enrolação.
        </p>
      </div>

      {/* PAINEL */}
      <div className="contato-painel">
        {/* LATERAL */}
        <aside className="contato-lateral">
          <h3 className="contato-lateral-titulo">Não seja tímido</h3>
          <p className="contato-lateral-texto">
            Fique à vontade para chamar a gente. Estamos sempre abertos a
            projetos novos, ideias fora da caixa e à chance de fazer parte da
            sua visão — do primeiro rascunho até o site no ar.
          </p>

          <ul className="contato-canais">
            {CANAIS.map((canal) => (
              <li className="contato-canal" key={canal.rotulo}>
                <span className="contato-canal-icone">
                  <i className={`bx ${canal.icone}`}></i>
                </span>
                <span className="contato-canal-texto">
                  <span className="contato-canal-rotulo">{canal.rotulo}</span>
                  <span className="contato-canal-valor">{canal.valor}</span>
                </span>
              </li>
            ))}
          </ul>

          <span className="contato-assinatura">AUVOX · SÃO PAULO — SP</span>
        </aside>

        {/* FORM */}
        <form className="contato-form" onSubmit={handleSubmit} noValidate>
          <div className="contato-linha">
            <div className="contato-campo">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                placeholder="Como podemos te chamar?"
                value={formData.nome}
                onChange={handleChange}
                className={erros.nome ? "input-erro" : ""}
              />
              {erros.nome && <span className="campo-erro">{erros.nome}</span>}
            </div>

            <div className="contato-campo">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Seu melhor e-mail"
                value={formData.email}
                onChange={handleChange}
                className={erros.email ? "input-erro" : ""}
              />
              {erros.email && <span className="campo-erro">{erros.email}</span>}
            </div>
          </div>

          <div className="contato-campo">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              className={erros.telefone ? "input-erro" : ""}
            />
            {erros.telefone && (
              <span className="campo-erro">{erros.telefone}</span>
            )}
          </div>

          <div className="contato-campo">
            <div className="mensagem-label-row">
              <label htmlFor="mensagem">Mensagem</label>
              <span className={`contador-chars ${contadorClasse}`}>
                {mensagemLen < MENSAGEM_MIN
                  ? `Mínimo ${MENSAGEM_MIN - mensagemLen} caracteres restantes`
                  : `${mensagemLen} / ${MENSAGEM_MAX}`}
              </span>
            </div>
            <textarea
              id="mensagem"
              rows="5"
              placeholder="Conte o que você tem em mente..."
              value={formData.mensagem}
              onChange={handleChange}
              className={erros.mensagem ? "input-erro" : ""}
              maxLength={MENSAGEM_MAX}
            ></textarea>
            {erros.mensagem && (
              <span className="campo-erro">{erros.mensagem}</span>
            )}
          </div>

          <button type="submit" className="btn-enviar" disabled={loading}>
            <span>{loading ? "Enviando..." : "Enviar mensagem"}</span>
            {!loading && <i className="bx bx-right-arrow-alt"></i>}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contato;
