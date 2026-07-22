"use strict";

/* =========================================================
   Carrossel de fotos da página Sobre
========================================================= */

const fotos = [
  {
    src: "css_imagens/foto2.jpeg",
    alt: "Psicóloga Júlia Lessa Ribeiro"
  },
  {
    src: "css_imagens/foto3.jpeg",
    alt: "Psicóloga Júlia Lessa Ribeiro"
  },
  {
    src: "css_imagens/foto4.jpeg",
    alt: "Psicóloga Júlia Lessa Ribeiro"
  },
  {
    src: "css_imagens/foto5.jpeg",
    alt: "Psicóloga Júlia Lessa Ribeiro"
  }
];

const imagemCarrossel = document.getElementById("fotoTroca");
const prefereMenosMovimento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let indiceFoto = 0;
let trocaEmAndamento = false;

/* Pré-carrega as imagens para evitar demora durante a troca */

fotos.forEach((foto) => {
  const imagem = new Image();
  imagem.src = foto.src;
});

/* Procura a posição da imagem inicial no conjunto de fotos */

if (imagemCarrossel) {
  const srcAtual = imagemCarrossel
    .getAttribute("src")
    ?.replace(/^\.\//, "");

  const indiceInicial = fotos.findIndex(
    (foto) => foto.src.replace(/^\.\//, "") === srcAtual
  );

  if (indiceInicial >= 0) {
    indiceFoto = indiceInicial;
  }

  imagemCarrossel.setAttribute("tabindex", "0");
  imagemCarrossel.setAttribute("role", "button");
  imagemCarrossel.setAttribute(
    "aria-label",
    "Trocar para a próxima foto de Júlia Lessa Ribeiro"
  );

  function atualizarFoto() {
    if (trocaEmAndamento) {
      return;
    }

    trocaEmAndamento = true;
    indiceFoto = (indiceFoto + 1) % fotos.length;

    const proximaFoto = fotos[indiceFoto];

    if (prefereMenosMovimento.matches) {
      imagemCarrossel.src = proximaFoto.src;
      imagemCarrossel.alt = proximaFoto.alt;
      trocaEmAndamento = false;
      return;
    }

    imagemCarrossel.style.opacity = "0";

    window.setTimeout(() => {
      imagemCarrossel.src = proximaFoto.src;
      imagemCarrossel.alt = proximaFoto.alt;
      imagemCarrossel.style.opacity = "1";
      trocaEmAndamento = false;
    }, 200);
  }

  imagemCarrossel.addEventListener("click", atualizarFoto);

  imagemCarrossel.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      atualizarFoto();
    }
  });
}

/* =========================================================
   Menu responsivo
========================================================= */

const botaoMenu = document.querySelector(".botao-menu");
const navegacao = document.querySelector(".navegacao");
const limiteMenuMobile = 520;

function menuEstaAberto() {
  return navegacao?.classList.contains("aberta") ?? false;
}

function abrirMenu() {
  if (!botaoMenu || !navegacao) {
    return;
  }

  navegacao.classList.add("aberta");
  botaoMenu.classList.add("ativo");
  botaoMenu.setAttribute("aria-expanded", "true");
  botaoMenu.setAttribute("aria-label", "Fechar menu");
}

function fecharMenu() {
  if (!botaoMenu || !navegacao) {
    return;
  }

  navegacao.classList.remove("aberta");
  botaoMenu.classList.remove("ativo");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
}

function alternarMenu() {
  if (menuEstaAberto()) {
    fecharMenu();
  } else {
    abrirMenu();
  }
}

if (botaoMenu && navegacao) {
  botaoMenu.addEventListener("click", alternarMenu);

  navegacao.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("click", (evento) => {
    if (!menuEstaAberto()) {
      return;
    }

    const elementoClicado = evento.target;

    if (!(elementoClicado instanceof Node)) {
      return;
    }

    const clicouNoMenu = navegacao.contains(elementoClicado);
    const clicouNoBotao = botaoMenu.contains(elementoClicado);

    if (!clicouNoMenu && !clicouNoBotao) {
      fecharMenu();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menuEstaAberto()) {
      fecharMenu();
      botaoMenu.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > limiteMenuMobile) {
      fecharMenu();
    }
  });
}

/* =========================================================
   Animação das seções ao aparecerem na tela
========================================================= */

const elementosAnimados = document.querySelectorAll(
  [
    ".sobre-texto",
    ".sobre-foto",
    ".sobre-bloco-texto",
    ".sobre-bloco-foto",
    ".chamada-contato",
    ".redes-sociais",
    ".faq",
    ".contato-container"
  ].join(", ")
);

function mostrarTodosOsElementos() {
  elementosAnimados.forEach((elemento) => {
    elemento.classList.remove("animacao-entrada");
    elemento.classList.add("visivel");
  });
}

if (
  prefereMenosMovimento.matches ||
  !("IntersectionObserver" in window)
) {
  mostrarTodosOsElementos();
} else {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) {
          return;
        }

        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elementosAnimados.forEach((elemento) => {
    elemento.classList.add("animacao-entrada");
    observador.observe(elemento);
  });
}

/* Atualiza as animações caso a preferência do sistema mude */

prefereMenosMovimento.addEventListener("change", (evento) => {
  if (evento.matches) {
    mostrarTodosOsElementos();
  }
});