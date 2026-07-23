async function buscarDados() {

    try {

        const resposta = await fetch(CONFIG.apiURL);

        const dados = await resposta.json();

        return dados;

    } catch (erro) {

        console.error("Erro ao acessar a API:", erro);

        return null;

    }

}

async function enviarReserva(reserva){

    try{

        const resposta = await fetch(CONFIG.apiURL,{

            method:"POST",

            body:JSON.stringify(reserva)

        });

        return await resposta.json();

    }

    catch(erro){

        console.error(erro);

        return null;

    }

}

async function fazerLogin(usuario, senha) {

  return enviarAcaoAPI({

    acao: "login",

    usuario: usuario,

    senha: senha

  });

}

async function listarReservasAdmin(token) {
  return enviarAcaoAPI({
    acao: "listarReservas",
    token: token
  });
}


async function confirmarReservaAdmin(
  token,
  idReserva
) {
  return enviarAcaoAPI({
    acao: "confirmarReserva",
    token: token,
    idReserva: idReserva
  });
}


async function cancelarReservaAdmin(
  token,
  idReserva
) {
  return enviarAcaoAPI({
    acao: "cancelarReserva",
    token: token,
    idReserva: idReserva
  });
}


async function enviarAcaoAPI(dados) {

  try {

    const resposta = await fetch(
      CONFIG.apiURL,
      {
        method: "POST",

        body: JSON.stringify(dados)
      }
    );

    const texto = await resposta.text();

    console.log(
      "Resposta recebida da API:",
      texto
    );

    return JSON.parse(texto);

  } catch (erro) {

    console.error(
      "Erro ao acessar a API:",
      erro
    );

    return {
      sucesso: false,
      erro: "FALHA_DE_CONEXAO"
    };

  }

}

async function obterEstatisticasAdmin(token){

    return enviarAcaoAPI({

        acao:"estatisticas",

        token:token

    });

}

async function buscarEstatisticasAdmin(
  token
) {

  return enviarAcaoAPI({

    acao: "obterEstatisticas",

    token: token

  });

}