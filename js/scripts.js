
document.addEventListener("DOMContentLoaded", () => {
    // PAGE HOME-MISSOES
    if (document.querySelector(".missao-container")) {
        const cards = Array.from(document.querySelectorAll(".card-missao"));
        const botoes = Array.from(document.querySelectorAll(".card-missao .btn"));
        const medalha = document.querySelector(".medalha");
        const placar = document.getElementById("placar");

        if (!cards.length || !botoes.length || !medalha) {
            console.warn("Confere as classes .card-missao, .card-missao .btn e .medalha no HTML.");
            return;
        }

        let concluidas = 0;
        let pontos = 0;
        const total = cards.length;

        // pegando número da badge (+150 pts)
        function pontosDaBadge(card) {
            const badge = card.querySelector(".badge");
            if (!badge) return 0;
            const match = badge.textContent.match(/(\d+)/); // pega os dígitos
            return match ? parseInt(match[1], 10) : 0;
        }

        // botões não enviam o formulário sem querer
        botoes.forEach(btn => {
            if (!btn.getAttribute("type")) btn.setAttribute("type", "button");
        });

        botoes.forEach(btn => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".card-missao");
                if (!card || card.classList.contains("concluida")) return;

                // marca concluída
                card.classList.add("concluida");
                btn.textContent = "Concluída";
                btn.disabled = true;

                // soma pontos
                pontos += pontosDaBadge(card);
                if (placar) placar.textContent = `${pontos} pts`;

                // conta concluídas
                concluidas++;

                // se todas foram concluídas, mostra medalha
                if (concluidas === total) {
                    medalha.classList.add("show");
                }
            });
        });

        //Pegar medalha
        const btnPegar = document.querySelector(".medalha .btn-pegar");
        if (btnPegar) {
            btnPegar.addEventListener("click", () => {
                //pega medalha e soma no storage
                let qtd = parseInt(localStorage.getItem("medalhas")) || 0;
                qtd++;
                localStorage.setItem("medalhas", qtd);

                //apos pegar a medalha, dispara uma msg de aviso
                alert("Medalha adicionada ao seu perfil! 🏅");

                //depois que a medalha é apanhada, volta a ficar invisivel
                medalha.classList.remove("show");
            });
        }

    }




    // GAME PAGE
    if (document.querySelector(".mapa-game")) {

        const caminho = document.querySelector(".caminho");

        //recupera o progresso do usuario (caso o usuário não tenha começado ainda, começa na posição 1 do mapa)
        let posicaoAtual = parseInt(localStorage.getItem("posicaoAtual")) || 1;
        let ultimaData = localStorage.getItem("ultimaData");


        //Checando se passou 24h
        const agora = new Date();
        if (ultimaData) {
            const ultima = new Date(ultimaData);
            const diffHoras = (agora - ultima) / (1000 * 60 * 60);

            if (diffHoras >= 24) {
                posicaoAtual++;
                localStorage.setItem("ultimaData", agora);
            }
        } else {
            localStorage.setItem("ultimaData", agora);
        }

        localStorage.setItem("posicaoAtual", posicaoAtual);


        //chamar funcao etapas disponiveis:
        renderizarEtapas(caminho, posicaoAtual);

        //Etapa ativa:
        document.querySelectorAll(".etapa").forEach((etapa, index) => {
            etapa.classList.toggle("ativo", index + 1 === posicaoAtual);
        })
    }



    //RANKING PAGE
    //array com colaboradores
    if (document.querySelector(".ranking-list")) {
        const colaboradores = [
            { nome: "Maria Silva", pontos: 1500, foto: "../img/img_perfil.png" },
            { nome: "João Luiz", pontos: 1350, foto: "../img/img_perfil02.png" },
            { nome: "Sonia Castelo", pontos: 1200, foto: "../img/img_perfil04.png" },
            { nome: "Jeruza Góes", pontos: 1100, foto: "../img/img_perfil03.png" },
            { nome: "Ariel Gonzaga", pontos: 950, foto: "../img/img_perfil05.png" }
        ];

        const rankingList = document.querySelector(".ranking-list");


        //ordenando por pontuação (maior para menor)
        colaboradores.sort((a, b) => b.pontos - a.pontos);


        //criando cada li do ranking dinamicamente
        colaboradores.forEach((colab, index) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

            // ícone do pódio (ouro, prata, bronze)
            let icone = '<i class="fa-solid fa-medal"></i>';
            if (index === 0) icone = '<i class="fa-solid fa-trophy" style="color: gold;"></i>';
            else if (index === 1) icone = '<i class="fa-solid fa-trophy" style="color: silver;"></i>';
            else if (index === 2) icone = '<i class="fa-solid fa-trophy" style="color: #cd7f32;"></i>';

            // montando cada item (medalha, foto, posicao, nome)
            li.innerHTML = `
              <span>${icone} <span class="foto-perfil"><img src="${colab.foto}" alt="perfil"></span>${index + 1}º - ${colab.nome}</span>
              <span class="badge">${colab.pontos} pts</span>
            `;

            // aplicando o efeito derrapagem dinamicamente em cada li
            li.style.animationDelay = `${index * 0.2}s`;

            rankingList.appendChild(li);
        });
    }


    //PROFILE PAGE
    if (document.getElementById("nivel-colaborador")) {

        //pegando o <td> do html-perfil
        const nivelTd = document.getElementById("nivel-colaborador");
        if (!nivelTd) return;

        //array com os niveis
        const niveis = ["Iniciante", "Pro", "Especialista", "Mestre"];

        // Recupera a data inicial do localStorage
        let dataInicio = localStorage.getItem("dataInicioNivel");

        // Se ainda não existir data inicial, cria e salva
        if (!dataInicio) {
            dataInicio = new Date().toISOString();
            localStorage.setItem("dataInicioNivel", dataInicio);
        }

        const hoje = new Date();
        const inicio = new Date(dataInicio);

        // Dias que passaram desde o início
        const diffDias = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));

        // Define o índice do nível (um nível a cada 30 dias)
        let indiceNivel = Math.floor(diffDias / 30);

        // Não deixa passar do último nível
        if (indiceNivel >= niveis.length) {
            indiceNivel = niveis.length - 1;
        }

        // Atualiza o td com o nível correto
        nivelTd.textContent = niveis[indiceNivel];

        //atualizando qtd medalhas no perfil
        if (document.getElementById("qtd-medalhas")) {
            const medalhasTd = document.getElementById("qtd-medalhas");
            const qtd = parseInt(localStorage.getItem("medalhas")) || 0;
            medalhasTd.textContent = qtd;
        }
    }
});



