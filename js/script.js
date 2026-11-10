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

function moverTrilho(direcao) {
  const card = trilho.querySelector('.certificado');
  if (!card) return;

  const passo = card.offsetWidth + 24;
  trilho.scrollBy({ left: passo * direcao, behavior: 'smooth' });
}

setaAnterior.addEventListener('click', () => moverTrilho(-1));
setaProxima.addEventListener('click', () => moverTrilho(1));

// ========== COPIAR E-MAIL ==========
const botaoEmail = document.querySelector('.copiar-email');
const avisoCopiado = document.querySelector('.aviso-copiado');

botaoEmail.addEventListener('click', () => {
  const email = botaoEmail.dataset.email;

  navigator.clipboard.writeText(email)
    .then(() => {
      avisoCopiado.textContent = 'E-mail copiado!';
    })
    .catch(() => {
      avisoCopiado.textContent = 'Não foi possível copiar. Use o link "Enviar e-mail".';
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
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

secoes.forEach((secao) => {
  secao.classList.add('revelar');
  observador.observe(secao);
});