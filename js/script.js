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
const secoes = document.querySelectorAll('.sobre, .habilidades, .projetos, .certificados, .contato');

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
    
  linkCurriculo.download = ingles
    ? 'Resume-Stefany-Campos.pdf'
    : 'Curriculo-Stefany-Campos.pdf';

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

// ========== FIO DE OURO DO CURSOR ==========
const temMouse = window.matchMedia('(pointer: fine)').matches;
const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (temMouse && !menosMovimento) {
  const canvas = document.createElement('canvas');
  canvas.className = 'fio-de-ouro';
  document.body.appendChild(canvas);

  const pincel = canvas.getContext('2d');
  const pontos = [];
  const duracao = 600;
  const suavidade = 0.18;

  const mouse = { x: 0, y: 0 };
  const ponta = { x: 0, y: 0 };
  let animando = false;

  function ajustarTamanho() {
    const escala = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * escala;
    canvas.height = window.innerHeight * escala;
    pincel.setTransform(escala, 0, 0, escala, 0, 0);
  }

  ajustarTamanho();
  window.addEventListener('resize', ajustarTamanho);

  function desenhar() {
    const agora = performance.now();

    // A ponta do fio persegue o mouse aos poucos
    ponta.x += (mouse.x - ponta.x) * suavidade;
    ponta.y += (mouse.y - ponta.y) * suavidade;

    // Só guarda um ponto novo se a ponta se mexeu
    const ultimo = pontos[pontos.length - 1];
    if (!ultimo || Math.abs(ponta.x - ultimo.x) + Math.abs(ponta.y - ultimo.y) > 0.5) {
      pontos.push({ x: ponta.x, y: ponta.y, tempo: agora });
    }

    // Tira os pontos velhos
    while (pontos.length && agora - pontos[0].tempo > duracao) {
      pontos.shift();
    }

    pincel.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pincel.lineCap = 'round';
    pincel.lineJoin = 'round';

    // Desenha curvas suaves entre os pontos
    for (let i = 2; i < pontos.length; i++) {
      const p0 = pontos[i - 2];
      const p1 = pontos[i - 1];
      const p2 = pontos[i];

      const inicioX = (p0.x + p1.x) / 2;
      const inicioY = (p0.y + p1.y) / 2;
      const fimX = (p1.x + p2.x) / 2;
      const fimY = (p1.y + p2.y) / 2;

      const vida = 1 - (agora - p2.tempo) / duracao;
      const r = Math.round(138 + (245 - 138) * vida);
      const g = Math.round(106 + (225 - 106) * vida);
      const b = Math.round(47 + (164 - 47) * vida);

      pincel.strokeStyle = `rgba(${r}, ${g}, ${b}, ${vida})`;
      pincel.lineWidth = 2.5 * vida;
      pincel.shadowColor = 'rgba(233, 208, 143, 0.6)';
      pincel.shadowBlur = 8 * vida;

      pincel.beginPath();
      pincel.moveTo(inicioX, inicioY);
      pincel.quadraticCurveTo(p1.x, p1.y, fimX, fimY);
      pincel.stroke();
    }

    // Continua enquanto ainda tem rastro na tela
    if (pontos.length > 0) {
      requestAnimationFrame(desenhar);
    } else {
      pincel.clearRect(0, 0, window.innerWidth, window.innerHeight);
      animando = false;
    }
  }

  document.addEventListener('mousemove', (evento) => {
    mouse.x = evento.clientX;
    mouse.y = evento.clientY;

    if (!animando) {
      ponta.x = mouse.x;
      ponta.y = mouse.y;
      animando = true;
      requestAnimationFrame(desenhar);
    }
  });
}


