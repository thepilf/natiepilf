async function entrar() {
  const campoUsuario =
    document.getElementById("usuario");

  const campoSenha =
    document.getElementById("senha");

  const mensagem =
    document.getElementById("mensagemLogin");

  const usuario = campoUsuario.value.trim();
  const senha = campoSenha.value.trim();

  if (!usuario || !senha) {
    mensagem.textContent =
      "Preencha o usuário e a senha.";

    return;
  }

  mensagem.textContent =
    "Verificando acesso...";

  try {
    const resposta =
      await fazerLogin(usuario, senha);

    console.log(
      "Resposta do login:",
      resposta
    );

    if (
      resposta &&
      resposta.sucesso === true &&
      resposta.token
    ) {
      localStorage.setItem(
        "adminToken",
        resposta.token
      );

      window.location.href =
        "./painel.html";

      return;
    }

    if (
      resposta &&
      resposta.erro ===
        "CREDENCIAIS_INVALIDAS"
    ) {
      mensagem.textContent =
        "Usuário ou senha incorretos.";

      return;
    }

    mensagem.textContent =
      "Não foi possível realizar o login.";
  } catch (erro) {
    console.error(
      "Erro durante o login:",
      erro
    );

    mensagem.textContent =
      "Erro de conexão com o sistema.";
  }
}


document.addEventListener(
  "DOMContentLoaded",
  function () {
    const painel =
      document.getElementById("painelReservas");

    if (painel) {
      carregarPainel();
    }

    const campoSenha =
      document.getElementById("senha");

    if (campoSenha) {
      campoSenha.addEventListener(
        "keydown",
        function (evento) {
          if (evento.key === "Enter") {
            entrar();
          }
        }
      );
    }
  }
);


async function carregarPainel() {
    function sessaoInvalida(resposta) {

     return (
      !resposta ||
       resposta.erro ===
         "SESSAO_INVALIDA"
       );

    }
    function renderizarEstatisticas(
  estatisticas
) {

  if (!estatisticas) {

    mostrarMensagemEstatisticas(
      "Estatísticas indisponíveis."
    );

    return;

  }


  definirTextoElemento(
    "estatisticaDisponiveis",
    estatisticas.unicosDisponiveis
  );


  definirTextoElemento(
    "estatisticaReservados",
    estatisticas.unicosReservados
  );


  definirTextoElemento(
    "estatisticaPendentes",
    estatisticas.pagamentosPendentes
  );


  definirTextoElemento(
    "estatisticaConfirmados",
    estatisticas.contribuicoesConfirmadas
  );


  definirTextoElemento(
    "estatisticaValor",
    formatarMoeda(
      estatisticas.valorTotalConfirmado
    )
  );


  mostrarMensagemEstatisticas(
    "Informações atualizadas."
  );

}

function definirTextoElemento(
  id,
  valor
) {

  const elemento =
    document.getElementById(id);

  if (elemento) {

    elemento.textContent =
      valor ?? 0;

  }

}

function mostrarMensagemEstatisticas(
  texto
) {

  const mensagem =
    document.getElementById(
      "mensagemEstatisticas"
    );

  if (mensagem) {

    mensagem.textContent =
      texto;

  }

}

  const token =
    localStorage.getItem(
      "adminToken"
    );


  if (!token) {

    voltarParaLogin();

    return;

  }


  mostrarMensagemPainel(
    "Carregando solicitações..."
  );

  mostrarMensagemEstatisticas(
    "Carregando estatísticas..."
  );


  try {

    const resultados =
      await Promise.all([

        listarReservasAdmin(token),

        buscarEstatisticasAdmin(token)

      ]);


    const respostaReservas =
      resultados[0];

    const respostaEstatisticas =
      resultados[1];


    if (
      sessaoInvalida(
        respostaReservas
      ) ||
      sessaoInvalida(
        respostaEstatisticas
      )
    ) {

      localStorage.removeItem(
        "adminToken"
      );

      voltarParaLogin();

      return;

    }


    if (
      respostaReservas &&
      respostaReservas.sucesso
    ) {

      renderizarReservas(
        respostaReservas.reservas
      );

    } else {

      mostrarMensagemPainel(
        "Não foi possível carregar as solicitações."
      );

    }


    if (
      respostaEstatisticas &&
      respostaEstatisticas.sucesso
    ) {

      renderizarEstatisticas(
        respostaEstatisticas.estatisticas
      );

    } else {

      mostrarMensagemEstatisticas(
        "Não foi possível carregar as estatísticas."
      );

    }

  } catch (erro) {

    console.error(
      "Erro ao carregar o painel:",
      erro
    );


    mostrarMensagemPainel(
      "Erro de conexão ao carregar as solicitações."
    );


    mostrarMensagemEstatisticas(
      "Erro de conexão ao carregar as estatísticas."
    );

  }

}


function renderizarReservas(reservas) {
  const area =
    document.getElementById(
      "painelReservas"
    );

  if (!area) {
    return;
  }

  area.replaceChildren();

  if (
    !reservas ||
    reservas.length === 0
  ) {
    mostrarMensagemPainel(
      "Não existem pagamentos pendentes."
    );

    return;
  }

  mostrarMensagemPainel(
    reservas.length +
      " solicitação(ões) aguardando confirmação."
  );

  reservas.forEach(function (reserva) {
    area.appendChild(
      criarCardReserva(reserva)
    );
  });
}


