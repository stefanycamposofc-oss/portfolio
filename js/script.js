// ========== SEMPRE COMEÇAR DO TOPO ==========
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (location.hash) {
  history.replaceState(null, '', location.pathname);
}

window.scrollTo(0, 0);

// ========== MODAL ==========
const modal = document.querySelector('#modal');
const modalConteudo = modal.querySelector('.modal-conteudo');
const botaoFechar = modal.querySelector('.modal-fechar');

function abrirModal(elementos) {
  modalConteudo.replaceChildren(...elementos);
  modal.showModal();
}

const botoesProjeto = document.querySelectorAll('.abrir-detalhes');

botoesProjeto.forEach((botao) => {
  botao.addEventListener('click', () => {
    const projeto = botao.closest('.projeto');

    const titulo = projeto.querySelector('h3').cloneNode(true);
    const detalhes = projeto.querySelector('.projeto-detalhes').cloneNode(true);
    detalhes.hidden = false;

    abrirModal([titulo, detalhes]);
  });
});

const botoesCertificado = document.querySelectorAll('.abrir-certificado');

botoesCertificado.forEach((botao) => {
  botao.addEventListener('click', () => {
    const certificado = botao.closest('.certificado');

    const elementos = [
      botao.querySelector('img').cloneNode(true),
      botao.querySelector('h3').cloneNode(true),
      botao.querySelector('p').cloneNode(true),
    ];

    const detalhes = certificado.querySelector('.certificado-detalhes');
    if (detalhes) {
      const copia = detalhes.cloneNode(true);
      copia.hidden = false;
      elementos.push(copia);
    }

    abrirModal(elementos);
  });
});

botaoFechar.addEventListener('click', () => {
  modal.close();
});

modal.addEventListener('click', (evento) => {
  const caixa = modal.getBoundingClientRect();
  const clicouFora =
    evento.clientX < caixa.left ||
    evento.clientX > caixa.right ||
    evento.clientY < caixa.top ||
    evento.clientY > caixa.bottom;

  if (clicouFora) {
    modal.close();
  }
});

// ========== SETAS DOS CERTIFICADOS ==========
const trilho = document.querySelector('.trilho');
const setaAnterior = document.querySelector('.trilho-anterior');
const setaProxima = document.querySelector('.trilho-proximo');
const controlesTrilho = document.querySelector('.trilho-controles');

function moverTrilho(direcao) {
  const card = trilho.querySelector('.certificado');
  if (!card) return;

  const passo = card.offsetWidth + 24;
  trilho.scrollBy({ left: passo * direcao, behavior: 'smooth' });
}

setaAnterior.addEventListener('click', () => moverTrilho(-1));
setaProxima.addEventListener('click', () => moverTrilho(1));

// Esconde as setas se todos os certificados couberem na tela
function atualizarSetas() {
  const temMaisParaRolar = trilho.scrollWidth > trilho.clientWidth;
  controlesTrilho.hidden = !temMaisParaRolar;
}

atualizarSetas();
window.addEventListener('resize', atualizarSetas);

// ========== COPIAR E-MAIL ==========
const botaoEmail = document.querySelector('.copiar-email');
const avisoCopiado = document.querySelector('.aviso-copiado');

botaoEmail.addEventListener('click', () => {
  const email = botaoEmail.dataset.email;

  navigator.clipboard.writeText(email)
    .then(() => {
      avisoCopiado.textContent = idiomaAtual === 'en' ? 'Email copied!' : 'E-mail copiado!';
    })
    .catch(() => {
      avisoCopiado.textContent = idiomaAtual === 'en'
        ? 'Could not copy. Use the "Send email" link.'
        : 'Não foi possível copiar. Use o link "Enviar e-mail".';
    });

  setTimeout(() => {
    avisoCopiado.textContent = '';
  }, 3000);
});

// ========== ANIMAÇÃO AO ROLAR ==========
const secoes = document.querySelectorAll('.sobre, .projetos, .certificados, .contato');

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
    } else {
      entrada.target.classList.remove('visivel');
    }
  });
}, { threshold: 0.15 });

secoes.forEach((secao) => {
  secao.classList.add('revelar');
  observador.observe(secao);
});

// ========== IDIOMA PT/EN ==========
const botaoIdioma = document.querySelector('.idioma');
const textosTraduziveis = document.querySelectorAll('[data-en]');
const rotulosTraduziveis = document.querySelectorAll('[data-en-label]');
const linkCurriculo = document.querySelector('.link-curriculo');

let idiomaAtual = 'pt';

// Guarda os textos originais em português
textosTraduziveis.forEach((elemento) => {
  elemento.dataset.pt = elemento.textContent.trim();
});

rotulosTraduziveis.forEach((elemento) => {
  elemento.dataset.ptLabel = elemento.getAttribute('aria-label');
});

linkCurriculo.dataset.curriculoPt = linkCurriculo.getAttribute('href');

function aplicarIdioma(idioma) {
  const ingles = idioma === 'en';

  textosTraduziveis.forEach((elemento) => {
    elemento.textContent = ingles ? elemento.dataset.en : elemento.dataset.pt;
  });

  rotulosTraduziveis.forEach((elemento) => {
    const rotulo = ingles ? elemento.dataset.enLabel : elemento.dataset.ptLabel;
    elemento.setAttribute('aria-label', rotulo);
  });

  linkCurriculo.href = ingles
    ? linkCurriculo.dataset.curriculoEn
    : linkCurriculo.dataset.curriculoPt;

  document.documentElement.lang = ingles ? 'en' : 'pt-BR';
  botaoIdioma.setAttribute('aria-checked', String(ingles));
  idiomaAtual = idioma;

  try {
    localStorage.setItem('idioma', idioma);
  } catch (erro) {
    // Se o navegador bloquear, o site funciona normalmente, só não lembra a escolha
  }
}

botaoIdioma.addEventListener('click', () => {
  aplicarIdioma(idiomaAtual === 'pt' ? 'en' : 'pt');
});

// Ao abrir o site, usa o idioma escolhido da última vez
let idiomaSalvo = 'pt';
try {
  idiomaSalvo = localStorage.getItem('idioma') || 'pt';
} catch (erro) {}

aplicarIdioma(idiomaSalvo);