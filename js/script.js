window.onload = iniciar;

let envioReservaEmAndamento = false;

async function iniciar(){

    const dados = await buscarDados();

    if(dados == null){

        return;

    }

    mostrarConfiguracoes(dados.config);

    mostrarFotos(dados.fotos);

    mostrarPresentes(dados.presentes);

}

    mostrarConfiguracoes(dados.config);

    mostrarPresentes(dados.presentes);

}

function mostrarConfiguracoes(config){

    document.getElementById("nomesNoivos").innerHTML=

    config.NomeNoivo + " & " + config.NomeNoiva;

    document.getElementById("mensagemPrincipal").innerHTML=

    config.MensagemInicial;

}

function mostrarFotos(fotos){

    const galeria = document.getElementById("galeria");

    galeria.innerHTML = "";

    if(!fotos || fotos.length === 0){

        galeria.innerHTML = `
            <p class="mensagemSemFotos">
                As fotos serão adicionadas em breve.
            </p>
        `;

        return;

    }

    fotos.forEach(foto => {

        const imagem = document.createElement("img");

        imagem.src = "img/casal/" + foto.foto;

        imagem.alt = foto.descricao || "Foto de Felipe e Natália";

        imagem.classList.add("fotoGaleria");

        galeria.appendChild(imagem);

    });

}

function criarCard(presente){

    const valor = Number(presente.valor).toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    });

    let etiqueta = "";
    let status = "";

    if(presente.tipo === "MULTIPLO"){

        etiqueta = `
            <span class="tagMultiplo">
                💙 Contribuição Livre
            </span>
        `;

    }else{

        etiqueta = `
            <span class="tagUnico">
                🎁 Presente Único
            </span>
        `;

        if(presente.status === "RESERVADO"){

            status = `
                <div class="statusReservado">
                    Reservado
                </div>
            `;

        }else{

            status = `
                <div class="statusDisponivel">
                    Disponível
                </div>
            `;

        }

    }

    return `

        <div class="card">

            ${status}

            <img src="img/presentes/${presente.foto}" alt="${presente.nome}">

            <h3>${presente.nome}</h3>

            <p class="valor">${valor}</p>

            ${etiqueta}

            <button
                class="botaoEscolher"
                onclick="abrirModal(${presente.id})">

                Escolher Presente

            </button>

        </div>

    `;

}

function mostrarPresentes(lista){

    listaPresentes = lista;

    const area = document.getElementById("listaPresentes");

    area.innerHTML = "";

    lista.forEach(presente=>{

        area.innerHTML += criarCard(presente);

    });

}

let listaPresentes = [];

let presenteSelecionado = null;

function abrirModal(id){

    presenteSelecionado = listaPresentes.find(
        p => Number(p.id) === Number(id)
    );

    if(!presenteSelecionado){
        return;
    }

    document.getElementById("modalImagem").src =
        "img/presentes/" + presenteSelecionado.foto;

    document.getElementById("modalNome").innerHTML =
        presenteSelecionado.nome;

    document.getElementById("modalValor").innerHTML =
        Number(presenteSelecionado.valor).toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

    document.getElementById("modalPresente").style.display="flex";

}

function fecharModal(){

    document.getElementById("modalPresente").style.display="none";

}

window.onclick = function(event){

    const modal = document.getElementById("modalPresente");

    if(event.target === modal){

        fecharModal();

    }

}

function copiarPix(){

    navigator.clipboard.writeText(

        presenteSelecionado.pix

    ).then(()=>{

        alert("Código PIX copiado!");

    });

}

function abrirQRCode(){

    window.open(

        "img/qrcode/" + presenteSelecionado.qr,

        "_blank"

    );

}

async function confirmarPagamento(){

    const reserva={

        idPresente:presenteSelecionado.id,

        nome:document.getElementById("nomeConvidado").value,

        whatsapp:document.getElementById("whatsappConvidado").value,

        mensagem:document.getElementById("mensagemConvidado").value

    };

    const resposta=await enviarReserva(reserva);

    if(resposta && resposta.sucesso){

        alert(

            "Obrigado! Recebemos sua informação. Assim que confirmarmos o PIX, o presente será reservado."

        );

        fecharModal();

        return;

    }

    alert("Erro ao enviar.");

}
