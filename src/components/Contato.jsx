import React, { useState } from "react";
import { createPortal } from "react-dom";
import "../styles/contato.css";

// MÁSCARA DE TELEFONE
const aplicarMascara = (valor) => {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 2)  return `(${nums}`;
  if (nums.length <= 7)  return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
  if (nums.length <= 11) return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
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

function Contato() {

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (tipo, mensagem) => {
    setToast({ tipo, mensagem });
    setTimeout(() => setToast(null), 3500);
  };

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

    try {
      const response = await fetch("http://localhost:3000/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.sucesso) {
        showToast("sucesso", "Mensagem enviada com sucesso!");
        setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
        setErros({});
      } else {
        showToast("erro", "Erro ao enviar mensagem. Tente novamente.");
      }

    } catch (error) {
      console.log(error);
      showToast("erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const mensagemLen = formData.mensagem.length;
  const contadorClasse =
    mensagemLen > MENSAGEM_MAX ? "contador-erro" :
    mensagemLen >= MENSAGEM_MIN ? "contador-ok" :
    "contador-neutro";

  // Toast renderizado direto no body via Portal — escapa qualquer stacking context
  const toastPortal = toast && createPortal(
    <div className={`toast toast-${toast.tipo}`}>
      <div className="toast-icone">
        {toast.tipo === "sucesso"
          ? <i className="bx bx-check"></i>
          : <i className="bx bx-x"></i>
        }
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
    document.body
  );

  return (
    <section className="contato-secao" id="contato">

      {/* TOAST — renderizado no body via Portal */}
      {toastPortal}

      {/* TOPO */}
      <div className="contato-header">
        <p className="contato-slug">
          <span className="contato-slashes">//</span> ENTRE EM CONTATO
        </p>
        <h1 className="contato-titulo">
          Vamos <span className="contato-destaque">TRANSFORMAR</span> seu <br />
          negócio juntos
        </h1>
        <p className="contato-subtitulo">
          Entre em contato conosco e descubra como podemos ajudar sua empresa a alcançar novos patamares
        </p>
      </div>

      {/* CONTAINER */}
      <div className="contato-container">

        {/* FORM */}
        <form className="contato-form" onSubmit={handleSubmit} noValidate>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                className={erros.nome ? "input-erro" : ""}
              />
              {erros.nome && <span className="campo-erro">{erros.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="seu@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={erros.email ? "input-erro" : ""}
              />
              {erros.email && <span className="campo-erro">{erros.email}</span>}
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              className={erros.telefone ? "input-erro" : ""}
            />
            {erros.telefone && <span className="campo-erro">{erros.telefone}</span>}
          </div>

          <div className="form-group">
            <div className="mensagem-label-row">
              <label htmlFor="mensagem">Mensagem</label>
              <span className={`contador-chars ${contadorClasse}`}>
                {mensagemLen < MENSAGEM_MIN
                  ? `Mínimo ${MENSAGEM_MIN - mensagemLen} caracteres restantes`
                  : `${mensagemLen} / ${MENSAGEM_MAX}`
                }
              </span>
            </div>
            <textarea
              id="mensagem"
              rows="5"
              placeholder="Conte-nos sobre o site..."
              value={formData.mensagem}
              onChange={handleChange}
              className={erros.mensagem ? "input-erro" : ""}
              maxLength={MENSAGEM_MAX}
            ></textarea>
            {erros.mensagem && <span className="campo-erro">{erros.mensagem}</span>}
          </div>

          <button type="submit" className="btn-enviar" disabled={loading}>
            {loading
              ? "Enviando..."
              : <>Enviar Mensagem <i className="bx bx-paper-plane icon-enviar"></i></>
            }
          </button>

        </form>

        {/* INFO */}
        <div className="contato-info-col">

          <div className="info-card">
            <div className="info-icon-box">
              <i className="bx bx-envelope"></i>
            </div>
            <div className="info-text-box">
              <span className="info-label">Email</span>
              <p className="info-value">company.auvox@gmail.com</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-box">
              <i className="bx bx-phone"></i>
            </div>
            <div className="info-text-box">
              <span className="info-label">Telefone</span>
              <p className="info-value">(11) 1234-5678</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-box">
              <i className="bx bx-map"></i>
            </div>
            <div className="info-text-box">
              <span className="info-label">Endereço</span>
              <p className="info-value">Av. Paulista, 1000 - São Paulo, SP</p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Contato;