function criarCardReserva(reserva) {
  const card =
    document.createElement("article");

  card.className = "cardReserva";

  const titulo =
    document.createElement("h3");

  titulo.textContent =
    reserva.presenteNome ||
    "Presente não encontrado";

  const valor =
    document.createElement("p");

  valor.className = "valorReserva";

  valor.textContent =
    formatarMoeda(
      reserva.presenteValor
    );

  const tipo =
    document.createElement("p");

  tipo.className = "tipoReserva";

  tipo.textContent =
    String(reserva.presenteTipo)
      .toUpperCase() === "MULTIPLO"
      ? "Contribuição livre"
      : "Presente único";

  const convidado =
    document.createElement("p");

  convidado.textContent =
    "Convidado: " +
    (
      reserva.nomePessoa ||
      "Não informado"
    );

  const whatsapp =
    document.createElement("p");

  whatsapp.textContent =
    "WhatsApp: " +
    (
      reserva.whatsapp ||
      "Não informado"
    );

  card.append(
    titulo,
    valor,
    tipo,
    convidado,
    whatsapp
  );

  if (reserva.mensagem) {
    const mensagem =
      document.createElement("p");

    mensagem.className =
      "mensagemReserva";

    mensagem.textContent =
      "Mensagem: " +
      reserva.mensagem;

    card.appendChild(mensagem);
  }

  const botoes =
    document.createElement("div");

  botoes.className =
    "acoesReserva";

  const botaoConfirmar =
    document.createElement("button");

  botaoConfirmar.type = "button";

  botaoConfirmar.className =
    "botaoConfirmarReserva";

  botaoConfirmar.textContent =
    "Confirmar pagamento";

  botaoConfirmar.addEventListener(
    "click",
    function () {
      processarConfirmacao(
        reserva.idReserva,
        botaoConfirmar
      );
    }
  );

  const botaoCancelar =
    document.createElement("button");

  botaoCancelar.type = "button";

  botaoCancelar.className =
    "botaoCancelarReserva";

  botaoCancelar.textContent =
    "Cancelar solicitação";

  botaoCancelar.addEventListener(
    "click",
    function () {
      processarCancelamento(
        reserva.idReserva,
        botaoCancelar
      );
    }
  );

  botoes.append(
    botaoConfirmar,
    botaoCancelar
  );

  card.appendChild(botoes);

  return card;
}


async function processarConfirmacao(
  idReserva,
  botao
) {
  const desejaConfirmar =
    window.confirm(
      "Você conferiu o recebimento do PIX e deseja confirmar este pagamento?"
    );

  if (!desejaConfirmar) {
    return;
  }

  const token =
    localStorage.getItem("adminToken");

  if (!token) {
    voltarParaLogin();
    return;
  }

  botao.disabled = true;
  botao.textContent =
    "Confirmando...";

  try {
    const resposta =
      await confirmarReservaAdmin(
        token,
        idReserva
      );

    if (
      resposta &&
      resposta.erro ===
        "SESSAO_INVALIDA"
    ) {
      localStorage.removeItem(
        "adminToken"
      );

      voltarParaLogin();
      return;
    }

    if (
      resposta &&
      resposta.erro ===
        "PRESENTE_JA_RESERVADO"
    ) {
      window.alert(
        "Esse presente único já foi reservado para outra pessoa."
      );

      await carregarPainel();
      return;
    }

    if (
      !resposta ||
      !resposta.sucesso
    ) {
      window.alert(
        "Não foi possível confirmar o pagamento."
      );

      botao.disabled = false;

      botao.textContent =
        "Confirmar pagamento";

      return;
    }

    window.alert(
      "Pagamento confirmado com sucesso."
    );

    await carregarPainel();
  } catch (erro) {
    console.error(
      "Erro ao confirmar:",
      erro
    );

    window.alert(
      "Erro de conexão ao confirmar."
    );

    botao.disabled = false;

    botao.textContent =
      "Confirmar pagamento";
  }
}


async function processarCancelamento(
  idReserva,
  botao
) {
  const desejaCancelar =
    window.confirm(
      "Deseja realmente cancelar esta solicitação?"
    );

  if (!desejaCancelar) {
    return;
  }

  const token =
    localStorage.getItem("adminToken");

  if (!token) {
    voltarParaLogin();
    return;
  }

  botao.disabled = true;

  botao.textContent =
    "Cancelando...";

  try {
    const resposta =
      await cancelarReservaAdmin(
        token,
        idReserva
      );

    if (
      resposta &&
      resposta.erro ===
        "SESSAO_INVALIDA"
    ) {
      localStorage.removeItem(
        "adminToken"
      );

      voltarParaLogin();
      return;
    }

    if (
      !resposta ||
      !resposta.sucesso
    ) {
      window.alert(
        "Não foi possível cancelar a solicitação."
      );

      botao.disabled = false;

      botao.textContent =
        "Cancelar solicitação";

      return;
    }

    window.alert(
      "Solicitação cancelada."
    );

    await carregarPainel();
  } catch (erro) {
    console.error(
      "Erro ao cancelar:",
      erro
    );

    window.alert(
      "Erro de conexão ao cancelar."
    );

    botao.disabled = false;

    botao.textContent =
      "Cancelar solicitação";
  }
}


function mostrarMensagemPainel(texto) {
  const mensagem =
    document.getElementById(
      "mensagemPainel"
    );

  if (mensagem) {
    mensagem.textContent = texto;
  }
}


function formatarMoeda(valor) {
  return Number(
    valor || 0
  ).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );
}


function sair() {
  localStorage.removeItem(
    "adminToken"
  );

  voltarParaLogin();
}


function voltarParaLogin() {
  window.location.href =
    "./admin.html";
}