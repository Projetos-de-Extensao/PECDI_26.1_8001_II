const inputImagem = document.querySelector('#arquivo-imagem');
const botaoSelecionar = document.querySelector('#botao-selecionar');
const zonaDrop = document.querySelector('#zona-drop');
const retornoUpload = document.querySelector('#retorno-upload');
const previewConteudo = document.querySelector('#preview-conteudo');
const botaoRemover = document.querySelector('#botao-remover');

const MAX_TAMANHO = 5 * 1024 * 1024;
const FORMATOS_ACEITOS = ['image/jpeg', 'image/png'];

function exibirMensagem(texto, erro = false) {
  retornoUpload.textContent = texto;
  retornoUpload.style.color = erro ? '#c70000' : '#55638c';
}

function limparPreview() {
  previewConteudo.innerHTML = '<p class="preview-texto">Aguardando arquivo...</p>';
  botaoRemover.disabled = true;
}

function validarArquivo(arquivo) {
  if (!arquivo) {
    exibirMensagem('Nenhum arquivo foi selecionado.', true);
    return false;
  }

  if (!FORMATOS_ACEITOS.includes(arquivo.type)) {
    exibirMensagem('Formato inválido. Use JPG ou PNG.', true);
    return false;
  }

  if (arquivo.size > MAX_TAMANHO) {
    exibirMensagem('Arquivo muito grande. Máximo 5 MB.', true);
    return false;
  }

  return true;
}

function atualizarPreview(arquivo) {
  const leitor = new FileReader();
  leitor.onload = () => {
    previewConteudo.innerHTML = `
      <img src="${leitor.result}" alt="Pré-visualização da imagem">
      <div class="detalhes-imagem">
        <p><strong>Nome:</strong> ${arquivo.name}</p>
        <p><strong>Tamanho:</strong> ${(arquivo.size / 1024).toFixed(1)} KB</p>
      </div>
    `;
    botaoRemover.disabled = false;
    exibirMensagem('Imagem carregada com sucesso.');
  };
  leitor.readAsDataURL(arquivo);
}

function processarArquivo(arquivo) {
  if (!validarArquivo(arquivo)) {
    limparPreview();
    return;
  }

  atualizarPreview(arquivo);
}

botaoSelecionar.addEventListener('click', () => {
  inputImagem.click();
});

inputImagem.addEventListener('change', (evento) => {
  const arquivo = evento.target.files[0];
  processarArquivo(arquivo);
});

zonaDrop.addEventListener('dragenter', (evento) => {
  evento.preventDefault();
  zonaDrop.classList.add('ativo');
});

zonaDrop.addEventListener('dragover', (evento) => {
  evento.preventDefault();
  zonaDrop.classList.add('ativo');
});

zonaDrop.addEventListener('dragleave', () => {
  zonaDrop.classList.remove('ativo');
});

zonaDrop.addEventListener('drop', (evento) => {
  evento.preventDefault();
  zonaDrop.classList.remove('ativo');
  const arquivo = evento.dataTransfer.files[0];
  processarArquivo(arquivo);
});

botaoRemover.addEventListener('click', () => {
  inputImagem.value = '';
  limparPreview();
  exibirMensagem('Removido. Selecione outra imagem para continuar.');
});

limparPreview();
