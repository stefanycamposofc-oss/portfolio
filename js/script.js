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

