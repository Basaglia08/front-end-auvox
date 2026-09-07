# Auvox — Website Institucional

Site institucional da **Auvox**, uma software house formada por estudantes de Desenvolvimento de Sistemas da ETEC de Guaianazes. A página apresenta os serviços, o projeto em destaque (app Intermedi), a equipe e um formulário de contato funcional.

**Produção:** https://auvox.vercel.app

---

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Como rodar localmente](#como-rodar-localmente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Integração com o back-end](#integração-com-o-back-end)
- [Deploy na Vercel](#deploy-na-vercel)
- [Performance e otimização](#performance-e-otimização)
- [Convenções e manutenção](#convenções-e-manutenção)
- [Equipe](#equipe)

---

## Visão geral

Single Page Application construída em **React 19** com **Vite**. A navegação acontece por âncoras dentro de uma única página, com rolagem suave e animações acionadas conforme o usuário desce pelas seções.

Seções principais:

| Seção | Âncora | Descrição |
|-------|--------|-----------|
| Início | `#inicio` | Hero com título animado e fundo em canvas |
| Soluções | `#solucoes` | Carrossel de serviços com animação de scroll |
| Projeto | `#projeto` | Case do aplicativo Intermedi |
| Sobre | `#sobre` | História da Auvox |
| Equipe | `#equipe` | Cards dos integrantes (foto P&B → colorida no hover) |
| Contato | `#contato` | Formulário integrado ao back-end |

---

## Tecnologias

- **React 19** + **Vite** — biblioteca de UI e bundler/dev server.
- **GSAP** com **ScrollTrigger** — animações acionadas pela rolagem.
- **Lenis** — rolagem suave com inércia em todo o site.
- **react-icons** — ícones das redes sociais na seção Equipe.
- **ESLint** — padronização e verificação de código.

---

## Requisitos

- **Node.js 20 ou superior** (recomendado LTS)
- **npm** (acompanha o Node)

Confira sua versão com:

```bash
node -v
npm -v
```

---

## Como rodar localmente

```bash
# 1. Instale as dependências (necessário na primeira vez)
npm install

# 2. Suba o servidor de desenvolvimento
npm run dev
```

O terminal exibirá o endereço local, normalmente `http://localhost:5173`. Abra-o no navegador; qualquer alteração no código recarrega a página automaticamente.

> **Importante:** o pacote é distribuído **sem** a pasta `node_modules`. Rode `npm install` antes do primeiro `npm run dev`.

---

## Scripts disponíveis

| Script | O que faz |
|--------|-----------|
| `npm run dev` | Sobe o servidor de desenvolvimento com hot reload. |
| `npm run build` | Gera a versão de produção otimizada na pasta `dist/`. |
| `npm run preview` | Serve localmente o conteúdo de `dist/` para conferência antes do deploy. |
| `npm run lint` | Roda o ESLint em todo o projeto. |

---

## Estrutura do projeto

```
front-end-auvox/
├── index.html               # HTML raiz, fontes e ícone
├── vite.config.js           # Configuração do Vite (code splitting por vendor)
├── eslint.config.js         # Regras de lint
├── public/                  # Arquivos servidos como estão (favicon, ícones)
└── src/
    ├── main.jsx             # Ponto de entrada — monta o React no #root
    ├── App.jsx              # Layout geral, rolagem suave (Lenis) e lazy loading
    ├── components/          # Componentes de cada seção
    │   ├── NavBar.jsx
    │   ├── Home.jsx
    │   ├── CarrosselNav.jsx
    │   ├── Carrossel.jsx
    │   ├── ProjetoAuvox.jsx
    │   ├── Sobre.jsx
    │   ├── Equipe.jsx
    │   ├── Contato.jsx
    │   └── Footer.jsx
    ├── styles/              # Um CSS por seção + estilos globais (app.css)
    └── assets/              # Imagens (formato WebP)
```

As seções abaixo da dobra são carregadas sob demanda via `React.lazy` em `App.jsx`, reduzindo o peso do carregamento inicial.

---

## Integração com o back-end

O formulário de contato (`src/components/Contato.jsx`) envia os dados para uma API própria, que dispara os e-mails.

- **Endpoint padrão:** `https://back-end-auvox.onrender.com/contato`
- O componente faz um "aquecimento" da API ao carregar a página (`GET /health`), para que o servidor já esteja de pé quando o usuário enviar a mensagem — o plano gratuito do Render hiberna após inatividade.
- Há um tempo limite de 30 segundos na requisição, com mensagens de erro específicas para cada situação (validação, excesso de tentativas, falha de conexão).

### Sobrescrevendo a URL da API (opcional)

Para apontar o front para outra API sem editar código, crie um arquivo `.env` na raiz:

```
VITE_API_URL=https://sua-api.exemplo.com
```

Se a variável não existir, o valor padrão de produção é usado.

> **Atenção — CORS:** a API só aceita requisições vindas das origens configuradas nela. Ao rodar localmente, garanta que `http://localhost:5173` esteja liberado na variável `CORS_ORIGIN` do back-end.

---

## Deploy na Vercel

O projeto está hospedado na Vercel com deploy automático a cada push na branch principal.

Configuração de build (detectada automaticamente pela Vercel para projetos Vite):

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Ao publicar em um novo endereço, lembre-se de adicionar essa URL à variável `CORS_ORIGIN` do back-end, senão o formulário de contato será bloqueado pelo navegador.

---

## Performance e otimização

O site passou por uma rodada de otimização com foco em carregamento rápido e rolagem fluida, **sem alterações no design**:

- **Imagens:** convertidas de PNG para **WebP** e redimensionadas para a resolução real de exibição. O conjunto de imagens caiu de **~26 MB para ~0,7 MB**.
- **Carregamento sob demanda:** imagens usam `loading="lazy"` e as seções abaixo da dobra são carregadas apenas quando necessárias.
- **Limpeza de bundle:** componentes, estilos, bibliotecas e assets não utilizados foram removidos, além de imports mortos.
- **Code splitting:** o `vite.config.js` separa as bibliotecas de terceiros (React, ícones e demais dependências) em chunks próprios, melhorando o cache entre deploys.

### Recomendações para manter o desempenho

- Sempre que adicionar uma imagem, exporte em **WebP** e no tamanho aproximado em que ela aparece na tela (evite subir arquivos de milhares de pixels de largura).
- Rode `npm run build` e `npm run preview` antes de publicar para conferir o resultado final.

---

## Convenções e manutenção

- **Um CSS por seção:** cada componente tem seu arquivo em `src/styles/`. Os estilos globais e a superfície de fundo ficam em `app.css`.
- **Animações:** ficam nos próprios componentes, via GSAP/ScrollTrigger, sincronizadas com a rolagem do Lenis em `App.jsx`.
- **Lint antes do commit:** rode `npm run lint` para pegar imports não usados e outros avisos.
- **Dependências ociosas:** `clsx` e `tweakpane` não são mais utilizadas após a limpeza e podem ser removidas do `package.json` em uma futura manutenção.

---

## Equipe

Desenvolvido pela equipe Auvox: Ariella, Ana, Bia, Gabriel, Matheus, Alexandre R., Alexandre S., Miguel, Eduardo e Fabricio.

---

<p align="center">Auvox — Onde a inovação tem valor de ouro.</p>