//Funcao renderizar (add) etapas
function renderizarEtapas(caminho, posicaoAtual) {
    const etapasExistentes = caminho.querySelectorAll(".etapa").length;

    // Se não tiver etapas suficientes, cria novas
    if (etapasExistentes < posicaoAtual) {
        for (let i = etapasExistentes + 1; i <= posicaoAtual; i++) {
            // Corações entre etapas
            const coracoes = document.createElement("div");
            coracoes.classList.add("caminho-game");
            coracoes.innerHTML = `
                              <i class="fa-solid fa-heart"></i>
                              <i class="fa-solid fa-heart"></i>
                              <i class="fa-solid fa-heart"></i>
                              <i class="fa-solid fa-heart"></i>`;

            // Zig-zag dos corações
            if (i % 2 === 1) {
                coracoes.style.marginLeft = "3rem";
                coracoes.style.transform = "rotate(-30deg)";
            } else {
                coracoes.style.marginRight = "3rem";
                coracoes.style.transform = "rotate(30deg)";
            }
            caminho.appendChild(coracoes);

            // Etapa nova
            const etapa = document.createElement("figure");
            etapa.classList.add("etapa", `etapa-${i}`);
            etapa.innerHTML = `
                <img src="../img/carrinho_feliz-removebg-preview.png" alt="carrinho feliz">
                <span class="numero">${i}</span>
      `;

            // Zig-zag das etapas
            if (i % 2 === 1) {
                etapa.style.alignSelf = "flex-end";
                etapa.style.marginLeft = "3rem";
            } else {
                etapa.style.alignSelf = "flex-start";
                etapa.style.marginRight = "3rem";
            }

            caminho.appendChild(etapa);
        }
    }
}