// ========== FUNDO VINHO QUE MUDA COM A ROLAGEM ==========
{
  const fundo = document.createElement('canvas');
  fundo.className = 'fundo-vinho';
  fundo.setAttribute('aria-hidden', 'true');
  document.body.prepend(fundo);

  const tinta = fundo.getContext('2d');

  // As "paradas" da luz: onde ela fica e que cor tem em cada parte da página
  const paradas = [
    { x: 0.85, y: 0.15, raio: 0.75, cor: [58, 12, 22], forca: 0.9 },
    { x: 0.15, y: 0.5, raio: 0.8, cor: [110, 15, 29], forca: 0.55 },
    { x: 0.7, y: 0.75, raio: 0.7, cor: [92, 15, 28], forca: 0.7 },
    { x: 0.5, y: 0.95, raio: 1.1, cor: [43, 8, 16], forca: 1 }
  ];

  let largura, altura;
  let alvo = 0;
  let atual = 0;
  let desenhando = false;

  const misturar = (a, b, t) => a + (b - a) * t;
  const suavizar = (t) => t * t * (3 - 2 * t);

  function ajustarTamanho() {
    const escala = Math.min(window.devicePixelRatio || 1, 2);
    largura = window.innerWidth;
    altura = window.innerHeight;
    fundo.width = largura * escala;
    fundo.height = altura * escala;
    tinta.setTransform(escala, 0, 0, escala, 0, 0);
  }

  // Quanto da página já foi rolado, de 0 (topo) a 1 (fim)
  function progressoDaRolagem() {
    const maximo = document.documentElement.scrollHeight - window.innerHeight;
    return maximo > 0 ? Math.min(Math.max(window.scrollY / maximo, 0), 1) : 0;
  }

  function pintar(p) {
    tinta.fillStyle = '#0B0909';
    tinta.fillRect(0, 0, largura, altura);

    // Descobre entre quais paradas estamos e o quanto andou entre elas
    const trechos = paradas.length - 1;
    const posicao = p * trechos;
    const i = Math.min(Math.floor(posicao), trechos - 1);
    const t = suavizar(posicao - i);
    const de = paradas[i];
    const para = paradas[i + 1];

    const x = misturar(de.x, para.x, t) * largura;
    const y = misturar(de.y, para.y, t) * altura;
    const raio = misturar(de.raio, para.raio, t) * Math.max(largura, altura);
    const cor = de.cor.map((valor, k) => Math.round(misturar(valor, para.cor[k], t)));
    const forca = misturar(de.forca, para.forca, t);

    let luz = tinta.createRadialGradient(x, y, 0, x, y, raio);
    luz.addColorStop(0, `rgba(${cor}, ${forca})`);
    luz.addColorStop(1, 'rgba(11, 9, 9, 0)');
    tinta.fillStyle = luz;
    tinta.fillRect(0, 0, largura, altura);

    // Uma segunda luz, mais fraca, do lado oposto
    const x2 = largura - x * 0.6;
    const y2 = altura - y * 0.5;
    luz = tinta.createRadialGradient(x2, y2, 0, x2, y2, raio * 0.6);
    luz.addColorStop(0, `rgba(43, 8, 16, ${0.35 + p * 0.4})`);
    luz.addColorStop(1, 'rgba(11, 9, 9, 0)');
    tinta.fillStyle = luz;
    tinta.fillRect(0, 0, largura, altura);
  }

  // A cor anda aos poucos até a posição da rolagem
  function quadro() {
    atual += (alvo - atual) * (menosMovimento ? 1 : 0.08);
    if (Math.abs(alvo - atual) < 0.0005) atual = alvo;

    pintar(atual);

    if (atual !== alvo) {
      requestAnimationFrame(quadro);
    } else {
      desenhando = false;
    }
  }

  function atualizarFundo() {
    alvo = progressoDaRolagem();
    if (!desenhando) {
      desenhando = true;
      requestAnimationFrame(quadro);
    }
  }

  window.addEventListener('scroll', atualizarFundo, { passive: true });
  window.addEventListener('resize', () => {
    ajustarTamanho();
    pintar(atual);
    atualizarFundo();
  });

  ajustarTamanho();
  atual = alvo = progressoDaRolagem();
  pintar(atual);
}